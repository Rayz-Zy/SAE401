<?php
require_once __DIR__ . '/../vendor/autoload.php';

use App\Kernel;
use App\Entity\User;
use Symfony\Component\Dotenv\Dotenv;

$dotenv = new Dotenv();
$dotenv->load(__DIR__ . '/../.env');

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();

$container = $kernel->getContainer();
$entityManager = $container->get('doctrine')->getManager();

$email = '123@gmail.com';
$user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

if ($user) {
    echo "Utilisateur trouvé : " . $user->getEmail() . "\n";
    echo "Hash du mot de passe : " . $user->getPassword() . "\n";
    echo "Roles : " . implode(', ', $user->getRoles()) . "\n";
} else {
    echo "Utilisateur '$email' non trouvé dans la base de données.\n";
    
    // List all users
    $users = $entityManager->getRepository(User::class)->findAll();
    echo "\nListe de tous les utilisateurs :\n";
    foreach ($users as $u) {
        echo "- " . $u->getEmail() . "\n";
    }
}
