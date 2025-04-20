document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#tableStock tbody");

  const response = await fetch("list.php");
  const commandes = await response.json();

  commandes.forEach((commande) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${commande.nom}</td>
      <td>${commande.quantite}</td>
      <td>${commande.prix_total.toFixed(2)} €</td>
    `;
    tableBody.appendChild(row);

    if (commande.maillots && commande.maillots.length > 0) {
      commande.maillots.forEach((maillot) => {
        const maillotRow = document.createElement("tr");
        maillotRow.innerHTML = `
          <td colspan="3">
            ${maillot.nom_exact} - ${maillot.couleur} - ${maillot.statut} - ${maillot.prix_vente} €
          </td>
        `;
        tableBody.appendChild(maillotRow);
      });
    }
  });
});
