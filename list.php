<?php
require 'bdd.php';

$stmt = $pdo->query("SELECT * FROM commandes");
$commandes = $stmt->fetchAll();

foreach ($commandes as &$commande) {
    $stmtMaillots = $pdo->prepare("SELECT * FROM maillots WHERE commande_id = ?");
    $stmtMaillots->execute([$commande['id']]);
    $commande['maillots'] = $stmtMaillots->fetchAll();
}

echo json_encode($commandes);
?>
