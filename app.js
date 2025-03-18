// Initialisation de la carte avec un zoom par défaut
var map = L.map('map').setView([31.5, -7.5], 6);

// Ajout d'une couche OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fonction pour générer des valeurs aléatoires entre min et max
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Liste de prénoms arabes en français
var arabicNames = ["Ahmed", "Youssef", "Fatima", "Mohamed", "Aicha", "Khalid", "Said", "Meryem", "Ibrahim", "Latifa"];

// Couches pour les niveaux de zoom
var regionsLayer, provincesLayer, communesLayer, centresLayer;

// Charger et afficher les régions (niveau de zoom bas)
fetch('data/geoBoundaries-MAR-ADM1.geojson')
    .then(response => response.json())
    .then(data => {
        regionsLayer = L.geoJSON(data, {
            style: { fillColor: "blue", color: "black", weight: 1, fillOpacity: 0.6 },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip("Région : " + feature.properties.shapeName);
            }
        });
        map.addLayer(regionsLayer);
    });

// Charger et afficher les provinces (niveau de zoom moyen)
fetch('data/geoBoundaries-MAR-ADM2.geojson')
    .then(response => response.json())
    .then(data => {
        provincesLayer = L.geoJSON(data, {
            style: function (feature) {
                return { fillColor: "lightgreen", color: "black", weight: 1, fillOpacity: 0.4 };
            },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip("Province : " + feature.properties.shapeName);
            }
        });
    });

// Liste des communes avec leurs coordonnées GPS
var communes = [
    { name: "Béni Mellal", lat: 32.3373, lng: -6.3498, province: "Béni Mellal" },
    { name: "Kasba Tadla", lat: 32.5987, lng: -6.2684, province: "Béni Mellal" },
    { name: "El Ksiba", lat: 32.5715, lng: -6.0015, province: "Béni Mellal" },
    { name: "Zaouiat Cheikh", lat: 32.6486, lng: -5.9196, province: "Béni Mellal" },
    
    { name: "Khouribga", lat: 32.8811, lng: -6.9063, province: "Khouribga" },
    { name: "Oued Zem", lat: 32.8622, lng: -6.5736, province: "Khouribga" },
    { name: "Bejaad", lat: 32.7746, lng: -6.3879, province: "Khouribga" },
    { name: "Boujniba", lat: 32.9000, lng: -6.7667, province: "Khouribga" },
    { name: "Hattane", lat: 32.9250, lng: -6.8000, province: "Khouribga" },
    
    { name: "Fquih Ben Salah", lat: 32.5000, lng: -6.6833, province: "Fquih Ben Salah" },
    { name: "Oulad Ayad", lat: 32.2000, lng: -6.5000, province: "Fquih Ben Salah" },
    { name: "Oulad Nemma", lat: 32.1833, lng: -6.6667, province: "Fquih Ben Salah" },
    
    { name: "Azilal", lat: 31.9614, lng: -6.5718, province: "Azilal" },
    { name: "Demnate", lat: 31.7311, lng: -6.9250, province: "Azilal" },
    
    { name: "Khénifra", lat: 32.9394, lng: -5.6686, province: "Khénifra" },
    { name: "M'Rirt", lat: 33.1633, lng: -5.5944, province: "Khénifra" }
];

// Ajouter les communes et centres en mode couche
communesLayer = L.layerGroup();
centresLayer = L.layerGroup();

communes.forEach(commune => {
    let besoinProvinceCCT_VL = getRandom(0, 6);
    let besoinProvinceCCT_PL = getRandom(0, 6);
    let besoinCommuneCCT_VL = getRandom(0, 6);
    let besoinCommuneCCT_PL = getRandom(0, 6);

    let communeMarker = L.marker([commune.lat, commune.lng], {
        title: commune.name,
        icon: L.icon({
            iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            iconSize: [25, 25]
        })
    }).bindPopup(`
        <b>Commune : ${commune.name}</b><br>
        <b>Province :</b> ${commune.province}<br><br>
        <b>Besoin Province</b> :<br>
        - VL : ${besoinProvinceCCT_VL}<br>
        - PL : ${besoinProvinceCCT_PL}<br><br>
        <b>Besoin Commune</b> :<br>
        - VL : ${besoinCommuneCCT_VL}<br>
        - PL : ${besoinCommuneCCT_PL}
    `);

    communesLayer.addLayer(communeMarker);

    let centerLat = commune.lat + (Math.random() * 0.02 - 0.01);
    let centerLng = commune.lng + (Math.random() * 0.02 - 0.01);

    let centerMarker = L.marker([centerLat, centerLng], {
        title: "Centre " + commune.name,
        icon: L.icon({
            iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            iconSize: [20, 20]
        })
    }).bindPopup(`
        <b>Centre ${commune.name}</b><br>
        <b>Adresse :</b> Adresse ${commune.name}<br>
        <b>Nbre VL :</b> ${getRandom(0, 6)}<br>
        <b>Nbre PL :</b> ${getRandom(0, 6)}<br>
        <b>AV1 :</b> ${arabicNames[getRandom(0, arabicNames.length - 1)]}<br>
        <b>AV2 :</b> ${arabicNames[getRandom(0, arabicNames.length - 1)]}<br>
        <b>AV3 :</b> ${arabicNames[getRandom(0, arabicNames.length - 1)]}
    `);

    centresLayer.addLayer(centerMarker);
});

// Gestion de l'affichage des couches en fonction du zoom
map.on('zoomend', function () {
    let zoomLevel = map.getZoom();

    if (zoomLevel < 6) {
        map.addLayer(regionsLayer);
        map.removeLayer(provincesLayer);
        map.removeLayer(communesLayer);
        map.removeLayer(centresLayer);
    } else if (zoomLevel >= 6 && zoomLevel < 8) {
        map.removeLayer(regionsLayer);
        map.addLayer(provincesLayer);
        map.removeLayer(communesLayer);
        map.removeLayer(centresLayer);
    } else if (zoomLevel >= 8 && zoomLevel < 10) {
        map.removeLayer(provincesLayer);
        map.addLayer(communesLayer);
        map.removeLayer(centresLayer);
    } else {
        map.addLayer(centresLayer);
    }
});
