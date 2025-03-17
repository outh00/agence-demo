// Initialisation de la carte
var map = L.map('map').setView([32.3683, -6.3692], 8);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Icônes personnalisés
const violetIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

const redIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

// Chargement des données
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);

        // Affichage de la région avec un grand cercle jaune
        data.regions.forEach(region => {
            L.circle([32.3683, -6.3692], {
                color: 'yellow',
                fillColor: '#ffff00',
                fillOpacity: 0.3,
                radius: 100000
            }).addTo(map).bindPopup(`<b>Région :</b> ${region.nom}`);
        });

        // Affichage des provinces avec des cercles rouges
        data.provinces.forEach(province => {
            L.circle(province.polygon[0], {
                color: 'red',
                fillColor: '#ff0000',
                fillOpacity: 0.3,
                radius: 50000
            }).addTo(map).bindPopup(`<b>Province :</b> ${province.nom}`);
        });

        // Affichage des communes avec des cercles violets
        data.communes.forEach(commune => {
            L.circle([commune.latitude, commune.longitude], {
                color: 'purple',
                fillColor: '#800080',
                fillOpacity: 0.3,
                radius: 10000
            }).addTo(map).bindPopup(`
                <b>Commune :</b> ${commune.nom}<br>
                <b>Population :</b> ${commune.population}<br>
                <b>Besoin VL :</b> ${commune.BesoinCommuneCCT_VL}<br>
                <b>Besoin PL :</b> ${commune.BesoinCommuneCCT_PL}
            `);

            // Affichage des agences à l'intérieur de la commune
            commune.centres.forEach((centre, index) => {
                let latOffset = (index - 1) * 0.002;
                let lngOffset = (index - 1) * 0.002;

                L.marker([commune.latitude + latOffset, commune.longitude + lngOffset], {icon: redIcon})
                    .bindPopup(`
                        <strong>Centre :</strong> ${centre.nom}<br>
                        <strong>Adresse :</strong> ${centre.adresse}<br>
                        <strong>Horaires :</strong> ${centre.horaires}<br>
                        <strong>Téléphone :</strong> ${centre.telephone}<br>
                        <strong>Statut :</strong> ${centre.statut}
                    `)
                    .addTo(map);
            });
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));