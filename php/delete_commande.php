<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'bdd.php';

try {
    echo "Connexion à la base de données réussie!<br>";

    // Test de requête simple
    $stmt = $pdo->query("SELECT 1");
    echo "Test de requête réussi!<br><br>";

    // Affichage des tables
    $stmt = $pdo->query("SHOW TABLES");
    echo "Tables dans la base de données:<br>";
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        echo "- " . htmlspecialchars($row[0]) . "<br>";
    }
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage();
}
?>
