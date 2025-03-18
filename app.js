// Initialisation de la carte centrée sur Béni Mellal-Khénifra
var map = L.map('map').setView([32.5, -6.5], 7);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Déclaration du groupe de calques (uniquement la région)
var layerRegions = L.layerGroup().addTo(map);

// Chargement des données depuis `data.json`
// Charger et afficher la région en fonction du polygone et du rayon
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        data.regions.forEach(region => {
            // Tracer le polygone de la région
            var regionPolygon = L.polygon(region.polygon, {
                color: 'yellow',
                fillColor: '#ffff00',
                fillOpacity: 0.4
            }).addTo(map).bindPopup(`<b>Région :</b> ${region.nom} <br> Superficie: ${region.superficie_km2} km²`);

            // Ajuster le zoom pour englober toute la région
            map.fitBounds(regionPolygon.getBounds());
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));

