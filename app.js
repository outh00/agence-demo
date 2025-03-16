// Base de données simulée avec les communes fournies
let agencies = [
  {
    id: 1,
    name: "Ahlaf",
    address: "Ahlaf, Maroc",
    latitude: 33.352,
    longitude: -7.216,
    status: "Ouvert",
    phone: "0522 11 11 11",
    hours: "08h30 - 18h30",
    city: "Ahlaf",
  },
  {
    id: 2,
    name: "Ain Tizgha",
    address: "Ain Tizgha, Maroc",
    latitude: 33.5797,
    longitude: -7.0194,
    status: "Ouvert",
    phone: "0522 22 22 22",
    hours: "09h00 - 17h00",
    city: "Ain Tizgha",
  },
  {
    id: 3,
    name: "Fdalate",
    address: "Fdalate, Maroc",
    latitude: 33.687,
    longitude: -7.2553,
    status: "Fermé",
    phone: "0522 33 33 33",
    hours: "10h00 - 19h00",
    city: "Fdalate",
  },
  {
    id: 4,
    name: "Mellila",
    address: "Mellila, Maroc",
    latitude: 33.361,
    longitude: -6.9657,
    status: "En maintenance",
    phone: "0522 44 44 44",
    hours: "08h00 - 16h00",
    city: "Mellila",
  },
  {
    id: 5,
    name: "Moualine El Ghaba",
    address: "Moualine El Ghaba, Maroc",
    latitude: 33.7262,
    longitude: -7.1274,
    status: "Ouvert",
    phone: "0522 55 55 55",
    hours: "09h30 - 18h30",
    city: "Moualine El Ghaba",
  },
  {
    id: 6,
    name: "Moualine El Ouad",
    address: "Moualine El Ouad, Maroc",
    latitude: 33.5326,
    longitude: -7.3384,
    status: "En construction",
    phone: "0522 66 66 66",
    hours: "08h00 - 16h00",
    city: "Moualine El Ouad",
  },
  {
    id: 7,
    name: "Oulad Ali Toualaa",
    address: "Oulad Ali Toualaa, Maroc",
    latitude: 33.4994,
    longitude: -7.1065,
    status: "Ouvert",
    phone: "0522 77 77 77",
    hours: "09h00 - 17h00",
    city: "Oulad Ali Toualaa",
  },
  {
    id: 8,
    name: "Oulad Yahya Louta",
    address: "Oulad Yahya Louta, Maroc",
    latitude: 33.532,
    longitude: -7.236,
    status: "Fermé",
    phone: "0522 88 88 88",
    hours: "10h00 - 19h00",
    city: "Oulad Yahya Louta",
  },
  {
    id: 9,
    name: "Rdadna Oulad Malek",
    address: "Rdadna Oulad Malek, Maroc",
    latitude: 33.4238,
    longitude: -7.1955,
    status: "Ouvert",
    phone: "0522 99 99 99",
    hours: "08h30 - 18h30",
    city: "Rdadna Oulad Malek",
  },
  {
    id: 10,
    name: "Ziaida",
    address: "Ziaida, Maroc",
    latitude: 33.5797,
    longitude: -7.0194,
    status: "En maintenance",
    phone: "0522 00 00 00",
    hours: "09h00 - 17h00",
    city: "Ziaida",
  },
  {
    id: 11,
    name: "Bir Ennasr",
    address: "Bir Ennasr, Maroc",
    latitude: 33.3276,
    longitude: -6.9335,
    status: "Ouvert",
    phone: "0522 12 34 56",
    hours: "08h00 - 16h00",
    city: "Bir Ennasr",
  },
  {
    id: 12,
    name: "Bni Yakhlef",
    address: "Bni Yakhlef, Maroc",
    latitude: 33.6717,
    longitude: -7.2717,
    status: "Fermé",
    phone: "0522 98 76 54",
    hours: "10h00 - 19h00",
    city: "Bni Yakhlef",
  },
  {
    id: 13,
    name: "El Mansouria",
    address: "El Mansouria, Maroc",
    latitude: 33.687,
    longitude: -7.2553,
    status: "En construction",
    phone: "0522 11 22 33",
    hours: "09h30 - 18h30",
    city: "El Mansouria",
  },
];

// Initialisation de la carte Leaflet centrée sur le Maroc
const map = L.map('map').setView([31.7917, -7.0926], 8); // Centré sur le Maroc avec un zoom adapté
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Icône rouge pour les marqueurs
const redIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41], // Taille de l'icône
  iconAnchor: [12, 41], // Point d'ancrage de l'icône
});

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
    const marker = L.marker([agency.latitude, agency.longitude], { icon: redIcon }).addTo(map);
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