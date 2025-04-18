document.addEventListener("DOMContentLoaded", () => {
    const chiffreAffairesEl = document.getElementById("chiffreAffaires");
    const beneficeEl = document.getElementById("benefice");
    const ctx = document.getElementById("graphiqueVentes").getContext("2d");

    const commandes = JSON.parse(localStorage.getItem("commandes") || "[]");

    let chiffreAffaires = 0;
    let depenses = 0;
    const ventesParMaillot = {};

    commandes.forEach(commande => {
        const prixAchat = commande.prixAchat || (commande.prixTotal / commande.quantite) || 0;
        if (commande.quantite) {
            depenses += commande.quantite * prixAchat;
        }

        if (Array.isArray(commande.maillots)) {
            commande.maillots.forEach(maillot => {
                if (maillot.statut === "livré") {
                    chiffreAffaires += maillot.prixVente || 0;
                    const nomMaillot = maillot.nomExact || "Sans nom";
                    ventesParMaillot[nomMaillot] = (ventesParMaillot[nomMaillot] || 0) + (maillot.prixVente || 0);
                }
            });
        }
    });

    const benefice = chiffreAffaires - depenses;

    chiffreAffairesEl.textContent = `${chiffreAffaires.toFixed(2)} €`;
    beneficeEl.textContent = `${benefice.toFixed(2)} €`;
    beneficeEl.style.color = benefice < 0 ? "red" : "green";

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(ventesParMaillot),
            datasets: [{
                label: "Chiffre d'affaires par maillot livré (€)",
                data: Object.values(ventesParMaillot),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.raw.toFixed(2)} €`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `${value} €`
                    }
                }
            }
        }
    });
});
