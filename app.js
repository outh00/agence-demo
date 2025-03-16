// Base de données simulée avec des agences au Maroc
let agencies = [
  {
    id: 1,
    name: "Agence Casablanca Centre",
    address: "123 Boulevard Mohammed V, Casablanca",
    latitude: 33.5731,
    longitude: -7.5898,
    status: "Ouvert",
    phone: "0522 98 76 54",
    hours: "08h30 - 18h30",
    city: "Casablanca",
  },
  {
    id: 2,
    name: "Agence Rabat Ville",
    address: "45 Avenue Hassan II, Rabat",
    latitude: 34.0209,
    longitude: -6.8416,
    status: "Fermé",
    phone: "0537 12 34 56",
    hours: "09h00 - 17h00",
    city: "Rabat",
  },
  {
    id: 3,
    name: "Agence Marrakech Médina",
    address: "10 Rue Riad Zitoun, Marrakech",
    latitude: 31.6295,
    longitude: -7.9811,
    status: "En maintenance",
    phone: "0524 44 55 66",
    hours: "10h00 - 19h00",
    city: "Marrakech",
  },
  {
    id: 4,
    name: "Agence Tanger Ville",
    address: "5 Avenue Pasteur, Tanger",
    latitude: 35.7643,
    longitude: -5.8329,
    status: "En construction",
    phone: "0539 33 44 55",
    hours: "08h00 - 16h00",
    city: "Tanger",
  },
  {
    id: 5,
    name: "Agence Fès Médina",
    address: "20 Rue Talaa Kebira, Fès",
    latitude: 34.0637,
    longitude: -4.9778,
    status: "Ouvert",
    phone: "0535 66 77 88",
    hours: "09h30 - 18h30",
    city: "Fès",
  },
];

// Initialisation de la carte Leaflet centrée sur le Maroc
const map = L.map('map').setView([31.7917, -7.0926], 6); // Centré sur le Maroc
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
      Ville: ${agency.city}
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