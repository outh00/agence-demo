// Initialisation de la carte
var map = L.map('map').setView([32.3683, -6.3692], 8);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Icônes personnalisés
const blueIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

const redIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

// Chargement des données
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);

        // Ajout du cercle pour représenter la région
        data.regions.forEach(region => {
            var center = [32.3683, -6.3692]; // Centre de la région
            var radius = 70000; // Rayon en mètres pour englober les provinces

            L.circle(center, {
                color: 'yellow',
                fillColor: '#ffff00',
                fillOpacity: 0.3,
                radius: radius
            }).addTo(map).bindPopup(`<b>Région :</b> ${region.nom}`);
        });

        // Ajout des polygones pour les provinces
        data.provinces.forEach(province => {
            L.polygon(province.polygon, {
                color: 'red',
                fillColor: '#ff0000',
                fillOpacity: 0.3
            }).addTo(map).bindPopup(`<b>Province :</b> ${province.nom}`);
        });

        // Ajout des communes sous forme de marqueurs
        data.communes.forEach(commune => {
            if (commune.latitude && commune.longitude) {
                L.circleMarker([commune.latitude, commune.longitude], {
                    color: communeColor,
                    radius: 6,
                    fillOpacity: 0.8
                }).bindPopup(`
                    <b>Commune:</b> ${commune.nom}<br>
                    <b>Besoins VL:</b> ${commune.BesoinCommuneCCT_VL}<br>
                    <b>Besoins PL:</b> ${commune.BesoinCommuneCCT_PL}<br>
                    <b>Population:</b> ${commune.population}
                `).addTo(map);
                }
            // Ajout des centres
            commune.centres.forEach(centre => {
                L.marker([commune.latitude, commune.longitude], {icon: redIcon})
                    .bindPopup(`
                        <strong>Centre :</strong> ${centre.nom}<br>
                        <strong>Adresse :</strong> ${centre.adresse}<br>
                        <strong>Horaires :</strong> ${centre.horaires}<br>
                        <strong>Téléphone :</strong> ${centre.telephone}<br>
                        <strong>Statut :</strong> ${centre.statut}
                    `)
                    .addTo(map);
            });
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));