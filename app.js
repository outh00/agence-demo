document.addEventListener("DOMContentLoaded", function () {
  var map = L.map('map').setView([31.7917, -7.0926], 6);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          data.forEach(center => {
              var marker = L.marker([center.latitude, center.longitude]).addTo(map);
              marker.bindPopup(`<b>${center.nom}</b><br>${center.adresse}<br>${center.telephone}<br>Statut: ${center.statut}`);
          });
      });

  document.getElementById("add-agency-btn").addEventListener("click", function() {
      document.getElementById("popup-form").style.display = "block";
  });

  document.getElementById("close-popup").addEventListener("click", function() {
      document.getElementById("popup-form").style.display = "none";
  });

  document.getElementById("save-agency").addEventListener("click", function() {
      var commune = document.getElementById("commune").value;
      var latitude = parseFloat(document.getElementById("latitude").value);
      var longitude = parseFloat(document.getElementById("longitude").value);
      var adresse = document.getElementById("adresse").value;
      var horaire = document.getElementById("horaire").value;
      var telephone = document.getElementById("telephone").value;
      var statut = document.getElementById("statut").value;
      
      if (!isNaN(latitude) && !isNaN(longitude)) {
          var marker = L.marker([latitude, longitude]).addTo(map);
          marker.bindPopup(`<b>${commune}</b><br>${adresse}<br>${telephone}<br>Statut: ${statut}`);
      }
      
      document.getElementById("popup-form").style.display = "none";
  });
});
