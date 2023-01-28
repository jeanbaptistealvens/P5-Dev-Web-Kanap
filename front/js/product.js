// Déclaration de l'URL de l'API
const url = "http://localhost:3000/api/products/";

// Déclare une variable pour stocker le produit sélectionné
let product = "";

// Ecoute de l'événement de chargement de la fenêtre
window.addEventListener("load", function () {
  // Récupère les paramètres de la requête de l'URL
  const param = window.location.search;
  // Si des paramètres sont présents
  if (param) {
    // Appel de la fonction pour récupérer le produit sélectionné
    get_product(param);

    // Ecoute de l'événement "click" sur le bouton "Ajouter au panier"
    document.getElementById("addToCart").addEventListener("click", (event) => {
      // Appel de la fonction pour ajouter le produit au panier
      add_to_cart(product);
    });
  }
});

// Fonction pour récupérer le produit sélectionné à partir de l'API
async function get_product(param) {
  // Récupère l'ID du produit à partir des paramètres de la requête
  id = new URLSearchParams(param).get("id");
  // Récupère les données du produit à partir de l'API
  const response = await fetch(url + id);
  // Stock les données du produit dans la variable déclarée en haut
  product = await response.json();

  // Récupère l'élément HTML pour afficher l'image du produit
  const img = document.getElementsByClassName("item__img")[0];

  // Affiche l'image du produit dans l'élément HTML
  img.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;

  // Affiche le nom, le prix et la description du produit sur la page HTML
  set_value("title", product.name);
  set_value("price", product.price);
  set_value("description", product.description);
  // Affiche la liste des couleurs disponibles pour le produit sur la page HTML
  set_list("colors", product.colors);
}

// Fonction pour mettre à jour la valeur d'un élément HTML
function set_value(target, value) {
  // Récupère l'élément HTML ciblé par son ID
  // et affecte la valeur passée en argument à la propriété innerHTML de l'élément
  document.getElementById(target).innerHTML = value;
}

// Fonction pour créer une liste d'options pour un élément HTML de type "select"
function set_list(target, options) {
  // Récupère l'élément HTML ciblé par son ID
  var select = document.getElementById(target);

  // Boucle sur les options passées en argument
  for (var i = 0; i < options.length; i++) {
    // Crée un élément HTML "option"
    var option = document.createElement("option");
    // Affecte la valeur et le texte de l'option
    option.value = options[i];
    option.text = options[i];
    // Ajoute l'option à l'élément "select"
    select.appendChild(option);
  }
}

function add_to_cart(product) {
  // Récupère la couleur sélectionnée dans la page HTML
  const color = document.getElementById("colors").value;
  // Convertit la quantité saisie en nombre entier
  const quantity = parseInt(document.getElementById("quantity").value);

  // Vérifie si la couleur et la quantité sont valides
  if (color && quantity > 0 && quantity < 101) {
    // Définit une clé pour le produit dans le stockage local
    const key = product._id;
    // Récupère les données du produit dans le stockage local
    var record = JSON.parse(localStorage.getItem(key)) || {};
    // Ajoute la quantité pour la couleur sélectionnée
    record[color] = (parseInt(record[color]) || 0) + quantity;
    // Enregistre les données du produit dans le stockage local
    localStorage.setItem(key, JSON.stringify(record));
    // Récupère les données du produit dans le stockage local
    var record = JSON.parse(localStorage.getItem(key));
    // Affiche un message de confirmation d'après les données du produit dans le stockage local
    if (record[color] === 1)
      alert(`${1} ${product.name} de couleur ${color} a été ajoutée au panier.`);
    if (record[color] > 1)
      alert(`${record[color]} ${product.name} de couleur ${color} ont été ajoutées au panier.`);
    // Sinon, affiche des messages d'erreur spécifiques
  } else {
    // Affiche un message d'erreur si aucune couleur n'est sélectionnée
    if (!color) alert("Vous devez choisir une couleur!");
    // Affiche un message d'erreur si la quantité saisie est inférieure à 1
    if (quantity < 1) alert("Vous devez ajouter au moins 1 article!");
    // Affiche un message d'erreur si la quantité saisie est supérieure à 100
    if (quantity > 100)
      alert("Vous ne pouvez pas ajouter plus de 100 articles!");
  }
}

// J'utilise l'événement "load" de la fenêtre pour déclencher une fonction lorsque la page est chargée.
// Il récupère les paramètres dans l'URL de la page en utilisant "window.location.search" et appelle une fonction "get_product"
// en lui passant ces paramètres en paramètre. J'utilise la fonction "if" pour permettre quoi qu'il arrive que les données soient
// exploitables et d'éviter donc de produire des erreurs.

// J'utilse la fonction "get_product" et j'utilise l'objet URLSearchParams pour récupérer l'ID du produit à partir des paramètres de l'URL,
// puis j'utilise une fonction "fetch" pour envoyer une requête HTTP à l'URL stockée dans la variable "url" avec l'ID du produit ajouté à la
// fin de l'URL, et attend la réponse. J'utilise la méthode "json" pour traiter le corps de la réponse en tant que données JSON.

// J'utilise ensuite des fonctions "set_value" et "set_list" pour mettre à jour les différents éléments de la page avec les données du
// produit récupérées. J'ajoute également un événement "click" au bouton "addToCart" pour lancer la fonction "add_to_cart" lorsque
// l'utilisateur clique dessus.

// J'utilise la fonction "add_to_cart" pout récupèrer la valeur sélectionnée dans la liste déroulante des couleurs et la quantité spécifiée
// par l'utilisateur, et j'utilise l'objet "localStorage" pour enregistrer ces informations en utilisant l'ID du produit comme clé.
// Il vérifie également si l'utilisateur a sélectionné une couleur et une quantité valide, et affiche une alerte s'il y a des erreurs.

// En gros, mon code permet de récupérer les données d'un produit spécifique à partir d'un serveur à l'aide d'une requête HTTP, de mettre à
// jour la page avec ces données et de permettre à l'utilisateur d'ajouter des produits à un panier en stockant les informations sélectionnées
// dans le stockage local du navigateur.
