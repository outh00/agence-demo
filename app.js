
// Initialisation de la carte
var map = L.map('map').setView([32.3683, -6.3692], 8);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Chargement des données GeoJSON pour la région, les provinces et les communes
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);

        // Ajout des frontières de la région en jaune
        L.polygon(data.region.polygon, {
            color: 'yellow',
            fillColor: '#ffff00',
            fillOpacity: 0.2
        }).addTo(map).bindPopup(`<b>Région :</b> ${data.region.nom}`);

        // Ajout des frontières des provinces en rouge
        data.provinces.forEach(province => {
            L.polygon(province.polygon, {
                color: 'red',
                fillColor: '#ff6666',
                fillOpacity: 0.3
            }).addTo(map).bindPopup(`<b>Province :</b> ${province.nom}`);
        });

        // Ajout des frontières des communes en bleu
        data.communes.forEach(commune => {
            L.polygon(commune.polygon, {
                color: 'blue',
                fillColor: '#6699ff',
                fillOpacity: 0.4
            }).addTo(map).bindPopup(`
                <b>Commune :</b> ${commune.nom}<br>
                <b>Population :</b> ${commune.population}<br>
                <b>Besoin VL :</b> ${commune.BesoinCommuneCCT_VL}<br>
                <b>Besoin PL :</b> ${commune.BesoinCommuneCCT_PL}
            `);

            // Ajout des centres dans chaque commune
            commune.centres.forEach(centre => {
                L.marker([centre.latitude, centre.longitude])
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
