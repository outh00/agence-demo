document.addEventListener("DOMContentLoaded", function () {
  const map = L.map('map', {
    center: [33.5731, -7.5898],
    zoom: 6,
    maxBounds: [
      [27.5, -13.5],   // Sud-Ouest du Maroc
      [36.5, -0.9]     // Nord-Est du Maroc
    ],
    maxBoundsViscosity: 1.0, // Empêche le déplacement hors des limites
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const blueIcon = new L.Icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  const redIcon = new L.Icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  fetch('data_final.json')
    .then(response => response.json())
    .then(data => {
      data.communes.forEach(commune => {
        L.marker([commune.latitude, commune.longitude], {icon: blueIcon})
          .bindPopup(`<strong>Commune :</strong> ${commune.name}`)
          .addTo(map);
      });

      data.centres.forEach(centre => {
        const [lat, lng] = centre.GPS.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          L.marker([lat, lng], {icon: redIcon})
            .bindPopup(`<strong>Centre :</strong> ${centre.Centre}`)
            .addTo(map);
        }
      });
    })
    .catch(err => console.error("Erreur lors du chargement des données :", err));
});