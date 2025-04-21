<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Pour le développement
header("Access-Control-Allow-Methods: DELETE, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Gestion des requêtes OPTIONS (pour CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

require_once 'bdd.php';

// Récupérer l'ID de la commande à supprimer
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID de commande invalide']);
    exit;
}

try {
    // Commencez une transaction pour assurer l'intégrité des données
    $pdo->beginTransaction();

    // D'abord, supprimez tous les maillots associés à cette commande
    $stmtMaillots = $pdo->prepare("DELETE FROM maillots WHERE commande_id = ?");
    $stmtMaillots->execute([$id]);

    // Ensuite, supprimez la commande elle-même
    $stmtCommande = $pdo->prepare("DELETE FROM commandes WHERE id = ?");
    $stmtCommande->execute([$id]);

    // Vérifiez si une ligne a été affectée
    if ($stmtCommande->rowCount() > 0) {
        // Validez la transaction
        $pdo->commit();
        echo json_encode(['status' => 'success', 'message' => 'Commande supprimée avec succès']);
    } else {
        // Annulez la transaction si aucune commande n'a été trouvée
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Commande non trouvée']);
    }
} catch (PDOException $e) {
    // En cas d'erreur, annulez la transaction
    $pdo->rollBack();

    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la suppression']);

    // Log pour debug
    error_log('Erreur DB (delete_commande): ' . $e->getMessage());
}

