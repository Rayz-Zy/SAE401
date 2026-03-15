<?php


namespace App\Entity;


use App\Repository\StatistiquesDepartementRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;


#[ORM\Entity(repositoryClass: StatistiquesDepartementRepository::class)]
#[ORM\Table(
   name: "Statistiques_departement",
   uniqueConstraints: [
       new ORM\UniqueConstraint(
           name: "unique_departement_annee",
           columns: ["code_departement", "annee_publication"]
       )
   ]
)]
class StatistiquesDepartement
{
   #[ORM\Id]
   #[ORM\GeneratedValue]
   #[ORM\Column]
   #[Groups(['Statistiques_departement'])]
   private ?int $id = null;


   #[ORM\Column(type: "smallint")]
   #[Groups(['Statistiques_departement'])]
   private ?int $anneePublication = null;


   #[ORM\ManyToOne]
   #[Groups(['Statistiques_departement'])]
   #[ORM\JoinColumn(
       name: "code_departement",
       referencedColumnName: "code",
       nullable: false,
       onDelete: "CASCADE"
   )]
   private ?Departement $departement = null;


   #[ORM\Column(nullable: true)]
   #[Groups(['Statistiques_departement'])]

   private ?int $nombreHabitants = null;


   #[ORM\Column(type: "decimal", precision: 10, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $densitePopulation = null;


   #[ORM\Column(name: "variation_population_10_ans", type: "decimal", precision: 6, scale: 2, nullable: true)]
   #[Groups(groups: ['Statistiques_departement'])]
   private ?string $variationPopulation10Ans = null;


   #[ORM\Column(type: "decimal", precision: 6, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $contributionSoldeNaturel = null;


   #[ORM\Column(type: "decimal", precision: 6, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $contributionSoldeMigratoire = null;


   #[ORM\Column(name: "pourcentage_moins_20_ans", type: "decimal", precision: 5, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $pourcentageMoins20Ans = null;


   #[ORM\Column(name: "pourcentage_plus_60_ans", type: "decimal", precision: 5, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $pourcentagePlus60Ans = null;


   #[ORM\Column(type: "decimal", precision: 5, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $tauxChomageT4 = null;


   #[ORM\Column(type: "decimal", precision: 5, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $tauxPauvrete = null;


   #[ORM\Column(name: "nombre_logements", nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?int $nombreLogements = null;


   #[ORM\Column(nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?int $nombreResidencesPrincipales = null;


   #[ORM\Column(name: "taux_logements_sociaux", type: "decimal", precision: 5, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $TauxLogementsSociaux = null;


   #[ORM\Column(name: "taux_logements_vacants", type: "decimal", precision: 5, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $TauxLogementsVacants = null;


   #[ORM\Column(name: "taux_logements_individuels", type: "decimal", precision: 5, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $TauxLogementsIndividuels = null;


   #[ORM\Column(name: "moyenne_annuelle_construction_neuve_10_ans", nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?int $moyenneAnnuelleConstructionNeuve10Ans = null;


   #[ORM\Column(type: "decimal", precision: 8, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $construction = null;


   #[ORM\Column(name: "parc_social_nombre_logements", nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?int $ParcSocialNombreLogements = null;


   #[ORM\Column(name: "parc_social_logements_mis_location", nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?int $ParcSocialLogementsMisLocation = null;


   #[ORM\Column(name: "parc_social_logements_demolis", nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?int $ParcSocialLogementsDemolis = null;


   #[ORM\Column(nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?int $parcSocialVentesPersonnesPhysiques = null;


   #[ORM\Column(name: "parc_social_taux_logements_vacants", type: "decimal", precision: 5, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $parcSocialTauxLogementsVacants = null;


   #[ORM\Column(name: "parc_social_taux_logements_individuels", type: "decimal", precision: 5, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $parcSocialTauxLogementsIndividuels = null;


   #[ORM\Column(type: "decimal", precision: 6, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $parcSocialLoyerMoyen = null;


   #[ORM\Column(type: "decimal", precision: 5, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $parcSocialAgeMoyen = null;


   #[ORM\Column(name: "parc_social_taux_logements_energivores", type: "decimal", precision: 5, scale: 2, nullable: true)]
   #[Groups(['Statistiques_departement'])]
   private ?string $ParcSocialTauxLogementsEnergivores = null;


   // ======================
   // GETTERS / SETTERS
   // ======================


   public function getId(): ?int
   {
       return $this->id;
   }


   public function getAnneePublication(): ?int
   {
       return $this->anneePublication;
   }


   public function setAnneePublication(int $anneePublication): static
   {
       $this->anneePublication = $anneePublication;
       return $this;
   }


   public function getDepartement(): ?Departement
   {
       return $this->departement;
   }


   public function setDepartement(?Departement $departement): static
   {
       $this->departement = $departement;
       return $this;
   }


   public function getNombreHabitants(): ?int
   {
       return $this->nombreHabitants;
   }


   public function setNombreHabitants(?int $nombreHabitants): static
   {
       $this->nombreHabitants = $nombreHabitants;


       return $this;
   }


   public function getDensitePopulation(): ?string
   {
       return $this->densitePopulation;
   }


   public function setDensitePopulation(?string $densitePopulation): static
   {
       $this->densitePopulation = $densitePopulation;


       return $this;
   }


   public function getVariationPopulation10Ans(): ?string
   {
       return $this->variationPopulation10Ans;
   }


   public function setVariationPopulation10Ans(?string $variationPopulation10Ans): static
   {
       $this->variationPopulation10Ans = $variationPopulation10Ans;


       return $this;
   }


   public function getContributionSoldeNaturel(): ?string
   {
       return $this->contributionSoldeNaturel;
   }


   public function setContributionSoldeNaturel(?string $contributionSoldeNaturel): static
   {
       $this->contributionSoldeNaturel = $contributionSoldeNaturel;


       return $this;
   }


   public function getContributionSoldeMigratoire(): ?string
   {
       return $this->contributionSoldeMigratoire;
   }


   public function setContributionSoldeMigratoire(?string $contributionSoldeMigratoire): static
   {
       $this->contributionSoldeMigratoire = $contributionSoldeMigratoire;


       return $this;
   }


   public function getPourcentageMoins20Ans(): ?string
   {
       return $this->pourcentageMoins20Ans;
   }


   public function setPourcentageMoins20Ans(?string $pourcentageMoins20Ans): static
   {
       $this->pourcentageMoins20Ans = $pourcentageMoins20Ans;


       return $this;
   }


   public function getPourcentagePlus60Ans(): ?string
   {
       return $this->pourcentagePlus60Ans;
   }


   public function setPourcentagePlus60Ans(?string $pourcentagePlus60Ans): static
   {
       $this->pourcentagePlus60Ans = $pourcentagePlus60Ans;


       return $this;
   }


   public function getTauxChomageT4(): ?string
   {
       return $this->tauxChomageT4;
   }


   public function setTauxChomageT4(?string $tauxChomageT4): static
   {
       $this->tauxChomageT4 = $tauxChomageT4;


       return $this;
   }


   public function getTauxPauvrete(): ?string
   {
       return $this->tauxPauvrete;
   }


   public function setTauxPauvrete(?string $tauxPauvrete): static
   {
       $this->tauxPauvrete = $tauxPauvrete;


       return $this;
   }


   public function getNombreLogements(): ?int
   {
       return $this->nombreLogements;
   }


   public function setNombreLogements(?int $nombreLogements): static
   {
       $this->nombreLogements = $nombreLogements;


       return $this;
   }


   public function getNombreResidencesPrincipales(): ?int
   {
       return $this->nombreResidencesPrincipales;
   }


   public function setNombreResidencesPrincipales(?int $nombreResidencesPrincipales): static
   {
       $this->nombreResidencesPrincipales = $nombreResidencesPrincipales;


       return $this;
   }


   public function getTauxLogementsSociaux(): ?string
   {
       return $this->TauxLogementsSociaux;
   }


   public function setTauxLogementsSociaux(?string $TauxLogementsSociaux): static
   {
       $this->TauxLogementsSociaux = $TauxLogementsSociaux;


       return $this;
   }


   public function getTauxLogementsVacants(): ?string
   {
       return $this->TauxLogementsVacants;
   }


   public function setTauxLogementsVacants(?string $TauxLogementsVacants): static
   {
       $this->TauxLogementsVacants = $TauxLogementsVacants;


       return $this;
   }


   public function getTauxLogementsIndividuels(): ?string
   {
       return $this->TauxLogementsIndividuels;
   }


   public function setTauxLogementsIndividuels(?string $TauxLogementsIndividuels): static
   {
       $this->TauxLogementsIndividuels = $TauxLogementsIndividuels;


       return $this;
   }


   public function getParcSocialNombreLogements(): ?int
   {
       return $this->ParcSocialNombreLogements;
   }


   public function setParcSocialNombreLogements(?int $ParcSocialNombreLogements): static
   {
       $this->ParcSocialNombreLogements = $ParcSocialNombreLogements;


       return $this;
   }


   public function getParcSocialLogementsMisLocation(): ?int
   {
       return $this->ParcSocialLogementsMisLocation;
   }


   public function setParcSocialLogementsMisLocation(?int $ParcSocialLogementsMisLocation): static
   {
       $this->ParcSocialLogementsMisLocation = $ParcSocialLogementsMisLocation;


       return $this;
   }


   public function getParcSocialLogementsDemolis(): ?int
   {
       return $this->ParcSocialLogementsDemolis;
   }


   public function setParcSocialLogementsDemolis(?int $ParcSocialLogementsDemolis): static
   {
       $this->ParcSocialLogementsDemolis = $ParcSocialLogementsDemolis;


       return $this;
   }


   public function getParcSocialTauxLogementsVacants(): ?string
   {
       return $this->parcSocialTauxLogementsVacants;
   }


   public function setParcSocialTauxLogementsVacants(?string $parcSocialTauxLogementsVacants): static
   {
       $this->parcSocialTauxLogementsVacants = $parcSocialTauxLogementsVacants;


       return $this;
   }


   public function getParcSocialTauxLogementsIndividuels(): ?string
   {
       return $this->parcSocialTauxLogementsIndividuels;
   }


   public function setParcSocialTauxLogementsIndividuels(?string $parcSocialTauxLogementsIndividuels): static
   {
       $this->parcSocialTauxLogementsIndividuels = $parcSocialTauxLogementsIndividuels;


       return $this;
   }


   public function getParcSocialLoyerMoyen(): ?string
   {
       return $this->parcSocialLoyerMoyen;
   }


   public function setParcSocialLoyerMoyen(?string $parcSocialLoyerMoyen): static
   {
       $this->parcSocialLoyerMoyen = $parcSocialLoyerMoyen;


       return $this;
   }


   public function getParcSocialAgeMoyen(): ?string
   {
       return $this->parcSocialAgeMoyen;
   }


   public function setParcSocialAgeMoyen(?string $parcSocialAgeMoyen): static
   {
       $this->parcSocialAgeMoyen = $parcSocialAgeMoyen;


       return $this;
   }


   public function getParcSocialTauxLogementsEnergivores(): ?string
   {
       return $this->ParcSocialTauxLogementsEnergivores;
   }


   public function setParcSocialTauxLogementsEnergivores(?string $ParcSocialTauxLogementsEnergivores): static
   {
       $this->ParcSocialTauxLogementsEnergivores = $ParcSocialTauxLogementsEnergivores;


       return $this;
   }


   public function getMoyenneAnnuelleConstructionNeuve10Ans(): ?int
   {
       return $this->moyenneAnnuelleConstructionNeuve10Ans;
   }


   public function setMoyenneAnnuelleConstructionNeuve10Ans(?int $moyenneAnnuelleConstructionNeuve10Ans): static
   {
       $this->moyenneAnnuelleConstructionNeuve10Ans = $moyenneAnnuelleConstructionNeuve10Ans;


       return $this;
   }


   public function getParcSocialVentesPersonnesPhysiques(): ?int
   {
       return $this->parcSocialVentesPersonnesPhysiques;
   }


   public function setParcSocialVentesPersonnesPhysiques(?int $parcSocialVentesPersonnesPhysiques): static
   {
       $this->parcSocialVentesPersonnesPhysiques = $parcSocialVentesPersonnesPhysiques;


       return $this;
   }


   public function getConstruction(): ?string
   {
       return $this->construction;
   }


   public function setConstruction(?string $construction): static
   {
       $this->construction = $construction;


       return $this;
   }
}


