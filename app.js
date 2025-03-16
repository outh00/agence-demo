// Base de données simulée
const communes = [
  {
    id: 1,
    name: "Ahlaf",
    coordinates: [
      [33.362, -7.226], // Coordonnées du polygone (zone)
      [33.362, -7.206],
      [33.342, -7.206],
      [33.342, -7.226],
    ],
  },
  {
    id: 2,
    name: "Ain Tizgha",
    coordinates: [
      [33.5897, -7.0294],
      [33.5897, -7.0094],
      [33.5697, -7.0094],
      [33.5697, -7.0294],
    ],
  },
  {
    id: 3,
    name: "Fdalate",
    coordinates: [
      [33.697, -7.2653],
      [33.697, -7.2453],
      [33.677, -7.2453],
      [33.677, -7.2653],
    ],
  },
];

let agences = [
  {
    id: 1,
    name: "Agence Ahlaf 1",
    communeId: 1, // Référence à la commune Ahlaf
    latitude: 33.352,
    longitude: -7.216,
    status: "Ouvert",
    phone: "0522 11 11 11",
    hours: "08h30 - 18h30",
  },
  {
    id: 2,
    name: "Agence Ahlaf 2",
    communeId: 1, // Référence à la commune Ahlaf
    latitude: 33.347,
    longitude: -7.211,
    status: "Fermé",
    phone: "0522 22 22 22",
    hours: "09h00 - 17h00",
  },
  {
    id: 3,
    name: "Agence Ain Tizgha 1",
    communeId: 2, // Référence à la commune Ain Tizgha
    latitude: 33.5797,
    longitude: -7.0194,
    status: "En maintenance",
    phone: "0522 33 33 33",
    hours: "10h00 - 19h00",
  },
];

// Initialisation de la carte Leaflet centrée sur le Maroc
const map = L.map('map').setView([31.7917, -7.0926], 8); // Centré sur le Maroc avec un zoom adapté
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Icône pour les agences
const agenceIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Afficher les communes sous forme de zones (polygones)
communes.forEach(commune => {
  const polygon = L.polygon(commune.coordinates, {
    color: 'blue', // Couleur de la bordure de la zone
    fillColor: 'lightblue', // Couleur de remplissage de la zone
    fillOpacity: 0.4, // Opacité de la zone
  }).addTo(map);

  polygon.bindPopup(`<b>Commune : ${commune.name}</b>`);
});

// Afficher les agences sous forme d'icônes
agences.forEach(agence => {
  const marker = L.marker([agence.latitude, agence.longitude], { icon: agenceIcon }).addTo(map);
  marker.bindPopup(`
    <b>${agence.name}</b><br>
    Statut: ${agence.status}<br>
    Téléphone: ${agence.phone}<br>
    Horaires: ${agence.hours}
  `);
});

// Fonction pour afficher la liste des agences
function updateAgencyList() {
  const list = document.getElementById('agency-list');
  list.innerHTML = '';
  agences.forEach(agence => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>${agence.name}</b><br>
      Statut: ${agence.status}<br>
      <button onclick="deleteAgency(${agence.id})">Supprimer</button>
    `;
    list.appendChild(li);
  });
}

// Fonction pour supprimer une agence
function deleteAgency(id) {
  agences = agences.filter(agence => agence.id !== id);
  updateAgencyList();
  updateMap();
}

// Fonction pour ajouter une agence
function addAgency() {
  const name = document.getElementById('name').value;
  const communeId = parseInt(document.getElementById('commune').value);
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);
  const status = document.getElementById('status').value;
  const phone = document.getElementById('phone').value;
  const hours = document.getElementById('hours').value;

  if (!name || !communeId || !latitude || !longitude) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  const newAgency = {
    id: agences.length + 1,
    name,
    communeId,
    latitude,
    longitude,
    status,
    phone,
    hours,
  };

  agences.push(newAgency);
  updateMap();
  updateAgencyList();
  clearForm();
}

// Fonction pour vider le formulaire
function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('commune').value = '';
  document.getElementById('latitude').value = '';
  document.getElementById('longitude').value = '';
  document.getElementById('status').value = 'Ouvert';
  document.getElementById('phone').value = '';
  document.getElementById('hours').value = '';
}

// Initialisation
updateAgencyList();