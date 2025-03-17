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

// Fonction pour charger et afficher les données
function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log("Données JSON chargées:", data);
            
            // Ajout des communes
            markersCommunes = data.communes.map(commune => {
                return L.marker([commune.latitude, commune.longitude], {icon: blueIcon})
                    .bindPopup(`<b>Commune:</b> ${commune.name}`)
                    .addTo(map);
            });
            
            // Ajout des agences
            markersAgences = data.agences.map(agence => {
                return L.marker([agence.latitude, agence.longitude], {icon: redIcon})
                    .bindPopup(`<b>${agence.nom}</b><br>${agence.adresse}<br>📞 ${agence.telephone}`)
                    .addTo(map);
            });
             if (data.communes) {
            data.communes.forEach(commune => {
                if (commune.latitude && commune.longitude) {
                    L.marker([commune.latitude, commune.longitude], {icon: blueIcon})
                        .bindPopup(`<b>Commune:</b> ${commune.name}`)
                        .addTo(map);
                }
            });
        }

        // Afficher les centres en rouge
        if (data.centres) {
            data.centres.forEach(centre => {
                if (centre.GPS) {
                    const [lat, lng] = centre.GPS.split(',').map(Number);
                    if (!isNaN(lat) && !isNaN(lng)) {
                        L.marker([lat, lng], {icon: redIcon})
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
            });
        }
        })
        .catch(error => console.error('Erreur lors du chargement des données:', error));
}

// Fonction de filtrage
function filterMap() {
    var filterValue = document.getElementById("filterSelect").value;
    
    // Suppression de tous les marqueurs
    markersCommunes.forEach(marker => map.removeLayer(marker));
    markersAgences.forEach(marker => map.removeLayer(marker));
    
    if (filterValue === "communes") {
        markersCommunes.forEach(marker => marker.addTo(map));
    } else if (filterValue === "agences") {
        markersAgences.forEach(marker => marker.addTo(map));
    } else {
        markersCommunes.forEach(marker => marker.addTo(map));
        markersAgences.forEach(marker => marker.addTo(map));
    }
}

// Chargement initial des données
loadData();
