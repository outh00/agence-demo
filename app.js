// Initialisation de la carte
var map = L.map('map').setView([32.3683, -6.3692], 7); // Centre de la région Béni Mellal-Khénifra

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Couleurs des couches
const regionColor = "#FF5733"; // Orange pour les régions
const provinceColor = "#33FF57"; // Vert pour les provinces
const communeColor = "blue"; // Bleu pour les communes
const centreColor = "red"; // Rouge pour les centres

// Charger les données depuis le fichier JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données JSON chargées:", data);

        // Affichage des régions comme zones
        data.regions.forEach(region => {
            if (region.polygon) {
                L.polygon(region.polygon, { color: regionColor, fillOpacity: 0.3 })
                    .addTo(map)
                    .bindPopup(`<b>Région:</b> ${region.nom}`);
            }
        });

        // Affichage des provinces comme zones plus petites
        data.provinces.forEach(province => {
            if (province.polygon) {
                L.polygon(province.polygon, { color: provinceColor, fillOpacity: 0.4 })
                    .addTo(map)
                    .bindPopup(`<b>Province:</b> ${province.nom}`);
            }
        });

        // Affichage des communes comme points à l'intérieur des provinces
        data.communes.forEach(commune => {
            if (commune.latitude && commune.longitude) {
                L.circleMarker([commune.latitude, commune.longitude], {
                    color: communeColor,
                    radius: 6,
                    fillOpacity: 0.8
                }).bindPopup(`
                    <b>Commune:</b> ${commune.nom}<br>
                    <b>Besoins VL:</b> ${commune.BesoinCommuneCCT_VL}<br>
                    <b>Besoins PL:</b> ${commune.BesoinCommuneCCT_PL}<br>
                    <b>Population:</b> ${commune.population}
                `).addTo(map);

                // Ajouter les centres (max 2 par commune)
                let centres = commune.centres || [];
                centres.slice(0, 2).forEach(centre => {
                    L.marker([commune.latitude, commune.longitude], {
                        icon: L.icon({
                            iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                        })
                    }).bindPopup(`
                        <b>Centre:</b> ${centre.nom}<br>
                        <b>Adresse:</b> ${centre.adresse}<br>
                        <b>Horaires:</b> ${centre.horaires}<br>
                        <b>Téléphone:</b> ${centre.telephone}<br>
                        <b>Statut:</b> ${centre.statut}
                    `).addTo(map);
                });
            }
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));
