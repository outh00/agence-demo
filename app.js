// Initialisation de la carte avec un zoom de départ sur Béni Mellal-Khénifra
var map = L.map('map').setView([32.5, -6.5], 7);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Définition des groupes de calques pour gérer le zoning
var layerRegions = L.layerGroup().addTo(map);
var layerProvinces = L.layerGroup();
var layerCommunes = L.layerGroup();
var layerCentres = L.layerGroup();

// Chargement des données depuis `data.json`
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données chargées :", data);

        // --- 🔶 Affichage des Régions (Zoom 6-7) ---
        data.regions.forEach(region => {
            L.polygon(region.polygon, {
                color: 'yellow',
                fillColor: '#FFFF00',
                fillOpacity: 0.3
            }).bindPopup(`<b>Région :</b> ${region.nom}`).addTo(layerRegions);
        });

        // --- 🔴 Affichage des Provinces (Zoom 8-9) ---
        data.provinces.forEach(province => {
            var provinceLayer = L.polygon(province.polygon, {
                color: 'red',
                fillColor: '#FF0000',
                fillOpacity: 0.3
            }).bindPopup(`<b>Province :</b> ${province.nom}`);
            layerProvinces.addLayer(provinceLayer);
        });

        // --- 🔵 Affichage des Communes (Zoom 10-11) ---
        data.communes.forEach(commune => {
            var communeLayer = L.polygon(commune.polygon, {
                color: 'blue',
                fillColor: '#0000FF',
                fillOpacity: 0.3
            }).bindPopup(`
                <b>Commune :</b> ${commune.nom}<br>
                <b>Population :</b> ${commune.population}<br>
                <b>Besoin VL :</b> ${commune.BesoinCommuneCCT_VL}<br>
                <b>Besoin PL :</b> ${commune.BesoinCommuneCCT_PL}
            `);
            layerCommunes.addLayer(communeLayer);
        });

        // --- 🟣 Affichage des Centres (Zoom 12+) ---
        data.communes.forEach(commune => {
            commune.centres.forEach(centre => {
                var centreMarker = L.marker([centre.latitude, centre.longitude], {
                    icon: L.icon({
                        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
                        iconSize: [32, 32],
                        iconAnchor: [16, 32]
                    })
                }).bindPopup(`
                    <strong>Centre :</strong> ${centre.nom}<br>
                    <strong>Adresse :</strong> ${centre.adresse}<br>
                    <strong>Horaires :</strong> ${centre.horaires}<br>
                    <strong>Téléphone :</strong> ${centre.telephone}<br>
                    <strong>Statut :</strong> ${centre.statut}
                `);
                layerCentres.addLayer(centreMarker);
            });
        });

        // Gestion du zoom progressif
        map.on('zoomend', function() {
            var zoomLevel = map.getZoom();
            console.log("Niveau de zoom actuel :", zoomLevel);

            if (zoomLevel < 8) {  // Région seulement
                map.addLayer(layerRegions);
                map.removeLayer(layerProvinces);
                map.removeLayer(layerCommunes);
                map.removeLayer(layerCentres);
            } else if (zoomLevel >= 8 && zoomLevel < 10) { // Provinces visibles
                map.addLayer(layerProvinces);
                map.removeLayer(layerCommunes);
                map.removeLayer(layerCentres);
            } else if (zoomLevel >= 10 && zoomLevel < 12) { // Communes visibles
                map.addLayer(layerCommunes);
                map.removeLayer(layerCentres);
            } else { // Centres visibles
                map.addLayer(layerCentres);
            }
        });

    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));
