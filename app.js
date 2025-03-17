let map = L.map('map').setView([32.75, -6.19], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        let totalAgences = data.length;
        let activeAgences = data.filter(a => a.statut === "Active").length;
        let inactiveAgences = totalAgences - activeAgences;

        document.getElementById("total-agences").textContent = totalAgences;
        document.getElementById("agences-actives").textContent = activeAgences;
        document.getElementById("agences-inactives").textContent = inactiveAgences;

        data.forEach(agence => {
            let marker = L.marker([agence.latitude, agence.longitude]).addTo(map)
                .bindPopup(`<b>${agence.nom}</b><br>${agence.adresse}<br>${agence.telephone}`);
        });
    });

function togglePopup() {
    alert("Formulaire d'ajout d'agence à implémenter.");
}