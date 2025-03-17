
// Initialisation de la carte
var map = L.map('map').setView([32.3683, -6.3692], 7);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Chargement des données JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);

        // Affichage des provinces avec des polygones
        data.regions[0].provinces.forEach(province => {
            L.polygon(province.polygon, {
                color: 'blue',
                fillColor: 'lightblue',
                fillOpacity: 0.4
            }).addTo(map).bindPopup(`<b>Province :</b> ${province.nom}`);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));
