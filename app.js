// Initialisation de la carte
var map = L.map('map').setView([32.3683, -6.3692], 8);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Icônes personnalisés pour les centres
const centerIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// Chargement des données
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);

        // Ajout du cercle pour représenter la région
        data.regions.forEach(region => {
            L.circle(region.centre, {
                color: 'yellow',
                fillColor: '#ffff00',
                fillOpacity: 0.2,
                radius: region.radius
            }).addTo(map).bindPopup(`<b>Région :</b> ${region.nom}`);
        });

        // Ajout des cercles pour les provinces
        data.provinces.forEach(province => {
            L.circle(province.centre, {
                color: 'red',
                fillColor: '#ff0000',
                fillOpacity: 0.3,
                radius: province.radius
            }).addTo(map).bindPopup(`<b>Province :</b> ${province.nom}`);
        });

        // Ajout des cercles pour les communes
        data.communes.forEach(commune => {
            L.circle(commune.centre, {
                color: 'blue',
                fillColor: '#0000ff',
                fillOpacity: 0.4,
                radius: commune.radius
            }).addTo(map).bindPopup(`
                <b>Commune :</b> ${commune.nom}<br>
                <b>Population :</b> ${commune.population}<br>
                <b>Besoin VL :</b> ${commune.BesoinCommuneCCT_VL}<br>
                <b>Besoin PL :</b> ${commune.BesoinCommuneCCT_PL}
            `);

            // Ajout des centres sous forme de marqueurs dans les communes
            commune.centres.forEach(centre => {
                L.marker([centre.latitude, centre.longitude], {icon: centerIcon})
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
