// Initialisation de la carte avec un zoom par défaut
var map = L.map('map').setView([32.5, -6.5], 6);

// Ajout d'une couche OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fonction pour générer des valeurs aléatoires entre min et max
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Liste des 5 provinces spécifiques
const targetProvinces = ["Béni Mellal", "Khouribga", "Fquih Ben Salah", "Azilal", "Khénifra"];

// Couches pour les niveaux de zoom
var regionsLayer, provincesLayer, communesLayer;

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

// Charger et afficher uniquement les 5 provinces concernées avec "Province de ..." et les données
fetch('data/geoBoundaries-MAR-ADM2.geojson')
    .then(response => response.json())
    .then(data => {
        provincesLayer = L.geoJSON(data, {
            filter: function (feature) {
                return targetProvinces.includes(feature.properties.shapeName);
            },
            style: function (feature) {
                return { fillColor: "lightgreen", color: "black", weight: 1, fillOpacity: 0.4 };
            },
            onEachFeature: function (feature, layer) {
                let provinceName = feature.properties.shapeName;
                
                // Générer des valeurs aléatoires pour les données demandées
                let NbrVL = getRandom(0, 8);
                let NbrPL = getRandom(0, 8);
                let NbrBesoinVL = getRandom(0, 8);
                let NbrBesoinPL = getRandom(0, 8);

                // Ajouter une infobulle avec les données
                layer.bindTooltip(`
                    <b>Province de ${provinceName}</b><br>
                    <b>NbrVL :</b> ${NbrVL}<br>
                    <b>NbrPL :</b> ${NbrPL}<br>
                    <b>NbrBesoinVL :</b> ${NbrBesoinVL}<br>
                    <b>NbrBesoinPL :</b> ${NbrBesoinPL}
                `);
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

// Ajouter les communes avec leurs données
communesLayer = L.layerGroup();
communes.forEach(commune => {
    let marker = L.marker([commune.lat, commune.lng], {
        title: commune.name,
        icon: L.icon({
            iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            iconSize: [25, 25]
        })
    }).bindPopup(`
        <b>Commune : ${commune.name}</b><br>
        <b>Province :</b> Province de ${commune.province}
    `);

    communesLayer.addLayer(marker);
});

// Gestion du zoom dynamique
map.on('zoomend', function () {
    let zoomLevel = map.getZoom();

    if (zoomLevel < 6) {
        map.addLayer(regionsLayer);
        map.removeLayer(provincesLayer);
        map.removeLayer(communesLayer);
    } else if (zoomLevel >= 6 && zoomLevel < 8) {
        map.removeLayer(regionsLayer);
        map.addLayer(provincesLayer);
        map.removeLayer(communesLayer);
    } else if (zoomLevel >= 8) {
        map.removeLayer(provincesLayer);
        map.addLayer(communesLayer);
    }
});
