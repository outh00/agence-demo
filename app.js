document.addEventListener("DOMContentLoaded", function () {
  let map = L.map('map').setView([31.7917, -7.0926], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          let totalAgences = data.length;
          let agencesActives = data.filter(agence => agence.statut === "active").length;
          let agencesInactives = totalAgences - agencesActives;

          document.getElementById("total-agences").textContent = totalAgences;
          document.getElementById("agences-actives").textContent = agencesActives;
          document.getElementById("agences-inactives").textContent = agencesInactives;

          data.forEach(agence => {
              let marker = L.marker([agence.latitude, agence.longitude]).addTo(map);
              marker.bindPopup(`<b>${agence.nom}</b><br>${agence.adresse}<br>Statut: ${agence.statut}`);
          });
      })
      .catch(error => console.error('Erreur chargement données:', error));
});