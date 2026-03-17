<?php

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "--- STRUCTURE sushi_paradise.users ---\n";
    $stmt = $pdo->query("DESCRIBE sushi_paradise.users");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }

    echo "\n--- DATA (first 5 rows) ---\n";
    $stmt = $pdo->query("SELECT * FROM sushi_paradise.users LIMIT 5");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }

} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
}
