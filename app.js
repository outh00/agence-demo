document.addEventListener("DOMContentLoaded", () => {
  const map = L.map('map').setView([33.5731, -7.5898], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Définition des icônes personnalisées
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
// Bouton pour afficher le popup
document.getElementById('ajouterAgence').addEventListener('click', function () {
  document.getElementById('popup-ajout').style.display = 'block';
});

// Bouton pour fermer le popup
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
  
  // Ajout du marqueur sur la carte
  var customIcon = L.icon({
      iconUrl: 'assets/icons/marker.png', // Assurez-vous que le chemin est correct
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
  });

  L.marker([latitude, longitude], {icon: customIcon})
      .addTo(map)
      .bindPopup(`<b>${nom}</b><br>${adresse}<br>📞 ${telephone}`);

  // Mise à jour des KPIs
  updateKPIs();

  alert('Agence ajoutée avec succès !');
  document.getElementById('popup-ajout').style.display = 'none';
});

// Fonction pour mettre à jour les KPIs
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

  // Charger les données JSON et placer les marqueurs
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
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
  .catch(err => console.error("Erreur lors du chargement des données :", err));
});
