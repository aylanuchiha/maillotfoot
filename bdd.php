<?php
// Connexion à la base de données
$host = "localhost"; // ou autre selon hostinger
$dbname = "u130341384_maillot_db";
$username = "u130341384_aylan";
$password = "Hamid_Bozboz2002";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Petite requête test
    $stmt = $pdo->query("SELECT COUNT(*) FROM commande");
    $count = $stmt->fetchColumn();

    echo "✅ Connexion OK - Nombre de commandes : " . $count;
} catch (PDOException $e) {
    echo "❌ Erreur : " . $e->getMessage();
}
?>
