<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class CorsSubscriber implements EventSubscriberInterface
{
    // Mets ici tes origines autorisées (Vite)
    private const ALLOWED_ORIGINS = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ];

    // Si tu veux limiter à tes routes API uniquement, mets '/api'
    private const ONLY_PATH_PREFIX = null; // ex: '/api' ou null pour global

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST  => ['onKernelRequest', 1000],
            KernelEvents::RESPONSE => ['onKernelResponse', 0],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();

        if (!$this->shouldApplyToPath($request->getPathInfo())) {
            return;
        }

        // Réponse immédiate aux preflight
        if ($request->getMethod() === 'OPTIONS') {
            $response = new Response('', 204);
            $this->applyCors($request->headers->get('Origin'), $response);
            $event->setResponse($response);
        }
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $response = $event->getResponse();

        if (!$this->shouldApplyToPath($request->getPathInfo())) {
            return;
        }

        $this->applyCors($request->headers->get('Origin'), $response);
    }

    private function shouldApplyToPath(string $path): bool
    {
        if (self::ONLY_PATH_PREFIX === null) {
            return true; // global
        }

        return str_starts_with($path, self::ONLY_PATH_PREFIX);
    }

    private function applyCors(?string $origin, Response $response): void
    {
        if ($origin !== null && in_array($origin, self::ALLOWED_ORIGINS, true)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            // Important quand tu autorises plusieurs origines
            $response->headers->set('Vary', 'Origin');
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        $response->headers->set('Access-Control-Max-Age', '3600');

        // Décommente si tu utilises des cookies/sessions côté front:
        // $response->headers->set('Access-Control-Allow-Credentials', 'true');
    }
}