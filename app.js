// Initialisation de la carte
var map = L.map('map').setView([32.5, -6.5], 7);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Charger la région depuis le fichier data_updated.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données de la région chargées:", data);

        // Affichage de la région Béni Mellal-Khénifra en contour
        L.geoJSON(data.regions[0].polygon, {
            style: {
                color: 'yellow',  // Jaune pour la région
                weight: 2,
                fillOpacity: 0.3
            }
        }).addTo(map);
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));
