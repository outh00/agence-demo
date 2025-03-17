// Initialisation de la carte
var map = L.map('map').setView([32.00, -6.00], 6);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Icônes personnalisés
var blueIcon = L.icon({
    iconUrl: 'assets/icons/blue-marker.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

var redIcon = L.icon({
    iconUrl: 'assets/icons/red-marker.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Chargement des données JSON
// Vérifier que les données sont bien reçues
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);

        // Vérifier si les communes existent et sont bien formatées
        if (data.communes) {
            data.communes.forEach(commune => {
                if (commune.latitude && commune.longitude) {
                    L.marker([commune.latitude, commune.longitude], {icon: blueIcon})
                        .bindPopup(`<b>Commune:</b> ${commune.name}`)
                        .addTo(map);
                } else {
                    console.warn("Coordonnées manquantes pour la commune:", commune);
                }
            });
        } else {
            console.error("Aucune commune trouvée dans le fichier JSON.");
        }

        // Vérifier si les centres existent et sont bien formatés
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
                    } else {
                        console.warn("Coordonnées invalides pour le centre:", centre);
                    }
                } else {
                    console.warn("Champ GPS manquant pour le centre:", centre);
                }
            });
        } else {
            console.error("Aucun centre trouvé dans le fichier JSON.");
        }
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));


// Mise à jour des KPIs
function updateKPIs() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-agences').innerText = data.agences.length;
            document.getElementById('total-actif').innerText = data.agences.filter(a => a.statut === 'Actif').length;
            document.getElementById('total-inactif').innerText = data.agences.filter(a => a.statut === 'Inactif').length;
        })
        .catch(error => console.error('Erreur lors du chargement des KPIs:', error));
}
updateKPIs();

// Gestion du menu latéral
document.getElementById('toggle-menu').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('open');
});