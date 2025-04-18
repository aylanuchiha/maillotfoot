document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("tableStock");

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
        <td>
          <button onclick="toggleDetails(${index})">🡇 Voir les maillots</button>
          <button onclick="modifierCommande(${index})">✏️ Modifier</button>
        </td>
      `;
      tableBody.appendChild(row);

      const detailRow = document.createElement("tr");
      detailRow.classList.add("details-row");
      detailRow.style.display = "none";
      detailRow.innerHTML = `
        <td colspan="4">
          <div class="details" id="details-${index}">
            <p>Aucun maillot enregistré.</p>
          </div>
        </td>
      `;
      tableBody.appendChild(detailRow);
    });
  }

  window.toggleDetails = function(indexCommande) {
    const commandes = getCommandes();
    const detailRow = document.querySelectorAll(".details-row")[indexCommande];
    const detailDiv = document.getElementById(`details-${indexCommande}`);

    if (detailRow.style.display === "none") {
      detailRow.style.display = "table-row";
      const maillots = commandes[indexCommande].maillots || [];

      if (maillots.length === 0) {
        detailDiv.innerHTML = `<p>Aucun maillot enregistré.</p>`;
        return;
      }

      detailDiv.innerHTML = "";
      maillots.forEach((maillot, i) => {
        const bloc = document.createElement("div");
        bloc.className = "maillot-resume";
        bloc.innerHTML = `
          <strong>${maillot.nomExact || "(sans nom)"}</strong> - ${maillot.couleur} - ${maillot.statut}<br>
          Prix unitaire : ${maillot.prixUnitaire} € / Prix vente : ${maillot.prixVente} €<br>
          ${maillot.image ? `<img src="${maillot.image}" width="60">` : ""}
          <br><button onclick="supprimerMaillot(${indexCommande}, ${i})">🗑️ Supprimer</button>
        `;
        detailDiv.appendChild(bloc);
      });
    } else {
      detailRow.style.display = "none";
    }
  };

  window.supprimerMaillot = function(indexCommande, indexMaillot) {
    const commandes = getCommandes();
    commandes[indexCommande].maillots.splice(indexMaillot, 1);
    saveCommandes(commandes);
    toggleDetails(indexCommande);
    toggleDetails(indexCommande);
  };

  window.modifierCommande = function(indexCommande) {
    // 🔒 Empêche plusieurs popups
    const popupExistante = document.querySelector(".popup");
    if (popupExistante) {
      popupExistante.remove();
    }
    const commandes = getCommandes();
    const commande = commandes[indexCommande];

    if (!commande.maillots) commande.maillots = [];

    let maillotsTemp = JSON.parse(JSON.stringify(commande.maillots));
    window._maillotsTemp = maillotsTemp;

    const container = document.createElement("div");
    container.classList.add("popup");

    container.innerHTML = `
      <div class="popup-content">
        <h2>Modifier les maillots - ${commande.nom}</h2>
        <div id="maillotsContainer"></div>
        <button id="addMaillot">+ Ajouter un maillot</button>
        <br><br>
        <button onclick="enregistrerMaillots(${indexCommande})">💾 Enregistrer</button>
        <button onclick="fermerPopup()">Fermer</button>
      </div>
    `;

    document.body.appendChild(container);
    const maillotsContainer = document.getElementById("maillotsContainer");

    function createMaillotBlock(maillot = {}, index) {
      const prixUnitaire = (commande.prixTotal / commande.quantite).toFixed(2);
      const bloc = document.createElement("div");
      bloc.className = "maillot";
      bloc.innerHTML = `
        <label>Nom exact :
          <input type="text" value="${maillot.nomExact || ''}" onchange="updateMaillotTemp(${index}, 'nomExact', this.value)">
        </label>
        <label>Couleur :
          <input type="text" value="${maillot.couleur || ''}" onchange="updateMaillotTemp(${index}, 'couleur', this.value)">
        </label>
        <label>Image (URL) :
          <input type="text" value="${maillot.image || ''}" onchange="updateMaillotTemp(${index}, 'image', this.value)">
          ${maillot.image ? `<img src="${maillot.image}" width="50">` : ''}
        </label>
        <label>Statut :
          <select onchange="updateMaillotTemp(${index}, 'statut', this.value)">
            <option ${maillot.statut === 'en stock' ? 'selected' : ''}>en stock</option>
            <option ${maillot.statut === 'en livraison' ? 'selected' : ''}>en livraison</option>
            <option ${maillot.statut === 'livré' ? 'selected' : ''}>livré</option>
          </select>
        </label>
        <label>Prix unitaire : ${prixUnitaire} €</label>
        <label>Prix de vente :
          <input type="number" value="${maillot.prixVente || 0}" onchange="updateMaillotTemp(${index}, 'prixVente', this.value)">
        </label>
        <hr>
      `;
      maillotsContainer.appendChild(bloc);
    }

    maillotsTemp.forEach((maillot, i) => createMaillotBlock(maillot, i));

    document.getElementById("addMaillot").addEventListener("click", () => {
      const newMaillot = {
        nomExact: "",
        couleur: "",
        image: "",
        statut: "en stock",
        prixUnitaire: parseFloat((commande.prixTotal / commande.quantite).toFixed(2)),
        prixVente: 0
      };
      window._maillotsTemp.push(newMaillot);
      createMaillotBlock(newMaillot, window._maillotsTemp.length - 1);
    });
  };

  window.updateMaillotTemp = function(indexMaillot, champ, valeur) {
    const maillotsTemp = window._maillotsTemp;
    maillotsTemp[indexMaillot][champ] = champ === 'prixVente' ? parseFloat(valeur) : valeur;
  };

  window.enregistrerMaillots = function(indexCommande) {
    const commandes = getCommandes();
    commandes[indexCommande].maillots = window._maillotsTemp;
    saveCommandes(commandes);
    fermerPopup();
    afficherStock();
  };

  window.fermerPopup = function() {
    const popup = document.querySelector(".popup");
    if (popup) popup.remove();
  };

  afficherStock();
});
