<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing connections...<br>";

try {
    echo "Trying 127.0.0.1... ";
    $pdo1 = new PDO("mysql:host=127.0.0.1;port=3306", "root", "");
    echo "SUCCESS!<br>";
} catch (\Exception $e) {
    echo "FAILED: " . $e->getMessage() . "<br>";
}

try {
    echo "Trying localhost... ";
    $pdo2 = new PDO("mysql:host=localhost;port=3306", "root", "");
    echo "SUCCESS!<br>";
} catch (\Exception $e) {
    echo "FAILED: " . $e->getMessage() . "<br>";
}

try {
    echo "Trying with DB datasense... ";
    $pdo3 = new PDO("mysql:host=127.0.0.1;port=3306;dbname=datasense", "root", "");
    echo "SUCCESS!<br>";
} catch (\Exception $e) {
    echo "FAILED: " . $e->getMessage() . "<br>";
}
echo "Done.";
