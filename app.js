document.addEventListener("DOMContentLoaded", function () {
  const map = L.map('map', {
    center: [33.5731, -7.5898],
    zoom: 6,
    maxBounds: [
      [27.5, -13.5],
      [36.5, -0.9]
    ],
    maxBoundsViscosity: 1.0,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const blueIcon = new L.Icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  const redIcon = new L.Icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  fetch('data_excel_based.json')
    .then(response => response.json())
    .then(data => {
      data.communes.forEach(commune => {
        L.marker([commune.latitude, commune.longitude], {icon: blueIcon})
          .bindPopup(`
            <strong>Commune :</strong> ${commune.name}<br>
            <strong>Région :</strong> ${commune.region}<br>
            <strong>Province/Préfecture :</strong> ${commune.province_prefecture}<br>
            <strong>Besoin Province CCT VL :</strong> ${commune.BesoinProvinceCCT_VL}<br>
            <strong>Besoin Province CCT PL :</strong> ${commune.BesoinProvinceCCT_PL}<br>
            <strong>Besoin Commune CCT VL :</strong> ${commune.BesoinCommuneCCT_VL}<br>
            <strong>Besoin Commune CCT PL :</strong> ${commune.BesoinCommuneCCT_PL}<br>
            <strong>Taux Remplissage Commune VL :</strong> ${commune.TauxRemplissageCommuneVL}<br>
            <strong>Taux Remplissage Commune PL :</strong> ${commune.TauxRemplissageCommunePL}<br>
            <strong>Nombre CVT :</strong> ${commune.Nombre_CVT}<br>
            <strong>Nombre CVT PL :</strong> ${commune.Nombre_CVT_PL}
          `)
          .addTo(map);
      });

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