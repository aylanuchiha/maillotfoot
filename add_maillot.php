<?php
require 'bdd.php';

$data = json_decode(file_get_contents('php://input'), true);

$commande_id = $data['commande_id'];
$nomExact = $data['nomExact'];
$couleur = $data['couleur'];
$image = $data['image'];
$statut = $data['statut'];
$prixUnitaire = $data['prixUnitaire'];
$prixVente = $data['prixVente'];

$stmt = $pdo->prepare("INSERT INTO maillots (commande_id, nom_exact, couleur, image, statut, prix_unitaire, prix_vente) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([$commande_id, $nomExact, $couleur, $image, $statut, $prixUnitaire, $prixVente]);

echo json_encode(['status' => 'success']);
?>
