// Initialisation de la carte
var map = L.map('map').setView([32.00, -6.00], 6);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Définition des icônes personnalisés
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

// Vérifier que les données sont bien reçues
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);

        // Afficher les communes en bleu
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

// Fonction pour afficher/masquer le pop-up
function togglePopup() {
    var popup = document.getElementById('popup-ajout');
    popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
}

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
    togglePopup();
});
