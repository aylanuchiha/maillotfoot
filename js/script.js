document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#tableStock tbody");

  function getCommandes() {
    return JSON.parse(localStorage.getItem("commandes")) || [];
  }

  function saveCommandes(cmds) {
    localStorage.setItem("commandes", JSON.stringify(cmds));
  }

  function afficherStock() {
    const commandes = getCommandes();
    tableBody.innerHTML = "";

    commandes.forEach((commande, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${commande.nom}</td>
        <td>${commande.quantite}</td>
        <td>${commande.prixTotal.toFixed(2)} €</td>
        <td><button onclick="toggleDetails(this)">⏬</button></td>
      `;
      tableBody.appendChild(row);

      // Détails : maillots individuels
      const detailRow = document.createElement("tr");
      detailRow.className = "details-row hidden";
      detailRow.innerHTML = `
        <td colspan="4">
          <div class="maillots-container">
            ${commande.maillots ? commande.maillots.map((m, i) => `
              <div class="maillot">
                <label>Nom exact :
                  <input type="text" value="${m.nomExact || ''}" onchange="modifierMaillot(${index}, ${i}, 'nomExact', this.value)">
                </label>
                <label>Couleur :
                  <input type="text" value="${m.couleur || ''}" onchange="modifierMaillot(${index}, ${i}, 'couleur', this.value)">
                </label>
                <label>Image :
                  <input type="text" placeholder="URL image" value="${m.image || ''}" onchange="modifierMaillot(${index}, ${i}, 'image', this.value)">
                  ${m.image ? `<img src="${m.image}" width="50">` : ""}
                </label>
                <label>Statut :
                  <select onchange="modifierMaillot(${index}, ${i}, 'statut', this.value)">
                    <option ${m.statut === 'en stock' ? 'selected' : ''}>en stock</option>
                    <option ${m.statut === 'en livraison' ? 'selected' : ''}>en livraison</option>
                    <option ${m.statut === 'livré' ? 'selected' : ''}>livré</option>
                  </select>
                </label>
                <label>Prix unitaire : ${m.prixUnitaire.toFixed(2)} €</label>
                <label>Prix de vente :
                  <input type="number" value="${m.prixVente || 0}" onchange="modifierMaillot(${index}, ${i}, 'prixVente', this.value)">
                </label>
              </div>
            `).join("") : '<em>Aucun maillot</em>'}
          </div>
        </td>
      `;
      tableBody.appendChild(detailRow);
    });
  }

  window.modifierMaillot = function(commandeIndex, maillotIndex, champ, valeur) {
    const commandes = getCommandes();
    if (!commandes[commandeIndex].maillots) commandes[commandeIndex].maillots = [];

    if (!commandes[commandeIndex].maillots[maillotIndex]) {
      commandes[commandeIndex].maillots[maillotIndex] = {
        prixUnitaire: commandes[commandeIndex].prixTotal / commandes[commandeIndex].quantite,
      };
    }

    if (champ === 'prixVente') {
      commandes[commandeIndex].maillots[maillotIndex][champ] = parseFloat(valeur);
    } else {
      commandes[commandeIndex].maillots[maillotIndex][champ] = valeur;
    }

    saveCommandes(commandes);
  };

  window.toggleDetails = function(btn) {
    const row = btn.closest("tr").nextSibling;
    row.classList.toggle("hidden");
  };

  afficherStock();
});
