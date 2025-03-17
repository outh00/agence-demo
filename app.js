// Initialisation de la carte
var map = L.map('map').setView([32.00, -6.00], 6);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fonction pour charger les agences depuis le fichier JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        data.agences.forEach(agence => {
            var customIcon = L.icon({
                iconUrl: 'assets/icons/marker.png', // Assurez-vous que le chemin est correct
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            L.marker([agence.latitude, agence.longitude], {icon: customIcon})
                .addTo(map)
                .bindPopup(`<b>${agence.nom}</b><br>${agence.adresse}<br>📞 ${agence.telephone}`);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des agences:', error));

// Affichage des KPIs
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

// Gestion du bouton "Ajouter une agence"
document.getElementById('ajouterAgence').addEventListener('click', function () {
    document.getElementById('popup-ajout').style.display = 'block';
});

document.getElementById('fermerPopup').addEventListener('click', function () {
    document.getElementById('popup-ajout').style.display = 'none';
});

// Fonction pour ajouter une agence
document.getElementById('ajouterAgenceBtn').addEventListener('click', function () {
    var nom = document.getElementById('nomAgence').value;
    var latitude = parseFloat(document.getElementById('latitude').value);
    var longitude = parseFloat(document.getElementById('longitude').value);
    var adresse = document.getElementById('adresse').value;
    var telephone = document.getElementById('telephone').value;
    var statut = document.getElementById('statut').value;

    if (!nom || isNaN(latitude) || isNaN(longitude) || !adresse || !telephone || !statut) {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }

    var nouvelleAgence = { nom, latitude, longitude, adresse, telephone, statut };
    
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            data.agences.push(nouvelleAgence);
            // Mise à jour des KPIs
            updateKPIs();
            // Ajout du marqueur sur la carte
            var customIcon = L.icon({
                iconUrl: 'assets/icons/marker.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            L.marker([latitude, longitude], {icon: customIcon})
                .addTo(map)
                .bindPopup(`<b>${nom}</b><br>${adresse}<br>📞 ${telephone}`);
            
            alert('Agence ajoutée avec succès !');
            document.getElementById('popup-ajout').style.display = 'none';
        })
        .catch(error => console.error('Erreur lors de lajout de lagence:', error));
});