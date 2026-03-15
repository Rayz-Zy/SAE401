<?php

namespace App\Controller;

use App\Entity\Departement;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\StatistiquesDepartement;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;


class ApiController extends AbstractController
{
    #[Route('/statistic', name: 'app_statistic')]
   public function statistic(EntityManagerInterface $entityManager): Response
   {
    $statistiques = $entityManager->getRepository(StatistiquesDepartement::class)->findAll();

    return $this->json($statistiques, 200, [], ['groups' => 'Statistiques_departement']);
   }

   #[Route('/statistic/departement', name: 'app_departement')]
   public function departement(EntityManagerInterface $entityManager): Response
   {
    $statistiques = $entityManager->getRepository(Departement::class)->findAll();

    return $this->json($statistiques, 200, [], ['groups' => 'departement']);
   }

   #[Route('/statistic/statistiques_departement/{code}', name: 'app_statistique_departement')]
    public function statistiquesDepartement(EntityManagerInterface $entityManager, string $code): Response
    {
     $statistiques = $entityManager->getRepository(StatistiquesDepartement::class)->findBy(['departement' => $code]);
    
     if (!$statistiques) {
         return $this->json(['message' => 'Statistiques non trouvées pour ce département'], 404);
     }

     return $this->json($statistiques, 200, [], ['groups' => 'Statistiques_departement']);
    }


}