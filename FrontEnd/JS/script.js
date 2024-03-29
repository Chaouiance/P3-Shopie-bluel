// Déclaration des variables
let works; // Variable pour stocker les données des travaux
let category; // Variable pour stocker la catégorie sélectionnée


// Récupération des valeurs du formulaire d'authentification


const filterButtons = document.querySelectorAll('.btnFilter input[type="radio"]'); // Sélection de tous les boutons de filtre
const modalAjout = document.querySelector("#modalAjout"); // Sélection de la modal d'ajout
const openModalAjout = document.querySelector("#ajoutPhoto"); // Sélection du bouton pour ouvrir la modal d'ajout
const image = document.getElementById("preview-image"); // Sélection de l'image
const sendWorks = document.getElementById("sendWorks"); // Sélection du bouton d'envoi des travaux
const arrow = document.querySelector("i.fa-arrow-left"); // Sélection de la flèche de retour
const xmark = document.querySelector("i.fa-xmark"); // Sélection de la croix de fermeture
let selectedFilter; // Variable pour stocker le filtre sélectionné
const gallery = document.querySelector(".gallery"); // Sélection de la galerie
const modal = document.querySelector("#modal"); // Sélection de la modal principale
const openModal = document.querySelector(".projetsModif a"); // Sélection du bouton pour ouvrir la modal
const openModal2 = document.querySelector(".edition a"); // Sélection du deuxième bouton pour ouvrir la modal
const main = document.querySelector("#main"); // Sélection de la section principale
const token = localStorage.getItem("token"); // Récupération du token depuis le stockage local
const articlePhotos = document.querySelector(".articlePhotos"); // Sélection de la section des photos dans la modal d'édition
let figureModal; // Variable pour stocker la figure de la modal
let titre = document.getElementById("title"); // Sélection du champ de titre
let categorie = document.getElementById("categoryForm"); // Sélection du champ de catégorie
let photo = document.querySelector("#content"); // Sélection du champ de contenu de la photo


// Fonction qui crée le tableau des travaux
function createArray(works) {
  for (let i = 0; i < works.length; i++) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figCaption = document.createElement("figCaption");

    img.src = works[i].imageUrl;
    img.alt = works[i].title;
    figCaption.textContent = works[i].title;
    figure.id = works[i].id;

    figure.appendChild(img);
    figure.appendChild(figCaption);
    gallery.appendChild(figure);
  }
}

// Fonction qui permet de filtrer les travaux
function filterCategory(filterButtons) {
  filterButtons.forEach((button) => {
    button.addEventListener("change", () => {
      const selectedFilter = button.id;
      gallery.innerHTML = "";
      filterContent(selectedFilter);
      console.log(selectedFilter);
    });
  });
}

// Refaire le tableau en fonction du filtre
function filterContent(selectedFilter) {
  if (selectedFilter === "objets") {
    const filteredWorks = works.filter((work) => work.categoryId === 1);
    console.log(filteredWorks);
    createArray(filteredWorks);
  }
  if (selectedFilter === "appartements") {
    const filteredWorks = works.filter((work) => work.categoryId === 2);
    console.log(filteredWorks);
    createArray(filteredWorks);
  }
  if (selectedFilter === "hotel") {
    const filteredWorks = works.filter((work) => work.categoryId === 3);
    console.log(filteredWorks);
    createArray(filteredWorks);
  }
  if (selectedFilter === "tous") {
    createArray(works);
  }
}

