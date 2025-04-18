document.getElementById('form-vente').addEventListener('submit', function (e) {
    e.preventDefault();

    const nom = document.getElementById('nomVendu').value;
    const prix = parseFloat(document.getElementById('prixVente').value);

    const vente = { nom, prix };
    let ventes = JSON.parse(localStorage.getItem('ventes')) || [];
    ventes.push(vente);
    localStorage.setItem('ventes', JSON.stringify(ventes));

    document.getElementById('form-vente').reset();
    afficherVentes();
});

function afficherVentes() {
    const ventes = JSON.parse(localStorage.getItem('ventes')) || [];
    const liste = document.getElementById('liste-ventes');
    liste.innerHTML = '<h3>Ventes enregistrées :</h3>';
    ventes.forEach(v => {
        liste.innerHTML += `<p>${v.nom} vendu à ${v.prix} €</p>`;
    });
}

window.onload = afficherVentes;

