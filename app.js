// Initialisation de la carte
var map = L.map('map').setView([32.3683, -6.3692], 6);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Définition des icônes pour les communes
const blueIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

// Fonction pour charger et afficher les données
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);

        // Ajout des régions sous forme de zones (polygones)
        data.regions.forEach(region => {
            var polygon = L.polygon(region.coordinates, { color: 'green', fillOpacity: 0.3 })
                .bindPopup(`<b>Région:</b> ${region.nom}`)
                .addTo(map);
        });

        // Ajout des provinces au centre de leur région
        data.provinces.forEach(province => {
            L.circleMarker([province.latitude, province.longitude], {
                color: 'red',
                radius: 8,
                fillOpacity: 0.7
            }).bindPopup(`<b>Province:</b> ${province.nom}`)
            .addTo(map);
        });

        // Ajout des communes sous forme de points
        data.communes.forEach(commune => {
            if (commune.latitude && commune.longitude) {
                L.marker([commune.latitude, commune.longitude], {icon: blueIcon})
                    .bindPopup(`
                        <b>Commune:</b> ${commune.nom}<br>
                        <b>Besoins CCT VL:</b> ${commune.BesoinCommuneCCT_VL}<br>
                        <b>Besoins CCT PL:</b> ${commune.BesoinCommuneCCT_PL}<br>
                        <b>Population:</b> ${commune.population}
                    `)
                    .addTo(map);
            }
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));