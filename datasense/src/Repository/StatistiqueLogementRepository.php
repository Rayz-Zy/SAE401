<?php

namespace App\Repository;

use App\Entity\StatistiqueLogement;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<StatistiqueLogement>
 */
class StatistiqueLogementRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, StatistiqueLogement::class);
    }
}
