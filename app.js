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
                layer.bindTooltip(feature.properties.shapeName);
            }
        });
        map.addLayer(regionsLayer);
    });

// Charger et afficher uniquement les 5 provinces concernées sans "Province de ..."
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
                layer.bindTooltip(feature.properties.shapeName);
            }
        });
    });

// Charger et afficher les communes sous forme de zones (polygones)
fetch('data/geoBoundaries-MAR-ADM3.geojson')  // Assurez-vous que ce fichier contient les communes
    .then(response => response.json())
    .then(data => {
        communesLayer = L.geoJSON(data, {
            filter: function (feature) {
                return targetProvinces.includes(feature.properties.shapeGroup); // Vérifie si la commune appartient à l'une des provinces cibles
            },
            style: function (feature) {
                return { fillColor: "orange", color: "black", weight: 1, fillOpacity: 0.5 };
            },
            onEachFeature: function (feature, layer) {
                let communeName = feature.properties.shapeName;
                let provinceName = feature.properties.shapeGroup;

                layer.bindPopup(`
                    <b>Commune : ${communeName}</b><br>
                    <b>Province :</b> ${provinceName}
                `);
            }
        });
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
