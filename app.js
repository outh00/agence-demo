// Initialisation de la carte
var map = L.map('map').setView([31.7917, -7.0926], 6); // Centré sur le Maroc

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Charger les données depuis data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées :", data);

        // Ajouter les régions à la carte
        L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: "blue",
                    weight: 2,
                    fillOpacity: 0.3
                };
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<b>Région:</b> ${feature.properties.nom}`);
            }
        }).addTo(map);
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));
