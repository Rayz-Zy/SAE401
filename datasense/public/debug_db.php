<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "DEBUG CONNECTION START\n";
echo "Current File: " . __FILE__ . "\n";
echo "Current Time: " . date('Y-m-d H:i:s') . "\n";

$hosts = ['127.0.0.1', 'localhost', '::1'];
foreach ($hosts as $host) {
    echo "--- Testing host: $host ---\n";
    try {
        $pdo = new PDO("mysql:host=$host;port=3306", "root", "");
        echo "RESULT: SUCCESS!\n";
        
        $stmt = $pdo->query("SHOW DATABASES");
        echo "Databases: " . implode(', ', $stmt->fetchAll(PDO::FETCH_COLUMN)) . "\n";
    } catch (PDOException $e) {
        echo "RESULT: FAILED: " . $e->getMessage() . "\n";
    } catch (Exception $e) {
        echo "RESULT: GENERAL FAILED: " . $e->getMessage() . "\n";
    }
}
echo "DEBUG CONNECTION END\n";
