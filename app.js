// Initialisation de la carte centrée sur Béni Mellal-Khénifra
var map = L.map('map').setView([32.5, -6.5], 7);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Déclaration du groupe de calques (uniquement la région)
var layerRegions = L.layerGroup().addTo(map);

// Chargement des données depuis `data.json`
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données chargées :", data);

        // 🟠 Ajout de la région Béni Mellal-Khénifra
        data.regions.forEach(region => {
            L.polygon(region.polygon, {
                color: 'orange', // Bordure orange
                fillColor: 'orange', // Remplissage orange
                fillOpacity: 0.5
            }).bindPopup(`<b>Région :</b> ${region.nom}`).addTo(layerRegions);
        });

    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));
