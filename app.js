// app.js

// Initialisation de la carte
var map = L.map('map').setView([32.000, -6.000], 7);  // Position centrale ajustable

// Ajout du fond de carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Tableau pour stocker les agences
var agences = [];

// Fonction pour ajouter une agence sur la carte
function ajouterAgence(nom, lat, lon) {
    var marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${nom}</b>`)
        .openPopup();
    agences.push({ nom, lat, lon, marker });
}

// Afficher la modal d'ajout de centre
function ouvrirPopupAjout() {
    document.getElementById('popup-ajout').style.display = 'block';
}

// Fermer la modal
function fermerPopupAjout() {
    document.getElementById('popup-ajout').style.display = 'none';
}

// Gestion de la soumission du formulaire
function ajouterCentre() {
    var nom = document.getElementById('nom-centre').value;
    var lat = parseFloat(document.getElementById('latitude').value);
    var lon = parseFloat(document.getElementById('longitude').value);
    
    if (nom && !isNaN(lat) && !isNaN(lon)) {
        ajouterAgence(nom, lat, lon);
        fermerPopupAjout();
    } else {
        alert('Veuillez entrer des coordonnées valides.');
    }
}