CREATE TABLE maillot (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          commande_id INT,
                          nom_exact VARCHAR(255),
                          couleur VARCHAR(100),
                          statut VARCHAR(100),
                          prix_unitaire FLOAT,
                          prix_vente FLOAT,
                          image TEXT,
                          FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE
);
