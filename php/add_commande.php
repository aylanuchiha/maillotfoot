<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Si besoin pour le développement
header("Access-Control-Allow-Headers: Content-Type");

require_once 'bdd.php'; // Assurez-vous que le chemin est correct

// Récupération des données JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Données JSON invalides.']);
    exit;
}

// Protection basique (vérifie que toutes les données sont présentes)
$required = ['nom', 'quantite', 'prixTotal', 'prixUnitaire', 'grossiste', 'telephone', 'date'];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => "Champ manquant : $field"]);
        exit;
    }
}

$nom = $data['nom'];
$quantite = intval($data['quantite']);
$prixTotal = floatval($data['prixTotal']);
$prixUnitaire = floatval($data['prixUnitaire']);
$grossiste = $data['grossiste'];
$telephone = $data['telephone'];
$date = $data['date'];

try {
    $stmt = $pdo->prepare("INSERT INTO commandes (nom, quantite, prix_total, prix_unitaire, grossiste, telephone, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$nom, $quantite, $prixTotal, $prixUnitaire, $grossiste, $telephone, $date]);

    echo json_encode(['status' => 'success', 'message' => 'Commande ajoutée avec succès']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'ajout en base de données']);

    // Logging pour debug (à retirer en production)
    error_log('Erreur DB: ' . $e->getMessage());
}
?>
