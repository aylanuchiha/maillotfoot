<?php
// lire_commandes.php
require_once 'bdd.php';

try {
    $stmt = $pdo->query("SELECT * FROM commande");
    $commandes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($commandes as &$commande) {
        $stmtMaillots = $pdo->prepare("SELECT * FROM maillot WHERE commande_id = ?");
        $stmtMaillots->execute([$commande['id']]);
        $commande['maillots'] = $stmtMaillots->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($commandes);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
