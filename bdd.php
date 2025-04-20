<?php
// enregistrer_commande.php
$host = 'localhost';
$db = 'u130341384_maillot_db';
$user = 'u130341384_aylan';
$pass = 'Hamid_Bozboz2002';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Erreur de connexion : " . $conn->connect_error);
}

// Récupération des données JSON
$data = json_decode(file_get_contents("php://input"), true);

$nom = $conn->real_escape_string($data["nom"]);
$quantite = (int)$data["quantite"];
$prixTotal = (float)$data["prixTotal"];

// 1️⃣ Insertion de la commande
$conn->query("INSERT INTO commandes (nom, quantite, prix_total) VALUES ('$nom', $quantite, $prixTotal)");
$commandeId = $conn->insert_id;

// 2️⃣ Insertion des maillots liés
foreach ($data["maillots"] as $m) {
    $nomExact = $conn->real_escape_string($m["nomExact"]);
    $couleur = $conn->real_escape_string($m["couleur"]);
    $statut = $conn->real_escape_string($m["statut"]);
    $prixUnitaire = (float)$m["prixUnitaire"];
    $prixVente = (float)$m["prixVente"];
    $image = $conn->real_escape_string($m["image"]);

    $conn->query("INSERT INTO maillots (commande_id, nom_exact, couleur, statut, prix_unitaire, prix_vente, image)
    VALUES ($commandeId, '$nomExact', '$couleur', '$statut', $prixUnitaire, $prixVente, '$image')");
}

echo json_encode(["success" => true]);
$conn->close();
?>
