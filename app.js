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

        // Ajout des cercles pour représenter les provinces
        data.provinces.forEach(province => {
            var center = province.polygon.reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1]], [0, 0])
                .map(coord => coord / province.polygon.length);

            L.circle(center, {
                color: 'red',
                fillColor: '#ff0000',
                fillOpacity: 0.3,
                radius: 30000
            }).addTo(map).bindPopup(`<b>Province :</b> ${province.nom}`);
        });

        // Ajout des communes sous forme de marqueurs
        data.communes.forEach(commune => {
            L.marker([commune.latitude, commune.longitude], {icon: blueIcon})
                .bindPopup(`
                    <b>Commune :</b> ${commune.nom}<br>
                    <b>Population :</b> ${commune.population}<br>
                    <b>Besoin VL :</b> ${commune.BesoinCommuneCCT_VL}<br>
                    <b>Besoin PL :</b> ${commune.BesoinCommuneCCT_PL}
                `)
                .addTo(map);

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