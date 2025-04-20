<?php
// ajouter_maillot.php
require_once 'bdd.php';

$data = json_decode(file_get_contents('php://input'), true);

$commande_id = $data['commande_id'];
$nomExact = $data['nomExact'];
$couleur = $data['couleur'];
$statut = $data['statut'];
$prixUnitaire = $data['prixUnitaire'];
$prixVente = $data['prixVente'];
$image = $data['image'];

try {
    $stmt = $pdo->prepare("INSERT INTO maillot (commande_id, nomExact, couleur, statut, prixUnitaire, prixVente, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$commande_id, $nomExact, $couleur, $statut, $prixUnitaire, $prixVente, $image]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
