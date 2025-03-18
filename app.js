// Initialisation de la carte
var map = L.map('map').setView([31.5, -7.5], 6);

// Ajout d'une couche OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fonction pour générer des valeurs aléatoires entre min et max
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Liste des communes avec leurs coordonnées GPS et des données aléatoires
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

// Définition des couleurs pour chaque province
var provinceColors = {
    "Béni Mellal": "red",
    "Khouribga": "blue",
    "Fquih Ben Salah": "green",
    "Azilal": "purple",
    "Khénifra": "orange"
};

// Ajouter les cercles des communes APRES les couches GeoJSON et s'assurer qu'ils sont DEVANT
var circleLayerGroup = L.layerGroup().addTo(map);

communes.forEach(commune => {
    let besoinProvinceCCT_VL = getRandom(0, 6);
    let besoinProvinceCCT_PL = getRandom(0, 6);
    let besoinCommuneCCT_VL = getRandom(0, 6);
    let besoinCommuneCCT_PL = getRandom(0, 6);

    let circle = L.circleMarker([commune.lat, commune.lng], {
        radius: 8,  // Taille du cercle
        color: "black",  // Bordure
        fillColor: provinceColors[commune.province],  // Couleur selon la province
        fillOpacity: 0.8,
        weight: 1,
        interactive: true // Rendre le cercle cliquable
    });

    // Associer un popup cliquable
    circle.bindPopup(`
        <b>Commune : ${commune.name}</b><br>
        Province : ${commune.province}<br>
        Latitude : ${commune.lat}<br>
        Longitude : ${commune.lng}<br><br>
        <b>Besoin Province</b> :<br>
        - VL : ${besoinProvinceCCT_VL}<br>
        - PL : ${besoinProvinceCCT_PL}<br><br>
        <b>Besoin Commune</b> :<br>
        - VL : ${besoinCommuneCCT_VL}<br>
        - PL : ${besoinCommuneCCT_PL}
    `);

    circle.addTo(circleLayerGroup).bringToFront(); // Assurer que le cercle est devant les autres couches
});

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

// Charger et afficher les provinces du Maroc (en vert léger)
fetch('data/geoBoundaries-MAR-ADM2.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                let provinceName = feature.properties.shapeName;
                let fillColor = "lightgreen"; 
                return { fillColor: fillColor, color: "black", weight: 1, fillOpacity: 0.4 };
            },
            onEachFeature: function (feature, layer) {
                let provinceName = feature.properties.shapeName;
                layer.bindTooltip("Province : " + provinceName);
            }
        }).addTo(map);
    });