// Récuperation des works
async function getWorks(url) {
  await fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      works = data;
      document.querySelector(".gallery").innerHTML = "";
      createArray(works);
      filterCategory(filterButtons);
      filterContent(selectedFilter);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Récuperation et suppression des images de l'API
function createArrayModal(works) {
  for (let i = 0; i < works.length; i++) {
    const figureModal = document.createElement("figure");
    const img = document.createElement("img");
    const trash = document.createElement("i");

    img.src = works[i].imageUrl;
    img.alt = works[i].title;
    figureModal.id = works[i].id;
    trash.className = "fa-solid fa-trash-can";

    figureModal.appendChild(img);
    figureModal.appendChild(trash);
    articlePhotos.appendChild(figureModal);

    // Suppression des élements
    trash.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      let figureModal = event.target.parentElement;
      console.log(figureModal.id);
      figureModal.remove();
      let figureToRemove = document.getElementById(figureModal.id);
      if (figureToRemove) {
        figureToRemove.remove();
      }
      fetch("http://localhost:5678/api/works/" + figureModal.id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }
      })
        .then(() => {
          console.log("Suppression réussi")
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
}

// Création de la gallerie
getWorks("http://localhost:5678/api/works");

// Ouvrir la modal
openModal.addEventListener("click", () => {
  modal.style.display = "flex";
  document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  main.style.opacity = "0.6";
  articlePhotos.innerHTML = "";
  getWorks("http://localhost:5678/api/works");
  createArrayModal(works);
});
openModal2.addEventListener("click", () => {
  modal.style.display = "flex";
  document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  main.style.opacity = "0.6";
  articlePhotos.innerHTML = "";
  getWorks("http://localhost:5678/api/works");
  createArrayModal(works);
});

// Fermer la modal
document.addEventListener("click", (event) => {
  if (
    (!modal.contains(event.target) &&
      !modalAjout.contains(event.target) &&
      event.target !== openModal &&
      event.target !== openModal2) ||
    event.target === xmark
  ) {
    modal.style.display = "none";
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0)";
    main.style.opacity = "";
    articlePhotos.innerHTML = "";
    getWorks("http://localhost:5678/api/works");
    createArrayModal(works);
  }
});

// Ouvrir la modal Ajout
openModalAjout.addEventListener("click", () => {
  modalAjout.style.display = "flex";
  document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  main.style.opacity = "0.6";
});

// Fermer la modal Ajout
document.addEventListener("click", (event) => {
  if (
    (!modalAjout.contains(event.target) && event.target !== openModalAjout) ||
    event.target === arrow ||
    event.target === xmark
  ) {
    modalAjout.style.display = "none";
  }
});

// Visualisation img
document.getElementById("content").addEventListener("change", function () {
  let file = this.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      image.src = e.target.result;
      image.style.display = "flex";
      document.querySelector(".fa-image").style.display = "none";
      document.querySelector('label[for="content"]').style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Envoi des travaux à l'API
sendWorks.addEventListener("click", (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append("title", titre.value);
  formData.append("category", categorie.value);
  formData.append("image", photo.files[0]);
  let token = localStorage.getItem("token");

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Ressource créée avec succès :", response);
      } else {
        throw new Error("Erreur lors de la création de la ressource");
      }
    })
    .then(() => {
      getWorks("http://localhost:5678/api/works");
      (articlePhotos.innerHTML = "");
      createArrayModal(works);
    })
    .then(() => {
      titre.value = "",
        categorie.value = "",
        image.style.display = "none",
        document.querySelector(".fa-image").style.display = "flex",
        document.querySelector('label[for="content"]').style.display = "flex";
    })
    .catch((error) => {
      console.error("Erreur :", error);
    });
});


// Fonction pour vérifier si les champs sont remplis
function areFieldsFilled() {

  const titleFilled = titre.value !== "";
  const categoryFilled = categorie.value !== "";
  const contentFilled = photo.files.length > 0;

  return titleFilled && categoryFilled && contentFilled;
}

// Fonction pour activer ou désactiver le bouton d'ajout de projet
function disableSubmit() {
  if (!areFieldsFilled() === true) {
    sendWorks.disabled = true;
    sendWorks.style.background = "#A7A7A7";
    sendWorks.style.cursor = "inherit"
  }
  else {
    sendWorks.disabled = false;
    sendWorks.style.background = "#1D6154";
    sendWorks.style.cursor = "pointer"
  }
}

// Écouter les événements de changement dans les champs du formulaire
titre.addEventListener("input", disableSubmit);
categorie.addEventListener("change", disableSubmit);
photo.addEventListener("change", disableSubmit);

// Vérifier l'état initial des champs pour activer ou désactiver le bouton de soumission
disableSubmit();

