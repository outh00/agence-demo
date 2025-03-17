// Initialisation de la carte
var map = L.map('map').setView([32.3683, -6.3692], 7); // Niveau de zoom initial

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Styles des cercles
const styles = {
    "region": { color: "yellow", fillColor: "#ffff00", fillOpacity: 0.2 },
    "province": { color: "red", fillColor: "#ff0000", fillOpacity: 0.3 },
    "commune": { color: "blue", fillColor: "#0000ff", fillOpacity: 0.3 }
};

// Icônes personnalisées
const purpleIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

// Variables pour stocker les cercles
let regionLayer, provinceLayers = [], communeLayers = [], centreMarkers = [];

// Fonction pour charger et afficher les données
function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Affichage des régions (Niveau 6-7)
            regionLayer = L.circle(data.regions[0].centre, {
                radius: data.regions[0].radius,
                ...styles.region
            }).addTo(map).bindPopup(`<b>Région :</b> ${data.regions[0].nom}`);

            // Affichage des provinces (Niveau 8-9)
            data.provinces.forEach(province => {
                let provinceLayer = L.circle(province.centre, {
                    radius: province.radius,
                    ...styles.province
                }).bindPopup(`<b>Province :</b> ${province.nom}`);
                provinceLayers.push(provinceLayer);
            });

            // Affichage des communes (Niveau 10-11)
            data.communes.forEach(commune => {
                let communeLayer = L.circle(commune.centre, {
                    radius: commune.radius,
                    ...styles.commune
                }).bindPopup(`
                    <b>Commune :</b> ${commune.nom}<br>
                    <b>Population :</b> ${commune.population}<br>
                    <b>Besoin VL :</b> ${commune.BesoinCommuneCCT_VL}<br>
                    <b>Besoin PL :</b> ${commune.BesoinCommuneCCT_PL}
                `);
                communeLayers.push(communeLayer);
            });

            // Ajout des centres (Zoom 12+)
            data.communes.forEach(commune => {
                commune.centres.forEach(centre => {
                    let marker = L.marker([centre.latitude, centre.longitude], { icon: purpleIcon })
                        .bindPopup(`
                            <strong>Centre :</strong> ${centre.nom}<br>
                            <strong>Adresse :</strong> ${centre.adresse}<br>
                            <strong>Horaires :</strong> ${centre.horaires}<br>
                            <strong>Téléphone :</strong> ${centre.telephone}<br>
                            <strong>Statut :</strong> ${centre.statut}
                        `);
                    centreMarkers.push(marker);
                });
            });

            updateVisibility(map.getZoom());
        })
        .catch(error => console.error('Erreur lors du chargement des données:', error));
}

// Fonction pour afficher/masquer les couches en fonction du zoom
function updateVisibility(zoomLevel) {
    if (zoomLevel < 8) {
        map.addLayer(regionLayer);
        provinceLayers.forEach(layer => map.removeLayer(layer));
        communeLayers.forEach(layer => map.removeLayer(layer));
        centreMarkers.forEach(marker => map.removeLayer(marker));
    } else if (zoomLevel >= 8 && zoomLevel < 10) {
        map.removeLayer(regionLayer);
        provinceLayers.forEach(layer => map.addLayer(layer));
        communeLayers.forEach(layer => map.removeLayer(layer));
        centreMarkers.forEach(marker => map.removeLayer(marker));
    } else if (zoomLevel >= 10 && zoomLevel < 12) {
        provinceLayers.forEach(layer => map.removeLayer(layer));
        communeLayers.forEach(layer => map.addLayer(layer));
        centreMarkers.forEach(marker => map.removeLayer(marker));
    } else {
        communeLayers.forEach(layer => map.removeLayer(layer));
        centreMarkers.forEach(marker => map.addLayer(marker));
    }
}

// Écoute du zoom
map.on('zoomend', function () {
    updateVisibility(map.getZoom());
});

// Chargement des données au démarrage
loadData();
