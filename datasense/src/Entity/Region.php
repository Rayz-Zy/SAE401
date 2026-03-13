<?php

namespace App\Entity;

use App\Repository\RegionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: RegionRepository::class)]
class Region
{
    #[ORM\Id]
    #[ORM\Column(length: 10)]
    #[Groups(['logement', 'departement', 'region'])]
    private ?string $code = null;

    #[ORM\Column(length: 255)]
    #[Groups(['logement', 'departement', 'region'])]
    private ?string $nom = null;

    #[ORM\OneToMany(targetEntity: Departement::class, mappedBy: 'region')]
    #[Groups(['region'])]
    private Collection $departements;

    public function __construct()
    {
        $this->departements = new ArrayCollection();
    }

    public function getCode(): ?string { return $this->code; }
    public function setCode(string $code): static { $this->code = $code; return $this; }

    public function getNom(): ?string { return $this->nom; }
    public function setNom(string $nom): static { $this->nom = $nom; return $this; }

    public function getDepartements(): Collection { return $this->departements; }

    public function addDepartement(Departement $departement): static
    {
        if (!$this->departements->contains($departement)) {
            $this->departements->add($departement);
            $departement->setRegion($this);
        }
        return $this;
    }

    public function removeDepartement(Departement $departement): static
    {
        if ($this->departements->removeElement($departement)) {
            if ($departement->getRegion() === $this) {
                $departement->setRegion(null);
            }
        }
        return $this;
    }
}
