// Base de données simulée avec des agences pré-remplies
let agencies = [
  {
    id: 1,
    name: "Agence Paris Centre",
    address: "10 Rue de la Paix, 75002 Paris",
    latitude: 48.8698,
    longitude: 2.3319,
    status: "Ouvert",
    phone: "01 23 45 67 89",
    hours: "09h00 - 18h00",
    city: "Paris",
  },
  {
    id: 2,
    name: "Agence Lyon Part-Dieu",
    address: "15 Rue de la République, 69003 Lyon",
    latitude: 45.7601,
    longitude: 4.8573,
    status: "Fermé",
    phone: "04 56 78 90 12",
    hours: "10h00 - 19h00",
    city: "Lyon",
  },
  {
    id: 3,
    name: "Agence Marseille Vieux-Port",
    address: "25 Quai des Belges, 13001 Marseille",
    latitude: 43.2951,
    longitude: 5.3741,
    status: "En maintenance",
    phone: "04 91 23 45 67",
    hours: "08h30 - 17h30",
    city: "Marseille",
  },
  {
    id: 4,
    name: "Agence Bordeaux Centre",
    address: "5 Place de la Comédie, 33000 Bordeaux",
    latitude: 44.8417,
    longitude: -0.5724,
    status: "En construction",
    phone: "05 56 78 90 12",
    hours: "09h30 - 18h30",
    city: "Bordeaux",
  },
  {
    id: 5,
    name: "Agence Lille Grand-Place",
    address: "12 Place du Général de Gaulle, 59800 Lille",
    latitude: 50.6366,
    longitude: 3.0635,
    status: "Ouvert",
    phone: "03 20 12 34 56",
    hours: "09h00 - 19h00",
    city: "Lille",
  },
];

// Initialisation de la carte Leaflet
const map = L.map('map').setView([46.6031, 1.8883], 6); // Centré sur la France
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Fonction pour ajouter une agence
function addAgency() {
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);
  const status = document.getElementById('status').value;
  const phone = document.getElementById('phone').value;
  const hours = document.getElementById('hours').value;
  const city = document.getElementById('city').value;

  if (!name || !latitude || !longitude) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  const newAgency = {
    id: agencies.length + 1,
    name,
    address,
    latitude,
    longitude,
    status,
    phone,
    hours,
    city,
  };

  agencies.push(newAgency);
  updateMap();
  updateAgencyList();
  clearForm();
}

// Fonction pour mettre à jour la carte
function updateMap() {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  agencies.forEach(agency => {
    const marker = L.marker([agency.latitude, agency.longitude]).addTo(map);
    marker.bindPopup(`
      <b>${agency.name}</b><br>
      ${agency.address}<br>
      Statut: ${agency.status}<br>
      Téléphone: ${agency.phone}<br>
      Horaires: ${agency.hours}<br>
      Commune: ${agency.city}
    `);
  });
}

// Fonction pour mettre à jour la liste des agences
function updateAgencyList() {
  const list = document.getElementById('agency-list');
  list.innerHTML = '';
  agencies.forEach(agency => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>${agency.name}</b> - ${agency.city}<br>
      Statut: ${agency.status}<br>
      <button onclick="deleteAgency(${agency.id})">Supprimer</button>
    `;
    list.appendChild(li);
  });
}

// Fonction pour supprimer une agence
function deleteAgency(id) {
  agencies = agencies.filter(agency => agency.id !== id);
  updateMap();
  updateAgencyList();
}

// Fonction pour vider le formulaire
function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('address').value = '';
  document.getElementById('latitude').value = '';
  document.getElementById('longitude').value = '';
  document.getElementById('status').value = 'Ouvert';
  document.getElementById('phone').value = '';
  document.getElementById('hours').value = '';
  document.getElementById('city').value = '';
}

// Initialisation
updateMap();
updateAgencyList();