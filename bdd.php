<?php
// Connexion à la base de données
$host = "localhost"; // ou autre selon hostinger
$dbname = "u130341384_maillot_db";
$username = "u130341384_aylan";
$password = "Hamid_Bozboz2002";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    // Activer les exceptions PDO
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>