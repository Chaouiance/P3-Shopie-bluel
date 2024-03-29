// Éléments de connexion récupérés à partir du DOM
const element = {
  email: document.querySelector("#email"), // Sélection de l'élément d'entrée pour l'email
  password: document.querySelector("#password"), // Sélection de l'élément d'entrée pour le mot de passe
  submit: document.querySelector("#btnConnexion"), // Sélection du bouton de soumission du formulaire de connexion
};

// Ajout d'un écouteur d'événements sur le bouton de soumission du formulaire
const btnConnexion = document.getElementById("submit");
btnConnexion.addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche le comportement par défaut du formulaire

  // Récupération des valeurs du formulaire d'authentification
  let emailForm = event.target.email.value;
  let passwordForm = event.target.password.value;

  // Création d'un objet contenant les données du formulaire
  let data = {
    email: emailForm,
    password: passwordForm,
  };
  console.log(data); // Affichage des données du formulaire dans la console

  // Envoi des données du formulaire au serveur via une requête POST
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Conversion de l'objet JavaScript en chaîne JSON
  })
    .then((response) => {
      // Gestion de la réponse de la requête
      if (!response.ok) {
        // Si la réponse n'est pas OK, affichage d'un message d'erreur
        document.getElementById("errorMessage").textContent =
          "Email ou mot de passe incorrect.";
        throw new Error("La requête a échoué"); // Lancer une erreur pour passer directement à la section catch
      }
      return response.json(); // Renvoie les données JSON de la réponse
    })
    .then((data) => {
      console.log(data); // Affichage des données JSON reçues dans la console

      // Stockage du token JWT dans le stockage local
      localStorage.setItem("token", data.token);

      if (data) {
        // Si les données sont reçues avec succès, redirection vers la page HTML Admin
        window.location.href = "admin.html";
      }
    })
    .catch((error) => {
      // Gestion des erreurs
      console.error("Erreur lors de la requête :", error); // Affichage de l'erreur dans la console
    });
});
