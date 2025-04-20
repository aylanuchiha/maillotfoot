<?php
// Connexion à la base de données
$host = "localhost"; // ou autre selon hostinger
$db = "u130341384_maillot_db";
$user = "u130341384_aylan";
$pass = "Hamid_Bozboz2002";
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    exit('Erreur de connexion à la base de données : ' . $e->getMessage());
}
?>