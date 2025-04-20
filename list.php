<?php

include 'bdd.php';

$req = $pdo->query("SELECT * FROM commandes");
echo json_encode($req->fetchAll(PDO::FETCH_ASSOC));

