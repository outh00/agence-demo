// Initialisation de la carte
var map = L.map('map').setView([31.5, -7.5], 6);

// Ajout d'une couche OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Données spécifiques pour les 5 provinces de Béni Mellal-Khénifra
var provincesData = {
    "Béni Mellal": { NbrVL: getRandom(0, 6), NbrPL: getRandom(0, 6), NbrbesoinPL: getRandom(0, 6), NbrbesoinVL: getRandom(0, 6) },
    "Khouribga": { NbrVL: getRandom(0, 6), NbrPL: getRandom(0, 6), NbrbesoinPL: getRandom(0, 6), NbrbesoinVL: getRandom(0, 6) },
    "Fquih Ben Salah": { NbrVL: getRandom(0, 6), NbrPL: getRandom(0, 6), NbrbesoinPL: getRandom(0, 6), NbrbesoinVL: getRandom(0, 6) },
    "Azilal": { NbrVL: getRandom(0, 6), NbrPL: getRandom(0, 6), NbrbesoinPL: getRandom(0, 6), NbrbesoinVL: getRandom(0, 6) },
    "Khénifra": { NbrVL: getRandom(0, 6), NbrPL: getRandom(0, 6), NbrbesoinPL: getRandom(0, 6), NbrbesoinVL: getRandom(0, 6) }
};

// Fonction pour générer des valeurs aléatoires entre min et max
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

// Charger et afficher les provinces du Maroc (en vert léger) avec données supplémentaires pour les 5 provinces ciblées
fetch('data/geoBoundaries-MAR-ADM2.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                let provinceName = feature.properties.shapeName;
                let fillColor = provincesData[provinceName] ? "green" : "lightgray";
                return { fillColor: fillColor, color: "black", weight: 1, fillOpacity: 0.4 };
            },
            onEachFeature: function (feature, layer) {
                let provinceName = feature.properties.shapeName;
                if (provincesData[provinceName]) {
                    let data = provincesData[provinceName];
                    let tooltipContent = `
                        <b>Province : ${provinceName}</b><br>
                        NbrVL: ${data.NbrVL} <br>
                        NbrPL: ${data.NbrPL} <br>
                        NbrbesoinPL: ${data.NbrbesoinPL} <br>
                        NbrbesoinVL: ${data.NbrbesoinVL}
                    `;
                    layer.bindPopup(tooltipContent);
                } else {
                    layer.bindTooltip("Province : " + provinceName);
                }
            }
        }).addTo(map);
    });
