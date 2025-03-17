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
