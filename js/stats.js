document.addEventListener("DOMContentLoaded", async () => {
    const chiffreAffairesEl = document.getElementById("chiffreAffaires");
    const beneficeEl = document.getElementById("benefice");
    const ctx = document.getElementById("graphiqueVentes").getContext("2d");

    try {
        // Correction du chemin vers le script PHP
        const response = await fetch("php/list.php");
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const commandes = await response.json();

        let totalChiffreAffaires = 0;
        let totalBenefice = 0;
        const statutCounts = {};

        commandes.forEach((commande) => {
            if (commande.maillots && commande.maillots.length > 0) {
                commande.maillots.forEach((maillot) => {
                    const prixVente = parseFloat(maillot.prix_vente || 0);
                    const prixAchat = parseFloat(maillot.prix_unitaire || 0);
                    const statut = maillot.statut || "Inconnu";

                    if (!isNaN(prixVente)) {
                        totalChiffreAffaires += prixVente;
                    }

                    if (!isNaN(prixVente) && !isNaN(prixAchat)) {
                        totalBenefice += prixVente - prixAchat;
                    }

                    // Compter les statuts
                    if (!statutCounts[statut]) {
                        statutCounts[statut] = 0;
                    }
                    statutCounts[statut]++;
                });
            }
        });

        chiffreAffairesEl.textContent = totalChiffreAffaires.toFixed(2) + " €";
        beneficeEl.textContent = totalBenefice.toFixed(2) + " €";

        // Préparer les données pour le graphique
        const labels = Object.keys(statutCounts);
        const data = Object.values(statutCounts);

        // Vérifier si Chart.js est bien chargé
        if (typeof Chart === 'undefined') {
            // Ajouter la bibliothèque Chart.js si elle n'est pas déjà chargée
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                // Créer le graphique une fois Chart.js chargé
                createChart(labels, data);
            };
            document.head.appendChild(script);
        } else {
            // Chart.js est déjà chargé, créer le graphique directement
            createChart(labels, data);
        }
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        document.getElementById("graphiqueVentes").insertAdjacentHTML('beforebegin',
            `<p class="text-danger">Erreur de chargement des données: ${error.message}</p>`);
    }

    function createChart(labels, data) {
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Nombre de maillots",
                    data: data,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Nombre de maillots'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Statut'
                        }
                    }
                }
            }
        });
    }
});
