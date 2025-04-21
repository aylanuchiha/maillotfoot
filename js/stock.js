document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("tableStock");

  try {
    // Correction du chemin vers le script PHP
    const response = await fetch("php/list.php");
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const commandes = await response.json();

    if (!commandes || commandes.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="3" class="text-center">Aucun produit en stock</td></tr>`;
      return;
    }

    let html = '';

    commandes.forEach((commande) => {
      html += `
        <tr>
          <td>${commande.nom || 'N/A'}</td>
          <td>${commande.quantite || '0'}</td>
          <td>${(parseFloat(commande.prix_total) || 0).toFixed(2)} €</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="modifierCommande(${commande.id})">Modifier</button>
          </td>
        </tr>
      `;

      // Afficher les maillots associés s'il y en a
      if (commande.maillots && commande.maillots.length > 0) {
        commande.maillots.forEach((maillot) => {
          html += `
            <tr class="table-light">
              <td>
                <small>🔹 ${maillot.nom_exact || 'N/A'} - ${maillot.couleur || 'N/A'}</small>
              </td>
              <td>
                <small>Statut: ${maillot.statut || 'N/A'}</small>
              </td>
              <td>
                <small>Prix vente: ${(parseFloat(maillot.prix_vente) || 0).toFixed(2)} €</small>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-info" onclick="modifierMaillot(${maillot.id})">Détails</button>
              </td>
            </tr>
          `;
        });
      }
    });

    tableBody.innerHTML = html;
  } catch (error) {
    console.error("Erreur lors du chargement du stock:", error);
    tableBody.innerHTML = `<tr><td colspan="4" class="text-danger">Erreur lors du chargement du stock: ${error.message}</td></tr>`;
  }
});

// Fonctions pour l'édition (à implémenter)
function modifierCommande(id) {
  alert("Fonctionnalité à implémenter: modifier la commande #" + id);
}

function modifierMaillot(id) {
  alert("Fonctionnalité à implémenter: modifier le maillot #" + id);
}
