// Initialisation de la carte
var map = L.map('map').setView([32.3683, -6.3692], 6); // Centre du Maroc

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Couleurs des couches
const regionColor = "#FF5733"; // Orange pour les régions
const provinceColor = "#33FF57"; // Vert pour les provinces
const communeColor = "blue"; // Bleu pour les communes

// Charger les données depuis le fichier JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);

        // Affichage des régions comme zones
        data.regions.forEach(region => {
            if (region.polygon) {
                let polygon = L.polygon(region.polygon, { color: regionColor, fillOpacity: 0.3 })
                    .addTo(map)
                    .bindPopup(`<b>Région:</b> ${region.nom}`);
            }
        });

        // Affichage des provinces comme zones plus petites
        data.provinces.forEach(province => {
            if (province.polygon) {
                let polygon = L.polygon(province.polygon, { color: provinceColor, fillOpacity: 0.3 })
                    .addTo(map)
                    .bindPopup(`<b>Province:</b> ${province.nom}`);
            }
        });

        // Affichage des communes comme points
        data.communes.forEach(commune => {
            if (commune.latitude && commune.longitude) {
                L.circleMarker([commune.latitude, commune.longitude], {
                    color: communeColor,
                    radius: 5
                }).bindPopup(`
                    <b>Commune:</b> ${commune.nom}<br>
                    <b>Besoins VL:</b> ${commune.BesoinCommuneCCT_VL}<br>
                    <b>Besoins PL:</b> ${commune.BesoinCommuneCCT_PL}<br>
                    <b>Population:</b> ${commune.population}
                `).addTo(map);
            }
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));