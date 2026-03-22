<?php

namespace App\Controller;

use App\Entity\Departement;
use App\Entity\Region;
use App\Entity\StatistiqueLogement;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

final class StatistiqueController extends AbstractController
{
    public function logement(EntityManagerInterface $entityManager): Response
    {
        $statistiques = $entityManager->getRepository(StatistiqueLogement::class)->findAll();

        return $this->json($statistiques, 200, [], ['groups' => 'logement']);
    }

    public function departement(EntityManagerInterface $entityManager): Response
    {
        $departements = $entityManager->getRepository(Departement::class)->findAll();

        return $this->json($departements, 200, [], ['groups' => 'departement']);
    }

    public function region(EntityManagerInterface $entityManager): Response
    {
        $regions = $entityManager->getRepository(Region::class)->findAll();

        return $this->json($regions, 200, [], ['groups' => 'region']);
    }


    public function statistiquesLogementCode(EntityManagerInterface $entityManager, string $code): Response
    {
        $statistiques = $entityManager->getRepository(StatistiqueLogement::class)->findBy(['departement' => $code]);

        if (!$statistiques) {
            return $this->json(['message' => 'Statistiques non trouvées pour ce code'], 404);
        }

        return $this->json($statistiques, 200, [], ['groups' => 'logement']);
    }

    public function statistiquesLogementRegion(EntityManagerInterface $entityManager, string $code): Response
    {
        // On récupère toutes les statistiques des départements appartenant à la région
        $queryBuilder = $entityManager->createQueryBuilder();
        $queryBuilder->select('s')
            ->from(StatistiqueLogement::class, 's')
            ->join('s.departement', 'd')
            ->join('d.region', 'r')
            ->where('r.code = :regionCode')
            ->setParameter('regionCode', $code);

        $statistiques = $queryBuilder->getQuery()->getResult();

        if (!$statistiques) {
            return $this->json(['message' => 'Statistiques non trouvées pour cette région'], 404);
        }

        // Grouper par année pour agréger les données
        $statsAgregees = [];
        foreach ($statistiques as $s) {
            $annee = $s->getAnneePublication();
            if (!isset($statsAgregees[$annee])) {
                $statsAgregees[$annee] = [
                    'anneePublication' => $annee,
                    'nombreHabitants' => 0,
                    'nombreLogement' => 0,
                    'tauxChomageT4' => 0,
                    'tauxPauvrete' => 0,
                    'count' => 0, // Pour calculer des moyennes si nécessaire
                    'densitePopulation' => 0,
                    'tauxLogementsSociaux' => 0,
                    'tauxDeLogementsVacants' => 0,
                    'pourcentageMoins20Ans' => 0,
                    'parcSocialAgeMoyen' => 0,
                    'parcSocialTauxLogementsEnergivores' => 0,
                ];
            }

            $statsAgregees[$annee]['nombreHabitants'] += $s->getNombreHabitants();
            $statsAgregees[$annee]['nombreLogement'] += $s->getNombreLogements();
            $statsAgregees[$annee]['tauxChomageT4'] += (float)$s->getTauxChomageT4();
            $statsAgregees[$annee]['tauxPauvrete'] += (float)$s->getTauxPauvrete();
            $statsAgregees[$annee]['densitePopulation'] += (float)$s->getDensitePopulation();
            $statsAgregees[$annee]['tauxLogementsSociaux'] += (float)$s->getTauxLogementsSociaux();
            $statsAgregees[$annee]['tauxDeLogementsVacants'] += (float)$s->getTauxLogementsVacants();
            $statsAgregees[$annee]['pourcentageMoins20Ans'] += (float)$s->getPourcentageMoins20Ans();
            $statsAgregees[$annee]['parcSocialAgeMoyen'] += (float)$s->getParcSocialAgeMoyen();
            $statsAgregees[$annee]['parcSocialTauxLogementsEnergivores'] += (float)$s->getParcSocialTauxLogementsEnergivores();
            $statsAgregees[$annee]['count']++;
        }

        // Calculer les moyennes pour les taux
        $resultat = [];
        foreach ($statsAgregees as $annee => $data) {
            if ($data['count'] > 0) {
                $data['tauxChomageT4'] = round($data['tauxChomageT4'] / $data['count'], 2);
                $data['tauxPauvrete'] = round($data['tauxPauvrete'] / $data['count'], 2);
                $data['densitePopulation'] = round($data['densitePopulation'] / $data['count'], 2);
                $data['tauxLogementsSociaux'] = round($data['tauxLogementsSociaux'] / $data['count'], 2);
                $data['tauxDeLogementsVacants'] = round($data['tauxDeLogementsVacants'] / $data['count'], 2);
                $data['pourcentageMoins20Ans'] = round($data['pourcentageMoins20Ans'] / $data['count'], 2);
                $data['parcSocialAgeMoyen'] = round($data['parcSocialAgeMoyen'] / $data['count'], 2);
                $data['parcSocialTauxLogementsEnergivores'] = round($data['parcSocialTauxLogementsEnergivores'] / $data['count'], 2);
            }
            unset($data['count']);
            $resultat[] = $data;
        }

        return $this->json($resultat, 200);
    }
}
