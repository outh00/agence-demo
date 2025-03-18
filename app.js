
// Initialisation de la carte
var map = L.map('map').setView([32.3683, -6.3692], 7);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Création des groupes de calques
var regionLayer = L.layerGroup().addTo(map);
var provinceLayer = L.layerGroup();
var communeLayer = L.layerGroup();
var centreLayer = L.layerGroup();

// Chargement des données
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);

        // Ajout des régions en jaune
        data.regions.forEach(region => {
            L.polygon(region.polygon, {
                color: 'yellow',
                fillColor: '#ffff00',
                fillOpacity: 0.3
            }).bindPopup(`<b>Région :</b> ${region.nom}`).addTo(regionLayer);
        });

        // Ajout des provinces en rouge
        data.provinces.forEach(province => {
            L.polygon(province.polygon, {
                color: 'red',
                fillColor: '#ff0000',
                fillOpacity: 0.3
            }).bindPopup(`<b>Province :</b> ${province.nom}`).addTo(provinceLayer);
        });

        // Ajout des communes en bleu
        data.communes.forEach(commune => {
            L.circle(commune.centre, {
                color: 'blue',
                fillColor: '#0000ff',
                fillOpacity: 0.3,
                radius: commune.radius
            }).bindPopup(`
                <b>Commune :</b> ${commune.nom}<br>
                <b>Population :</b> ${commune.population}<br>
                <b>Besoin VL :</b> ${commune.BesoinCommuneCCT_VL}<br>
                <b>Besoin PL :</b> ${commune.BesoinCommuneCCT_PL}
            `).addTo(communeLayer);

            // Ajout des centres sous forme de points
            commune.centres.forEach(centre => {
                L.marker([centre.latitude, centre.longitude], {
                    icon: L.icon({
                        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
                        iconSize: [32, 32],
                        iconAnchor: [16, 32]
                    })
                }).bindPopup(`
                    <strong>Centre :</strong> ${centre.nom}<br>
                    <strong>Adresse :</strong> ${centre.adresse || 'N/A'}<br>
                    <strong>Horaires :</strong> ${centre.horaires || 'N/A'}<br>
                    <strong>Téléphone :</strong> ${centre.telephone || 'N/A'}<br>
                    <strong>Statut :</strong> ${centre.statut || 'N/A'}
                `).addTo(centreLayer);
            });
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));

// Gestion de l'affichage en fonction du zoom
map.on('zoomend', function () {
    var zoomLevel = map.getZoom();
    console.log("Zoom actuel :", zoomLevel);

    if (zoomLevel < 8) {
        map.addLayer(regionLayer);
        map.removeLayer(provinceLayer);
        map.removeLayer(communeLayer);
        map.removeLayer(centreLayer);
    } else if (zoomLevel >= 8 && zoomLevel < 10) {
        map.addLayer(provinceLayer);
        map.addLayer(regionLayer);
        map.removeLayer(communeLayer);
        map.removeLayer(centreLayer);
    } else if (zoomLevel >= 10 && zoomLevel < 12) {
        map.addLayer(communeLayer);
        map.addLayer(provinceLayer);
        map.removeLayer(regionLayer);
        map.removeLayer(centreLayer);
    } else {
        map.addLayer(centreLayer);
        map.addLayer(communeLayer);
        map.removeLayer(regionLayer);
        map.removeLayer(provinceLayer);
    }
});

