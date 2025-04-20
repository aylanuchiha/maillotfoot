<?php
// ajouter_commande.php
require_once 'bdd.php';

$data = json_decode(file_get_contents('php://input'), true);

$nom = $data['nom'];
$quantite = $data['quantite'];
$prixTotal = $data['prixTotal'];
$prixUnitaire = $data['prixUnitaire'];
$grossiste = $data['grossiste'];
$telephone = $data['telephone'];
$date = $data['date'];

try {
    $stmt = $pdo->prepare("INSERT INTO commande (nom, quantite, prixTotal, prixUnitaire, grossiste, telephone, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$nom, $quantite, $prixTotal, $prixUnitaire, $grossiste, $telephone, $date]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
