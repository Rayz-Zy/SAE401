<?php

namespace App\Command;

use App\Entity\Departement;
use App\Entity\Region;
use App\Entity\StatistiqueLogement;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:import-stats',
    description: 'Import housing statistics from a CSV file',
)]
class ImportStatsCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('file', InputArgument::REQUIRED, 'The CSV file path')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $filePath = $input->getArgument('file');

        if (!file_exists($filePath)) {
            $io->error(sprintf('File not found: %s', $filePath));
            return Command::FAILURE;
        }

        if (($handle = fopen($filePath, 'r')) !== false) {
            stream_filter_append($handle, 'convert.iconv.WINDOWS-1252/UTF-8');

            $headerResource = fgetcsv($handle, 0, ';');
            if (!$headerResource) {
                $io->error('Could not read CSV header');
                return Command::FAILURE;
            }

            $normalize = function($s) {
                $s = preg_replace('/^\xEF\xBB\xBF/', '', $s);
                $s = mb_strtolower($s, 'UTF-8');
                $s = str_replace(
                    ['à', 'á', 'â', 'ã', 'ä', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ'],
                    ['a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y'],
                    $s
                );
                $s = preg_replace('/[^a-z0-9]/', '_', $s);
                return trim(preg_replace('/_+/', '_', $s), '_');
            };

            $header = array_map($normalize, $headerResource);

            $io->note('Starting import...');

            $keyMap = [
                $normalize('année_publication') => 'annee_publication',
                $normalize('code_departement') => 'code_departement',
                $normalize('nom_departement') => 'nom_departement',
                $normalize('code_region') => 'code_region',
                $normalize('nom_region') => 'nom_region',
                $normalize('nombre d\'habitants') => 'nombre_habitants',
                $normalize('densite de population au km²') => 'densite_population',
                $normalize('variation de la population sur 10 ans (en %)') => 'variation_population_10_ans',
                $normalize('dont contribution du solde naturel (en %)') => 'contribution_solde_naturel',
                $normalize('dont contribution du solde migratoire (en %)') => 'contribution_solde_migratoire',
                $normalize('% population de moins de 20 ans') => 'pourcentage_moins_20_ans',
                $normalize('% population de 60 ans et plus') => 'pourcentage_plus_60_ans',
                $normalize('taux de chomage au t4 (en %)') => 'taux_chomage_t4',
                $normalize('taux de pauvrete* (en %)') => 'taux_pauvrete',
                $normalize('nombre de logements') => 'nb_logements',
                $normalize('nombre de residences principales') => 'nb_residences_principales',
                $normalize('taux de logements sociaux* (en %)') => 'taux_logements_sociaux',
                $normalize('taux de logements vacants* (en %)') => 'taux_vacance',
                $normalize('taux de logements individuels (en %)') => 'taux_logements_individuels',
                $normalize('moyenne annuelle de la construction neuve sur 10 ans') => 'construction_neuve_10_ans',
                $normalize('construction') => 'construction',
                $normalize('parc social - nombre de logements') => 'parc_social_nb_logements',
                $normalize('parc social - logements mis en location*') => 'parc_social_logements_mis_location',
                $normalize('parc social - logements demolis') => 'parc_social_logements_demolis',
                $normalize('parc social - ventes a des personnes physiques') => 'parc_social_ventes_physiques',
                $normalize('parc social - taux de logements vacants* (en %)') => 'parc_social_taux_vacance',
                $normalize('parc social - taux de logements individuels (en %)') => 'parc_social_taux_logements_individuels',
                $normalize('parc social - loyer moyen (en €/m²/mois)*') => 'parc_social_loyer_moyen',
                $normalize('parc social - age moyen du parc (en annees)') => 'parc_social_age_moyen',
                $normalize('parc social - taux de logements energivores (e,f,g)* (en %)') => 'parc_social_taux_logements_energivores',
            ];

            $batchSize = 20;
            $i = 0;

            while (($data = fgetcsv($handle, 0, ';')) !== false) {
                $data = array_map('trim', $data);
                if (count($data) !== count($header)) continue;

                $rawRow = array_combine($header, $data);
                $row = [];
                foreach ($keyMap as $normalizedSource => $targetKey) {
                    if (isset($rawRow[$normalizedSource])) {
                        $row[$targetKey] = $rawRow[$normalizedSource];
                    }
                }

                $requiredKeys = [
                    'code_region', 'nom_region', 'code_departement', 'nom_departement', 'annee_publication',
                    'nb_logements', 'nb_residences_principales', 'taux_logements_sociaux', 'taux_vacance',
                    'taux_logements_individuels', 'construction_neuve_10_ans', 'construction',
                    'parc_social_nb_logements', 'parc_social_logements_mis_location', 'parc_social_logements_demolis',
                    'parc_social_ventes_physiques', 'parc_social_taux_vacance', 'parc_social_taux_logements_individuels',
                    'parc_social_loyer_moyen', 'parc_social_age_moyen', 'parc_social_taux_logements_energivores',
                    'variation_population_10_ans', 'contribution_solde_naturel', 'contribution_solde_migratoire',
                    'pourcentage_moins_20_ans', 'pourcentage_plus_60_ans', 'taux_chomage_t4', 'taux_pauvrete',
                    'nombre_habitants', 'densite_population'
                ];

                try {
                    foreach ($requiredKeys as $key) {
                        if (!isset($row[$key])) {
                            $io->writeln('Missing key: ' . $key);
                            $io->writeln('Available normalized headers: ' . implode(', ', array_keys($rawRow)));
                            throw new \Exception(sprintf('Missing required key: %s', $key));
                        }
                    }

                    $regionCode = $row['code_region'];
                    $region = $this->entityManager->getRepository(Region::class)->find($regionCode);
                    if (!$region) {
                        $region = new Region();
                        $region->setCode($regionCode);
                        $region->setNom($row['nom_region']);
                        $this->entityManager->persist($region);
                    }

                    $deptCode = $row['code_departement'];
                    $departement = $this->entityManager->getRepository(Departement::class)->find($deptCode);
                    if (!$departement) {
                        $departement = new Departement();
                        $departement->setCode($deptCode);
                        $departement->setNom($row['nom_departement']);
                        $departement->setRegion($region);
                        $this->entityManager->persist($departement);
                    }

                    $annee = (int)$row['annee_publication'];
                    $stat = $this->entityManager->getRepository(StatistiqueLogement::class)->findOneBy([
                        'anneePublication' => $annee,
                        'departement' => $departement
                    ]);

                    if (!$stat) {
                        $stat = new StatistiqueLogement();
                        $stat->setAnneePublication($annee);
                        $stat->setDepartement($departement);
                    }

                    $stat->setNombreHabitants($this->toInt($row['nombre_habitants']));
                    $stat->setDensitePopulation($this->toDecimal($row['densite_population']));
                    $stat->setVariationPopulation10Ans($this->toDecimal($row['variation_population_10_ans']));
                    $stat->setContributionSoldeNaturel($this->toDecimal($row['contribution_solde_naturel']));
                    $stat->setContributionSoldeMigratoire($this->toDecimal($row['contribution_solde_migratoire']));
                    $stat->setPourcentageMoins20Ans($this->toDecimal($row['pourcentage_moins_20_ans']));
                    $stat->setPourcentagePlus60Ans($this->toDecimal($row['pourcentage_plus_60_ans']));
                    $stat->setTauxChomageT4($this->toDecimal($row['taux_chomage_t4']));
                    $stat->setTauxPauvrete($this->toDecimal($row['taux_pauvrete']));
                    $stat->setNombreLogements($this->toInt($row['nb_logements']));
                    $stat->setNombreResidencesPrincipales($this->toInt($row['nb_residences_principales']));
                    $stat->setTauxLogementsSociaux($this->toDecimal($row['taux_logements_sociaux']));
                    $stat->setTauxLogementsVacants($this->toDecimal($row['taux_vacance']));
                    $stat->setTauxLogementsIndividuels($this->toDecimal($row['taux_logements_individuels']));
                    $stat->setMoyenneAnnuelleConstructionNeuve10Ans($this->toInt($row['construction_neuve_10_ans']));
                    $stat->setConstruction($this->toDecimal($row['construction']));
                    $stat->setParcSocialNombreLogements($this->toInt($row['parc_social_nb_logements']));
                    $stat->setParcSocialLogementsMisLocation($this->toInt($row['parc_social_logements_mis_location']));
                    $stat->setParcSocialLogementsDemolis($this->toInt($row['parc_social_logements_demolis']));
                    $stat->setParcSocialVentesPersonnesPhysiques($this->toInt($row['parc_social_ventes_physiques']));
                    $stat->setParcSocialTauxLogementsVacants($this->toDecimal($row['parc_social_taux_vacance']));
                    $stat->setParcSocialTauxLogementsIndividuels($this->toDecimal($row['parc_social_taux_logements_individuels']));
                    $stat->setParcSocialLoyerMoyen($this->toDecimal($row['parc_social_loyer_moyen']));
                    $stat->setParcSocialAgeMoyen($this->toDecimal($row['parc_social_age_moyen']));
                    $stat->setParcSocialTauxLogementsEnergivores($this->toDecimal($row['parc_social_taux_logements_energivores']));

                    $this->entityManager->persist($stat);

                    if (($i % $batchSize) === 0) {
                        $this->entityManager->flush();
                        $this->entityManager->clear();
                    }
                    $i++;
                } catch (\Exception $e) {
                    $io->error(sprintf('Error at row %d: %s', $i + 1, $e->getMessage()));
                    return Command::FAILURE;
                }
            }
            fclose($handle);
            $this->entityManager->flush();
            $io->success(sprintf('Imported %d rows successfully.', $i));
        }

        return Command::SUCCESS;
    }

    private function toInt($value): ?int
    {
        return $value === '' ? null : (int)$value;
    }

    private function toDecimal($value): ?string
    {
        return $value === '' ? null : str_replace(',', '.', $value);
    }
}
