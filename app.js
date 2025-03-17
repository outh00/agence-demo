// Base de données simulée
let communes = [];
let centres = [];
let agences = [];

// Initialisation de la carte Leaflet centrée sur le Maroc
const map = L.map('map').setView([31.7917, -7.0926], 6); // Centré sur le Maroc
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Charger les données depuis le fichier JSON
async function loadData() {
  try {
    const response = await fetch('data.json'); // Chemin vers le fichier JSON
    if (!response.ok) {
      throw new Error('Fichier JSON non trouvé ou erreur de chargement');
    }
    const data = await response.json();
    communes = data.communes || [];
    centres = data.centres || [];

    // Afficher les communes et les centres sur la carte
    displayCommunes();
    displayCentres();
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    alert('Erreur lors du chargement des données. Veuillez réessayer.');
  }
}

// Afficher les communes sous forme de zones (polygones)
function displayCommunes() {
  communes.forEach(commune => {
    const polygon = L.polygon(commune.coordinates, {
      color: 'blue',
      fillColor: 'lightblue',
      fillOpacity: 0.4,
    }).addTo(map);

    polygon.bindPopup(`<b>Commune : ${commune.name}</b>`);
  });
}

// Afficher les centres sous forme de marqueurs
function displayCentres() {
  centres.forEach(centre => {
    const [latitude, longitude] = centre.GPS.split(',').map(coord => parseFloat(coord.trim()));
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup(`<b>Centre : ${centre.Centre}</b>`);
  });
}

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
    id: agences.length + 1,
    name,
    address,
    latitude,
    longitude,
    status,
    phone,
    hours,
    city,
  };

  agences.push(newAgency);
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

  agences.forEach(agency => {
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
  agences.forEach(agency => {
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
  agences = agences.filter(agency => agency.id !== id);
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
loadData();
updateMap();
updateAgencyList();