document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("commandeForm");
  const listeCommandes = document.getElementById("listeCommandes");

  let commandes = JSON.parse(localStorage.getItem("commandes")) || [];
  let stock = JSON.parse(localStorage.getItem("stock")) || [];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const quantite = parseInt(document.getElementById("quantite").value);
    const prixTotal = parseFloat(document.getElementById("prixTotal").value);
    const grossiste = document.getElementById("grossiste").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const date = new Date().toLocaleString();

    const prixUnitaire = prixTotal / quantite;

    const commande = { nom, quantite, prixTotal, prixUnitaire, grossiste, telephone, date };
    commandes.push(commande);
    localStorage.setItem("commandes", JSON.stringify(commandes));

    const index = stock.findIndex(item => item.nom === nom);
    if (index !== -1) {
      const ancienneQuantite = stock[index].quantite;
      const ancienneValeurTotale = stock[index].prixUnitaire * ancienneQuantite;
      const nouvelleValeurTotale = prixUnitaire * quantite;
      const nouvelleQuantiteTotale = ancienneQuantite + quantite;
      stock[index].quantite = nouvelleQuantiteTotale;
      stock[index].prixUnitaire = (ancienneValeurTotale + nouvelleValeurTotale) / nouvelleQuantiteTotale;
    } else {
      stock.push({ nom, quantite, prixUnitaire, image: "" });
    }

    localStorage.setItem("stock", JSON.stringify(stock));
    afficherCommandes();
    form.reset();
  });

  function supprimerCommande(index) {
    if (confirm("Voulez-vous vraiment supprimer cette commande ?")) {
      commandes.splice(index, 1);
      localStorage.setItem("commandes", JSON.stringify(commandes));
      afficherCommandes();
    }
  }

  function afficherCommandes() {
    listeCommandes.innerHTML = "";
    commandes.forEach((commande, index) => {
      const div = document.createElement("div");
      div.className = "commande";
      div.innerHTML = `
        <strong>${commande.nom}</strong> - Qté: ${commande.quantite}<br>
        Prix Total: ${commande.prixTotal}€ (${commande.prixUnitaire.toFixed(2)}€/u)<br>
        Grossiste: ${commande.grossiste || "—"} - Tel: ${commande.telephone || "—"}<br>
        Date: ${commande.date}<br>
        <a href="stock.html?nom=${encodeURIComponent(commande.nom)}">Modifier dans le stock</a>
        <div class="text-end mt-2">
          <button class="btn btn-sm btn-outline-danger" onclick="supprimerCommande(${index})">❌ Supprimer</button>
        </div>
        <hr>
      `;
      listeCommandes.appendChild(div);
    });
  }

  window.supprimerCommande = supprimerCommande;
  afficherCommandes();
});
