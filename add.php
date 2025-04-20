<?php
include 'bdd.php';

$nom = $_POST['nom'] ?? '';
$quantite = $_POST['quantite'] ?? 0;

$req = $pdo->prepare("INSERT INTO commandes (nom, quantite) VALUES (?, ?)");
$req->execute([$nom, $quantite]);

echo "Commande ajoutée !";
?>
