document.addEventListener("DOMContentLoaded", () => {
  console.log("Script commande.js chargé");
  const form = document.getElementById("commandeForm");

  // Chargement initial des commandes
  chargerCommandes();

  // Gestion du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const nom = document.getElementById("nom").value.trim();
      const quantite = parseInt(document.getElementById("quantite").value);
      const prixTotal = parseFloat(document.getElementById("prixTotal").value);
      const grossiste = document.getElementById("grossiste").value.trim();
      const telephone = document.getElementById("telephone").value.trim();
      const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const prixUnitaire = quantite > 0 ? (prixTotal / quantite).toFixed(2) : 0;

      // Validation basique
      if (!nom || quantite <= 0 || prixTotal <= 0) {
        alert("Veuillez remplir correctement tous les champs obligatoires");
        return;
      }

      const commande = {
        nom,
        quantite,
        prixTotal,
        prixUnitaire,
        grossiste,
        telephone,
        date
      };

      console.log("Envoi de la commande:", commande);

      // Correction du chemin vers le script PHP
      const response = await fetch("../php/add_commande.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(commande)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Réponse serveur:", errorData);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        alert("Commande ajoutée avec succès !");
        form.reset();
        chargerCommandes(); // Recharger la liste après ajout
      } else {
        alert(`Erreur: ${result.message || "Problème lors de l'ajout de la commande"}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Une erreur est survenue lors de l'envoi de la commande: " + error.message);
    }
  });

  // Fonction pour charger les commandes existantes
  async function chargerCommandes() {
    try {
      // Correction du chemin vers le script PHP
      const response = await fetch("php/list.php");
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const commandes = await response.json();
      afficherCommandes(commandes);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
      document.getElementById("listeCommandes").innerHTML =
          "<p class='text-danger'>Impossible de charger les commandes: " + error.message + "</p>";
    }
  }

  // Fonction pour afficher les commandes dans le tableau
  function afficherCommandes(commandes) {
    const container = document.getElementById("listeCommandes");

    if (!commandes || !commandes.length) {
      container.innerHTML = "<p class='text-center text-muted'>Aucune commande enregistrée</p>";
      return;
    }

    let html = `
      <table class="table table-striped table-hover">
        <thead class="table-primary">
          <tr>
            <th>Nom</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Prix total</th>
            <th>Grossiste</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    commandes.forEach(cmd => {
      const date = new Date(cmd.date).toLocaleDateString('fr-FR');
      const prixUnitaire = cmd.prix_unitaire ? parseFloat(cmd.prix_unitaire).toFixed(2) : "N/A";

      html += `
        <tr>
          <td>${cmd.nom}</td>
          <td>${cmd.quantite}</td>
          <td>${prixUnitaire} €</td>
          <td>${parseFloat(cmd.prix_total).toFixed(2)} €</td>
          <td>${cmd.grossiste || "N/A"}</td>
          <td>${date}</td>
          <td>
            <button class="btn btn-sm btn-outline-info" onclick="voirDetails(${cmd.id})">Voir</button>
            <button class="btn btn-sm btn-outline-danger" onclick="supprimerCommande(${cmd.id})">Supprimer</button>
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    container.innerHTML = html;
  }
});

// Fonctions globales pour les actions sur les commandes
function voirDetails(id) {
  alert("Fonctionnalité à implémenter: voir détails de la commande #" + id);
  // Implémenter l'affichage des détails ou redirection vers page de détails
}

function supprimerCommande(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
    // Correction du chemin vers le script PHP
    fetch(`../php/delete_commande.php?id=${id}`, {
      method: "DELETE"
    })
        .then(response => response.json())
        .then(result => {
          if (result.status === "success") {
            alert("Commande supprimée avec succès");
            // Recharger la liste
            location.reload();
          } else {
            alert("Erreur lors de la suppression: " + (result.message || "Erreur inconnue"));
          }
        })
        .catch(error => {
          console.error("Erreur:", error);
          alert("Une erreur est survenue: " + error.message);
        });
  }
}
