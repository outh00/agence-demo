// Initialisation de la carte
var map = L.map('map').setView([32.00, -6.00], 6);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Définition des couleurs pour les différentes zones
const regionStyle = { color: "blue", weight: 2, fillOpacity: 0.3 };
const provinceStyle = { color: "green", weight: 2, fillOpacity: 0.4 };
const communeStyle = { color: "red", weight: 1, fillOpacity: 0.6 };

const blueDot = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
});

// Charger les données depuis JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);
        
        // Affichage des régions en zones bleues
        data.regions.forEach(region => {
            L.polygon(region.coordinates, regionStyle)
                .bindPopup(`<b>Région:</b> ${region.name}`)
                .addTo(map);
        });
        
        // Affichage des provinces/préfectures en zones vertes
        data.provinces.forEach(province => {
            L.polygon(province.coordinates, provinceStyle)
                .bindPopup(`<b>Province:</b> ${province.name}`)
                .addTo(map);
        });
        
        // Affichage des communes en dots bleus avec informations de population et besoins
        data.communes.forEach(commune => {
            L.marker([commune.latitude, commune.longitude], {icon: blueDot})
                .bindPopup(`
                    <strong>Commune:</strong> ${commune.name}<br>
                    <strong>Population:</strong> ${commune.population}<br>
                    <strong>Besoins CCT VL:</strong> ${commune.BesoinCommuneCCT_VL}<br>
                    <strong>Besoins CCT PL:</strong> ${commune.BesoinCommuneCCT_PL}<br>
                `)
                .addTo(map);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));