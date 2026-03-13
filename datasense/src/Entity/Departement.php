<?php

namespace App\Entity;

use App\Repository\DepartementRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: DepartementRepository::class)]
class Departement
{
    #[ORM\Id]
    #[ORM\Column(length: 3)]
    #[Groups(['logement', 'departement', 'region'])]
    private ?string $code = null;

    #[ORM\Column(length: 255)]
    #[Groups(['logement', 'departement', 'region'])]
    private ?string $nom = null;

    #[ORM\ManyToOne(inversedBy: 'departements')]
    #[ORM\JoinColumn(name: 'code_region', referencedColumnName: 'code', nullable: true)]
    #[Groups(['departement'])]
    private ?Region $region = null;

    #[ORM\OneToMany(targetEntity: StatistiqueLogement::class, mappedBy: 'departement')]
    #[Groups(['departement', 'region'])]
    private Collection $statistiqueLogements;

    public function __construct()
    {
        $this->statistiqueLogements = new ArrayCollection();
    }

    public function getCode(): ?string
    {
        return $this->code;
    }
    public function setCode(string $code): static
    {
        $this->code = $code;
        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }
    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getRegion(): ?Region
    {
        return $this->region;
    }
    public function setRegion(?Region $region): static
    {
        $this->region = $region;
        return $this;
    }

    public function getStatistiqueLogements(): Collection
    {
        return $this->statistiqueLogements;
    }

    public function addStatistiqueLogement(StatistiqueLogement $statistiqueLogement): static
    {
        if (!$this->statistiqueLogements->contains($statistiqueLogement)) {
            $this->statistiqueLogements->add($statistiqueLogement);
            $statistiqueLogement->setDepartement($this);
        }
        return $this;
    }

    public function removeStatistiqueLogement(StatistiqueLogement $statistiqueLogement): static
    {
        if ($this->statistiqueLogements->removeElement($statistiqueLogement)) {
            if ($statistiqueLogement->getDepartement() === $this) {
                $statistiqueLogement->setDepartement(null);
            }
        }
        return $this;
    }
}
