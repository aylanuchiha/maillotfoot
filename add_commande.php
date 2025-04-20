<?php
header("Content-Type: application/json"); // Important pour retour JSON propre

require 'bdd.php'; // Connexion à la base

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
$quantite = $data['quantite'];
$prixTotal = $data['prixTotal'];
$prixUnitaire = $data['prixUnitaire'];
$grossiste = $data['grossiste'];
$telephone = $data['telephone'];
$date = $data['date'];

try {
    $stmt = $pdo->prepare("INSERT INTO commandes (nom, quantite, prix_total, prix_unitaire, grossiste, telephone, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$nom, $quantite, $prixTotal, $prixUnitaire, $grossiste, $telephone, $date]);

    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
