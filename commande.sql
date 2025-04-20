CREATE TABLE commande (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           nom VARCHAR(255),
                           quantite INT,
                           prix_total FLOAT,
                           date_commande DATETIME DEFAULT CURRENT_TIMESTAMP
);
