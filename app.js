// Initialisation de la carte
var map = L.map('map').setView([32.00, -6.00], 6);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Icônes personnalisés
const blueIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

const redIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

// Stockage des marqueurs pour le filtrage
var markersCommunes = [];
var markersAgences = [];
var markersCentres = [];

// Fonction pour charger et afficher les données
function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log("Données JSON chargées:", data);

            // Afficher les communes en bleu
            if (data.communes) {
                markersCommunes = data.communes.map(commune => {
                    return L.marker([commune.latitude, commune.longitude], {icon: blueIcon})
                        .bindPopup(`<b>Commune:</b> ${commune.name}`)
                        .addTo(map);
                });
            }


            // Afficher les centres en rouge (traitement du GPS)
            if (data.centres) {
                markersCentres = data.centres.map(centre => {
                    if (centre.GPS) {
                        const [lat, lng] = centre.GPS.split(',').map(Number);
                        if (!isNaN(lat) && !isNaN(lng)) {
                            return L.marker([lat, lng], {icon: redIcon})
                                .bindPopup(`
                                    <strong>Centre :</strong> ${centre.Centre}<br>
                                    <strong>Adresse :</strong> ${centre.Adresse}<br>
                                    <strong>Horaires :</strong> ${centre.Horaires}<br>
                                    <strong>Téléphone :</strong> ${centre.Telephone}<br>
                                    <strong>Statut :</strong> ${centre.Statut}
                                `)
                                .addTo(map);
                        }
                    }
                }).filter(Boolean); // Filtrer les valeurs undefined
            }
        })
        .catch(error => console.error('Erreur lors du chargement des données:', error));
}

// Fonction de filtrage
function filterMap() {
    var filterValue = document.getElementById("filterSelect").value;
    
    // Suppression de tous les marqueurs
    markersCommunes.forEach(marker => map.removeLayer(marker));
    markersCentres.forEach(marker => map.removeLayer(marker));
    
    if (filterValue === "communes") {
        markersCommunes.forEach(marker => marker.addTo(map));
    } else if (filterValue === "centres") {
        markersCentres.forEach(marker => marker.addTo(map));
    }else {
        markersCommunes.forEach(marker => marker.addTo(map));
        markersAgences.forEach(marker => marker.addTo(map));
        markersCentres.forEach(marker => marker.addTo(map));
    }
}

// Chargement initial des données
loadData();
