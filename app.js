// Initialisation de la carte centrée sur Béni Mellal-Khénifra
var map = L.map('map').setView([32.5, -6.5], 7);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Déclaration des groupes de calques
var layerRegions = L.layerGroup().addTo(map);
var layerProvinces = L.layerGroup();
var layerCommunes = L.layerGroup();
var layerCentres = L.layerGroup();

// Définition des couleurs pour chaque niveau
var colors = {
    region: 'yellow',
    province: 'red',
    commune: 'blue',
    centre: 'purple'
};

// Chargement des données depuis `data.json`
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Données chargées :", data);

        // 🟡 Ajout des Régions
        data.regions.forEach(region => {
            L.polygon(region.polygon, {
                color: colors.region,
                fillColor: colors.region,
                fillOpacity: 0.3
            }).bindPopup(`<b>Région :</b> ${region.nom}`).addTo(layerRegions);
        });

        // 🔴 Ajout des Provinces
        data.provinces.forEach(province => {
            L.polygon(province.polygon, {
                color: colors.province,
                fillColor: colors.province,
                fillOpacity: 0.3
            }).bindPopup(`<b>Province :</b> ${province.nom}`).addTo(layerProvinces);
        });

        // 🔵 Ajout des Communes
        data.communes.forEach(commune => {
            L.polygon(commune.polygon, {
                color: colors.commune,
                fillColor: colors.commune,
                fillOpacity: 0.3
            }).bindPopup(`
                <b>Commune :</b> ${commune.nom}<br>
                <b>Population :</b> ${commune.population}<br>
                <b>Besoin VL :</b> ${commune.BesoinCommuneCCT_VL}<br>
                <b>Besoin PL :</b> ${commune.BesoinCommuneCCT_PL}
            `).addTo(layerCommunes);
        });

        // 🟣 Ajout des Centres (points)
        data.communes.forEach(commune => {
            commune.centres.forEach(centre => {
                L.marker([centre.latitude, centre.longitude], {
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
                `).addTo(layerCentres);
            });
        });

        // Gestion du zoom progressif sans effacer les données
        map.on('zoomend', function() {
            var zoomLevel = map.getZoom();
            console.log("Niveau de zoom actuel :", zoomLevel);

            // Toujours afficher la région
            map.addLayer(layerRegions);

            if (zoomLevel < 8) {  
                map.removeLayer(layerProvinces);
                map.removeLayer(layerCommunes);
                map.removeLayer(layerCentres);
            } else if (zoomLevel >= 8 && zoomLevel < 10) { 
                map.addLayer(layerProvinces);
                map.removeLayer(layerCommunes);
                map.removeLayer(layerCentres);
            } else if (zoomLevel >= 10 && zoomLevel < 12) { 
                map.addLayer(layerCommunes);
                map.removeLayer(layerCentres);
            } else { 
                map.addLayer(layerCentres);
            }
        });

    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));
