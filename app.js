// Base de données simulée
const communes = [
  { id: 1, name: "Ahlaf", latitude: 33.352, longitude: -7.216 },
  { id: 2, name: "Ain Tizgha", latitude: 33.5797, longitude: -7.0194 },
  { id: 3, name: "Fdalate", latitude: 33.687, longitude: -7.2553 },
  { id: 4, name: "Mellila", latitude: 33.361, longitude: -6.9657 },
  { id: 5, name: "Moualine El Ghaba", latitude: 33.7262, longitude: -7.1274 },
  { id: 6, name: "Moualine El Ouad", latitude: 33.5326, longitude: -7.3384 },
  { id: 7, name: "Oulad Ali Toualaa", latitude: 33.4994, longitude: -7.1065 },
  { id: 8, name: "Oulad Yahya Louta", latitude: 33.532, longitude: -7.236 },
  { id: 9, name: "Rdadna Oulad Malek", latitude: 33.4238, longitude: -7.1955 },
  { id: 10, name: "Ziaida", latitude: 33.5797, longitude: -7.0194 },
  { id: 11, name: "Bir Ennasr", latitude: 33.3276, longitude: -6.9335 },
  { id: 12, name: "Bni Yakhlef", latitude: 33.6717, longitude: -7.2717 },
  { id: 13, name: "El Mansouria", latitude: 33.687, longitude: -7.2553 },
];

let agences = [
  {
    id: 1,
    name: "Agence Ahlaf 1",
    communeId: 1, // Référence à la commune Ahlaf
    status: "Ouvert",
    phone: "0522 11 11 11",
    hours: "08h30 - 18h30",
  },
  {
    id: 2,
    name: "Agence Ahlaf 2",
    communeId: 1, // Référence à la commune Ahlaf
    status: "Fermé",
    phone: "0522 22 22 22",
    hours: "09h00 - 17h00",
  },
  {
    id: 3,
    name: "Agence Ain Tizgha 1",
    communeId: 2, // Référence à la commune Ain Tizgha
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

// Icônes
const communeIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const agenceIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Afficher les communes sur la carte
communes.forEach(commune => {
  const marker = L.marker([commune.latitude, commune.longitude], { icon: communeIcon }).addTo(map);
  marker.bindPopup(`<b>Commune : ${commune.name}</b>`);
});

// Afficher les agences sur la carte
agences.forEach(agence => {
  const commune = communes.find(c => c.id === agence.communeId);
  if (commune) {
    const marker = L.marker([commune.latitude, commune.longitude], { icon: agenceIcon }).addTo(map);
    marker.bindPopup(`
      <b>${agence.name}</b><br>
      Commune: ${commune.name}<br>
      Statut: ${agence.status}<br>
      Téléphone: ${agence.phone}<br>
      Horaires: ${agence.hours}
    `);
  }
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
  const status = document.getElementById('status').value;
  const phone = document.getElementById('phone').value;
  const hours = document.getElementById('hours').value;

  if (!name || !communeId) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  const newAgency = {
    id: agences.length + 1,
    name,
    communeId,
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
  document.getElementById('status').value = 'Ouvert';
  document.getElementById('phone').value = '';
  document.getElementById('hours').value = '';
}

// Initialisation
updateAgencyList();