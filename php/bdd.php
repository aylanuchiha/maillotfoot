<?php
$host = "localhost"; // Généralement correct pour Hostinger
$db = "u130341384_maillot_db";
$user = "u130341384_aylan";
$pass = "Hamid_Bozboz2002"; // Utilisez votre vrai mot de passe ici
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Log l'erreur pour le débogage
    error_log('Erreur de connexion à la base de données: ' . $e->getMessage());

    // Retourne une erreur en JSON si c'est un appel AJAX
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données']);
        exit;
    }

    // Sinon, afficher un message d'erreur plus convivial
    die('Erreur de connexion à la base de données. Veuillez réessayer plus tard.');
}
