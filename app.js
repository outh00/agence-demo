
// Initialisation de la carte
var map = L.map('map').setView([32.3683, -6.3692], 7);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Couleurs pour les différents niveaux
var regionStyle = {color: 'yellow', weight: 2, fillOpacity: 0.2};
var provinceStyle = {color: 'red', weight: 2, fillOpacity: 0.3};
var communeStyle = {color: 'blue', weight: 2, fillOpacity: 0.4};

// Icônes des centres
var centreIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

var regionsLayer = L.layerGroup();
var provincesLayer = L.layerGroup();
var communesLayer = L.layerGroup();
var centresLayer = L.layerGroup();

// Charger les données depuis le fichier JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Ajout des régions
        data.regions.forEach(region => {
            L.polygon(region.polygon, regionStyle).addTo(regionsLayer)
                .bindPopup(`<b>Région :</b> ${region.nom}`);
        });

        // Ajout des provinces
        data.provinces.forEach(province => {
            L.polygon(province.polygon, provinceStyle).addTo(provincesLayer)
                .bindPopup(`<b>Province :</b> ${province.nom}`);
        });

        // Ajout des communes
        data.communes.forEach(commune => {
            L.polygon(commune.polygon, communeStyle).addTo(communesLayer)
                .bindPopup(`
                    <b>Commune :</b> ${commune.nom}<br>
                    <b>Population :</b> ${commune.population}
                `);

            // Ajout des centres
            commune.centres.forEach(centre => {
                L.marker([centre.latitude, centre.longitude], {icon: centreIcon}).addTo(centresLayer)
                    .bindPopup(`
                        <b>Centre :</b> ${centre.nom}<br>
                        <b>Adresse :</b> ${centre.adresse}<br>
                        <b>Statut :</b> ${centre.statut}
                    `);
            });
        });

        updateLayers(map.getZoom());
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));

// Fonction pour mettre à jour les couches en fonction du zoom
function updateLayers(zoomLevel) {
    map.eachLayer(layer => {
        if (layer instanceof L.Polygon || layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    if (zoomLevel < 8) {
        regionsLayer.addTo(map);
    } else if (zoomLevel < 10) {
        provincesLayer.addTo(map);
    } else if (zoomLevel < 12) {
        communesLayer.addTo(map);
    } else {
        communesLayer.addTo(map);
        centresLayer.addTo(map);
    }
}

// Événement de changement de zoom
map.on('zoomend', function () {
    updateLayers(map.getZoom());
});

// Chargement initial
updateLayers(map.getZoom());
