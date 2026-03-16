<?php

namespace App\Entity;

use App\Repository\StatistiqueLogementRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Attribute\SerializedName;

#[ORM\Entity(repositoryClass: StatistiqueLogementRepository::class)]
class StatistiqueLogement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['logement', 'departement', 'region'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Groups(['logement'])]
    private ?int $anneePublication = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logement'])]
    private ?int $nombreHabitants = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $densitePopulation = null;

    #[ORM\Column(name: 'variation_population_10_ans', type: Types::DECIMAL, precision: 6, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $variationPopulation10Ans = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $contributionSoldeNaturel = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $contributionSoldeMigratoire = null;

    #[ORM\Column(name: 'pourcentage_moins_20_ans', type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $pourcentageMoins20Ans = null;

    #[ORM\Column(name: 'pourcentage_plus_60_ans', type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $pourcentagePlus60Ans = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $tauxChomageT4 = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $tauxPauvrete = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logement', 'departement', 'region'])]
    #[SerializedName('nombreLogement')]
    private ?int $nombreLogements = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logement'])]
    private ?int $nombreResidencesPrincipales = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $tauxLogementsSociaux = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['logement', 'departement', 'region'])]
    #[SerializedName('tauxDeLogementsVacants')]
    private ?string $tauxLogementsVacants = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $tauxLogementsIndividuels = null;

    #[ORM\Column(name: 'moyenne_annuelle_construction_neuve_10_ans', nullable: true)]
    #[Groups(['logement'])]
    private ?int $moyenneAnnuelleConstructionNeuve10Ans = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 8, scale: 2, nullable: true)]
    #[Groups(['logement', 'departement', 'region'])]
    private ?string $construction = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logement'])]
    private ?int $parcSocialNombreLogements = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logement', 'departement', 'region'])]
    #[SerializedName('logementsMisEnLocation')]
    private ?int $parcSocialLogementsMisLocation = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logement'])]
    private ?int $parcSocialLogementsDemolis = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logement'])]
    private ?int $parcSocialVentesPersonnesPhysiques = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $parcSocialTauxLogementsVacants = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $parcSocialTauxLogementsIndividuels = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2, nullable: true)]
    #[Groups(['logement', 'departement', 'region'])]
    #[SerializedName('loyerMoyen')]
    private ?string $parcSocialLoyerMoyen = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $parcSocialAgeMoyen = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['logement'])]
    private ?string $parcSocialTauxLogementsEnergivores = null;

    #[ORM\ManyToOne(inversedBy: 'statistiqueLogements')]
    #[ORM\JoinColumn(name: 'code_departement', referencedColumnName: 'code', nullable: false)]
    #[Groups(['logement'])]
    private ?Departement $departement = null;

    public function getId(): ?int { return $this->id; }

    public function getAnneePublication(): ?int { return $this->anneePublication; }
    public function setAnneePublication(int $anneePublication): static { $this->anneePublication = $anneePublication; return $this; }

    public function getNombreHabitants(): ?int { return $this->nombreHabitants; }
    public function setNombreHabitants(?int $nombreHabitants): static { $this->nombreHabitants = $nombreHabitants; return $this; }

    public function getDensitePopulation(): ?string { return $this->densitePopulation; }
    public function setDensitePopulation(?string $densitePopulation): static { $this->densitePopulation = $densitePopulation; return $this; }

    public function getVariationPopulation10Ans(): ?string { return $this->variationPopulation10Ans; }
    public function setVariationPopulation10Ans(?string $variationPopulation10Ans): static { $this->variationPopulation10Ans = $variationPopulation10Ans; return $this; }

    public function getContributionSoldeNaturel(): ?string { return $this->contributionSoldeNaturel; }
    public function setContributionSoldeNaturel(?string $contributionSoldeNaturel): static { $this->contributionSoldeNaturel = $contributionSoldeNaturel; return $this; }

    public function getContributionSoldeMigratoire(): ?string { return $this->contributionSoldeMigratoire; }
    public function setContributionSoldeMigratoire(?string $contributionSoldeMigratoire): static { $this->contributionSoldeMigratoire = $contributionSoldeMigratoire; return $this; }

    public function getPourcentageMoins20Ans(): ?string { return $this->pourcentageMoins20Ans; }
    public function setPourcentageMoins20Ans(?string $pourcentageMoins20Ans): static { $this->pourcentageMoins20Ans = $pourcentageMoins20Ans; return $this; }

    public function getPourcentagePlus60Ans(): ?string { return $this->pourcentagePlus60Ans; }
    public function setPourcentagePlus60Ans(?string $pourcentagePlus60Ans): static { $this->pourcentagePlus60Ans = $pourcentagePlus60Ans; return $this; }

    public function getTauxChomageT4(): ?string { return $this->tauxChomageT4; }
    public function setTauxChomageT4(?string $tauxChomageT4): static { $this->tauxChomageT4 = $tauxChomageT4; return $this; }

    public function getTauxPauvrete(): ?string { return $this->tauxPauvrete; }
    public function setTauxPauvrete(?string $tauxPauvrete): static { $this->tauxPauvrete = $tauxPauvrete; return $this; }

    public function getNombreLogements(): ?int { return $this->nombreLogements; }
    public function setNombreLogements(?int $nombreLogements): static { $this->nombreLogements = $nombreLogements; return $this; }

    public function getNombreResidencesPrincipales(): ?int { return $this->nombreResidencesPrincipales; }
    public function setNombreResidencesPrincipales(?int $nombreResidencesPrincipales): static { $this->nombreResidencesPrincipales = $nombreResidencesPrincipales; return $this; }

    public function getTauxLogementsSociaux(): ?string { return $this->tauxLogementsSociaux; }
    public function setTauxLogementsSociaux(?string $tauxLogementsSociaux): static { $this->tauxLogementsSociaux = $tauxLogementsSociaux; return $this; }

    public function getTauxLogementsVacants(): ?string { return $this->tauxLogementsVacants; }
    public function setTauxLogementsVacants(?string $tauxLogementsVacants): static { $this->tauxLogementsVacants = $tauxLogementsVacants; return $this; }

    public function getTauxLogementsIndividuels(): ?string { return $this->tauxLogementsIndividuels; }
    public function setTauxLogementsIndividuels(?string $tauxLogementsIndividuels): static { $this->tauxLogementsIndividuels = $tauxLogementsIndividuels; return $this; }

    public function getMoyenneAnnuelleConstructionNeuve10Ans(): ?int { return $this->moyenneAnnuelleConstructionNeuve10Ans; }
    public function setMoyenneAnnuelleConstructionNeuve10Ans(?int $moyenneAnnuelleConstructionNeuve10Ans): static { $this->moyenneAnnuelleConstructionNeuve10Ans = $moyenneAnnuelleConstructionNeuve10Ans; return $this; }

    public function getConstruction(): ?string { return $this->construction; }
    public function setConstruction(?string $construction): static { $this->construction = $construction; return $this; }

    public function getParcSocialNombreLogements(): ?int { return $this->parcSocialNombreLogements; }
    public function setParcSocialNombreLogements(?int $parcSocialNombreLogements): static { $this->parcSocialNombreLogements = $parcSocialNombreLogements; return $this; }

    public function getParcSocialLogementsMisLocation(): ?int { return $this->parcSocialLogementsMisLocation; }
    public function setParcSocialLogementsMisLocation(?int $parcSocialLogementsMisLocation): static { $this->parcSocialLogementsMisLocation = $parcSocialLogementsMisLocation; return $this; }

    public function getParcSocialLogementsDemolis(): ?int { return $this->parcSocialLogementsDemolis; }
    public function setParcSocialLogementsDemolis(?int $parcSocialLogementsDemolis): static { $this->parcSocialLogementsDemolis = $parcSocialLogementsDemolis; return $this; }

    public function getParcSocialVentesPersonnesPhysiques(): ?int { return $this->parcSocialVentesPersonnesPhysiques; }
    public function setParcSocialVentesPersonnesPhysiques(?int $parcSocialVentesPersonnesPhysiques): static { $this->parcSocialVentesPersonnesPhysiques = $parcSocialVentesPersonnesPhysiques; return $this; }

    public function getParcSocialTauxLogementsVacants(): ?string { return $this->parcSocialTauxLogementsVacants; }
    public function setParcSocialTauxLogementsVacants(?string $parcSocialTauxLogementsVacants): static { $this->parcSocialTauxLogementsVacants = $parcSocialTauxLogementsVacants; return $this; }

    public function getParcSocialTauxLogementsIndividuels(): ?string { return $this->parcSocialTauxLogementsIndividuels; }
    public function setParcSocialTauxLogementsIndividuels(?string $parcSocialTauxLogementsIndividuels): static { $this->parcSocialTauxLogementsIndividuels = $parcSocialTauxLogementsIndividuels; return $this; }

    public function getParcSocialLoyerMoyen(): ?string { return $this->parcSocialLoyerMoyen; }
    public function setParcSocialLoyerMoyen(?string $parcSocialLoyerMoyen): static { $this->parcSocialLoyerMoyen = $parcSocialLoyerMoyen; return $this; }

    public function getParcSocialAgeMoyen(): ?string { return $this->parcSocialAgeMoyen; }
    public function setParcSocialAgeMoyen(?string $parcSocialAgeMoyen): static { $this->parcSocialAgeMoyen = $parcSocialAgeMoyen; return $this; }

    public function getParcSocialTauxLogementsEnergivores(): ?string { return $this->parcSocialTauxLogementsEnergivores; }
    public function setParcSocialTauxLogementsEnergivores(?string $parcSocialTauxLogementsEnergivores): static { $this->parcSocialTauxLogementsEnergivores = $parcSocialTauxLogementsEnergivores; return $this; }

    public function getDepartement(): ?Departement { return $this->departement; }
    public function setDepartement(?Departement $departement): static { $this->departement = $departement; return $this; }
}
