<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\RegionRepository;
use App\Repository\DepartementRepository;
use App\Repository\StatistiquesDepartementRepository;

#[Route('/api')]
class ApiController extends AbstractController
{
    #[Route('/regions', name: 'api_regions_list', methods: ['GET'])]
    public function listRegions(RegionRepository $regionRepo): JsonResponse
    {
        $regions = $regionRepo->findAll();

        $data = array_map(fn($region) => [
            'code' => $region->getCode(),
            'nom'  => $region->getNom(),
        ], $regions);

        return $this->json($data);
    }

    #[Route('/regions/{code}', name: 'api_region_detail', methods: ['GET'])]
    public function getRegion(RegionRepository $regionRepo, string $code): JsonResponse
    {
        $region = $regionRepo->find($code);

        if (!$region) {
            return $this->json(['error' => 'Region not found'], 404);
        }

        return $this->json([
            'code' => $region->getCode(),
            'nom'  => $region->getNom(),
        ]);
    }

    #[Route('/departements', name: 'api_departements_list', methods: ['GET'])]
    public function listDepartements(DepartementRepository $departementRepo): JsonResponse
    {
        $departements = $departementRepo->findAll();

        $data = array_map(fn($dep) => [
            'code'       => $dep->getCode(),
            'nom'        => $dep->getNom(),
            'regionCode' => $dep->getCodeRegion()?->getCode(),
        ], $departements);

        return $this->json($data);
    }

    #[Route('/departements/{code}', name: 'api_departement_detail', methods: ['GET'])]
    public function getDepartement(DepartementRepository $departementRepo, string $code): JsonResponse
    {
        $departement = $departementRepo->find($code);

        if (!$departement) {
            return $this->json(['error' => 'Département not found'], 404);
        }

        return $this->json([
            'code'       => $departement->getCode(),
            'nom'        => $departement->getNom(),
            'regionCode' => $departement->getCodeRegion()?->getCode(),
        ]);
    }

    #[Route('/statistiques', name: 'api_statistiques_list', methods: ['GET'])]
    public function listStatistiques(StatistiquesDepartementRepository $statsRepo): JsonResponse
    {
        $statistiques = $statsRepo->findAll();

        $data = array_map(fn($stat) => [
            'id'                       => $stat->getId(),
            'departement'              => $stat->getDepartement()?->getCode(),
            'anneePublication'         => $stat->getAnneePublication(),
            'nombreHabitants'          => $stat->getNombreHabitants(),
            'densitePopulation'        => $stat->getDensitePopulation(),
            'variationPopulation10Ans' => $stat->getVariationPopulation10Ans(),
            'tauxChomageT4'            => $stat->getTauxChomageT4(),
            'tauxPauvrete'             => $stat->getTauxPauvrete(),
            'contribution_solde_naturel'     => $stat->getContributionSoldeNaturel(),
        ], $statistiques);

        return $this->json($data);
    }

    #[Route('/statistiques/departement/{code}', name: 'api_statistiques_by_dept', methods: ['GET'])]
    public function getStatistiquesByDepartement(
        StatistiquesDepartementRepository $statsRepo,
        DepartementRepository $deptRepo,
        string $code
    ): JsonResponse {
        $departement = $deptRepo->find($code);

        if (!$departement) {
            return $this->json(['error' => 'Département not found'], 404);
        }

        $allStats = $statsRepo->findAll();
        
        $data = array_filter(
            array_map(fn($stat) => [
                'id'                       => $stat->getId(),
                'departement'              => $stat->getDepartement()?->getCode(),
                'anneePublication'         => $stat->getAnneePublication(),
                'nombreHabitants'          => $stat->getNombreHabitants(),
                'densitePopulation'        => $stat->getDensitePopulation(),
                'variationPopulation10Ans' => $stat->getVariationPopulation10Ans(),
                'tauxChomageT4'            => $stat->getTauxChomageT4(),
                'tauxPauvrete'             => $stat->getTauxPauvrete(),
                'contribution_solde_naturel'     => $stat->getContributionSoldeNaturel(),
            ], $allStats),
            fn($stat) => $stat['departement'] === $code
        );

        return $this->json(array_values($data));
    }
}