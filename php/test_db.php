<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'bdd.php';


try {
    // Si ce code s'exécute, la connexion a réussi
    echo "Connexion à la base de données réussie!";

    // Tester la requête SELECT
    $stmt = $pdo->query("SELECT 1");
    echo "<br>Test de requête réussi!";

    // Lister les tables
    $stmt = $pdo->query("SHOW TABLES");
    echo "<br>Tables dans la base de données:<br>";
    while ($row = $stmt->fetch()) {
        echo "- " . $row[0] . "<br>";
    }
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage();
}
?>