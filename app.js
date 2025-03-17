document.addEventListener("DOMContentLoaded", () => {
  const map = L.map('map').setView([33.5731, -7.5898], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const communeList = document.getElementById('commune-list');

      data.communes.forEach(commune => {
        const li = document.createElement('li');
        li.textContent = commune.name;
        communeList.appendChild(li);

        L.marker([commune.latitude, commune.longitude])
          .addTo(map)
          .bindPopup(`<strong>${commune.name}</strong>`);
      });
    })
    .catch(error => console.error('Erreur de chargement des données :', error));
});
