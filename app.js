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
    iconUrl: 'https://png.pngtree.com/png-vector/20190903/ourmid/pngtree-map-location-marker-icon-in-red-png-image_1722078.jpg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Chargement des données JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Affichage des agences
        data.agences.forEach(agence => {
            var customIcon = L.icon({
                iconUrl: 'assets/icons/marker.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            L.marker([agence.latitude, agence.longitude], {icon: customIcon})
                .addTo(map)
                .bindPopup(`<b>${agence.nom}</b><br>${agence.adresse}<br>📞 ${agence.telephone}`);
        });

        // Afficher les communes en bleu
        data.communes.forEach(commune => {
            L.marker([commune.latitude, commune.longitude], { icon: blueIcon })
              .bindPopup(`<b>Commune:</b> ${commune.name}`)
              .addTo(map);
        });

        // Afficher les centres en rouge
        data.centres.forEach(centre => {
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
        });
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
