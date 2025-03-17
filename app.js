document.addEventListener("DOMContentLoaded", function() {
  const ajouterCentreBtn = document.getElementById("ajouterCentreBtn");
  const popupForm = document.getElementById("popupForm");
  const closePopup = document.getElementById("closePopup");
  const validerCentre = document.getElementById("validerCentre");
  
  ajouterCentreBtn.addEventListener("click", function() {
      popupForm.style.display = "block";
  });
  
  closePopup.addEventListener("click", function() {
      popupForm.style.display = "none";
  });
  
  window.addEventListener("click", function(event) {
      if (event.target === popupForm) {
          popupForm.style.display = "none";
      }
  });
  
  validerCentre.addEventListener("click", function() {
      const nom = document.getElementById("nom").value;
      const latitude = document.getElementById("latitude").value;
      const longitude = document.getElementById("longitude").value;
      const adresse = document.getElementById("adresse").value;
      const horaire = document.getElementById("horaire").value;
      const telephone = document.getElementById("telephone").value;
      const statut = document.getElementById("statut").value;

      if (!nom || !latitude || !longitude || !adresse || !horaire || !telephone || !statut) {
          alert("Veuillez remplir tous les champs");
          return;
      }

      const centre = {
          nom: nom,
          latitude: latitude,
          longitude: longitude,
          adresse: adresse,
          horaire: horaire,
          telephone: telephone,
          statut: statut
      };
      
      console.log("Nouveau centre ajouté :", centre);
      alert("Centre ajouté avec succès !");
      popupForm.style.display = "none";
  });
});
