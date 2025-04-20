<?php
require 'bdd.php';

$data = json_decode(file_get_contents('php://input'), true);

$nom = $data['nom'];
$quantite = $data['quantite'];
$prixTotal = $data['prixTotal'];
$prixUnitaire = $data['prixUnitaire'];
$grossiste = $data['grossiste'];
$telephone = $data['telephone'];
$date = $data['date'];

$stmt = $pdo->prepare("INSERT INTO commandes (nom, quantite, prix_total, prix_unitaire, grossiste, telephone, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([$nom, $quantite, $prixTotal, $prixUnitaire, $grossiste, $telephone, $date]);

echo json_encode(['status' => 'success']);
?>
