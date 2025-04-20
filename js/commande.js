console.log("Fichier JS chargé !");


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("commandeForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const quantite = parseInt(document.getElementById("quantite").value);
    const prixTotal = parseFloat(document.getElementById("prixTotal").value);
    const grossiste = document.getElementById("grossiste").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const date = new Date().toISOString();
    const prixUnitaire = prixTotal / quantite;

    const commande = {
      nom,
      quantite,
      prixTotal,
      prixUnitaire,
      grossiste,
      telephone,
      date
    };

    console.log("Envoi de la requête à add_commande.php :", commande);
    const response = await fetch("../add_commande.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(commande)
    });

    const result = await response.json();
    if (result.status === "success") {
      alert("Commande ajoutée avec succès !");
      form.reset();
    } else {
      alert("Erreur lors de l'ajout de la commande.");
    }
  });
});
