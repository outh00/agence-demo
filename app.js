// Initialisation de la carte
var map = L.map('map').setView([31.5, -7.5], 6);

// Ajout d'une couche OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Charger et afficher les régions du Maroc (en bleu)
fetch('data/geoBoundaries-MAR-ADM1.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: { fillColor: "blue", color: "black", weight: 1, fillOpacity: 0.6 },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip("Région : " + feature.properties.shapeName);
            }
        }).addTo(map);
    });

// Charger et afficher les provinces du Maroc (en vert clair)
fetch('data/geoBoundaries-MAR-ADM2.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: { fillColor: "lightgreen", color: "black", weight: 1, fillOpacity: 0.4 },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip("Province : " + feature.properties.shapeName);
            }
        }).addTo(map);
    });

