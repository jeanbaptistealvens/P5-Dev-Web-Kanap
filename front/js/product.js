// déclare une constante nommée "url" qui contient l'URL de l'API pour les produits.
const url = 'http://localhost:3000/api/products/';
// déclare une variable globale nommée "product"
let product = '';

// utilise l'événement "load" de la fenêtre pour déclencher une fonction lorsque la page est chargée
window.addEventListener('load', function () {
    // récupère les paramètres dans l'URL de la page
    const param = window.location.search;
    // vérifie si les paramètres de recherche existent, si oui, excute les instructions suivantes 
    if (param) {
        // appelle la fonction "get_product" en lui passant les paramètres de recherche
        get_product(param);

        // ajout un écouteur d'événement sur le bouton "Ajouter au panier"
        document.getElementById('addToCart').addEventListener('click', (event) => {
             // appel de la fonction pour ajouter un produit au panier
            add_to_cart(product);
        });
    }
});

// cherche de façon asynchrone les informations du produit correspondant à l'id donné dans les paramètres 
// de recherche et  met à jour les informations sur la page.
async function get_product(param) {
    // crée un nouvel objet qui va permettre d'extraire l'id dans les paramètres de recherche
    id = new URLSearchParams(param).get('id');
    // envoie une requête asynchrone pour aller chercher les informations du produit correspondant à l'id 
    // à l'URL de l'API.
    const response = await fetch(url + id);
    // attend la réponse de la requête précédente puis la parse en json et la stock dans la variable product
    product = await response.json();
    //récupére l'élément HTML pour afficher l'image du produit
    const img = document.getElementsByClassName('item__img')[0];
    //affichage de l'image dans l'élément HTML
    img.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
    //appel des fonctions pour afficher les données du produit
    set_value('title', product.name);
    set_value('price', product.price);
    set_value('description', product.description);
    set_list('colors', product.colors);
}

// déclare une fonction nommée "set_value" qui prend en paramètres "target" et "value"
function set_value(target, value) {
    // récupére l'élément HTML avec l'ID spécifié par "target" et met à jour son 
    // contenu avec la valeur spécifiée par "value"
    document.getElementById(target).innerHTML = value;
}
// déclare une fonction nommée "set_list" qui prend en paramètres "target" et "options"
function set_list(target, options) {
    // récupère l'élément HTML avec l'ID spécifié par "target"
    var select = document.getElementById(target);

    //démarre une boucle qui itère sur tous les éléments dans le tableau d'options, pour 
    //ajouter chaque option à la liste déroulante
    for (var i = 0; i < options.length; i++) {
        // crée un nouvel élément "option" pour la liste déroulante
        var option = document.createElement("option");
        // itére à l'élément correspondant dans le tableau d'options.
        option.value = options[i];
        option.text = options[i];
        // ajoute l'option créée à l'élément "select" (la liste déroulante)
        select.appendChild(option);
    }
}

// ajouter un produit au panier
function add_to_cart(product) {
    // récupère la valeur de l'élément HTML avec l'ID "colors" (la liste déroulante de couleurs)
    const color = document.getElementById('colors').value;
    // vérifie si une couleur a été sélectionnée par l'utilisateur
    if (color) {
        // récupère la valeur de l'élément HTML avec l'ID "quantity" (champ de saisie de quantité) 
        var quantity = parseInt(document.getElementById('quantity').value);
        // vérifie si une quantité a été spécifiée par l'utilisateur
        if (quantity) {

             // Récupére l'ID du produit
            const key = product._id;

            // Récupére l'enregistrement du produit dans le localStorage (si existant)
            var record = JSON.parse(localStorage.getItem(key));

             // Vérifie si la couleur sélectionnée est déjà enregistrée pour ce produit dans le localStorage
            if (record && record[color]) {
                // Si oui, ajout de la quantité saisie à la quantité existante
                var total = (parseInt(record[color]) || 0) + quantity;

                // Met à jour de la quantité pour cette couleur dans l'enregistrement
                record[color] = total;
            }
            // Vérifie si l'enregistrement existe mais ne contient pas encore de quantité pour cette couleur
            else if (record && !record[color]) {
                // Si oui, ajout de la quantité saisie pour cette couleur
                record[color] = quantity;
            }
            // Si l'enregistrement n'existe pas encore pour ce produit
            else {
                // Crée un nouvel enregistrement pour ce produit
                record = {};
                record[color] = quantity;
            }
            // Enregistre des données dans le localStorage
            localStorage.setItem(key, JSON.stringify(record));
            // Affiche un message de confirmation
            alert(`Added inside ${key}: ` + localStorage.getItem(key));
        }
    }
    // vérifie si une couleur n'a pas été sélectionnée par l'utilisateur, si c'est le cas,
    else {
        // affiche un message d'alerte indiquant à l'utilisateur qu'il doit sélectionner une couleur
        alert('You must choose a color!');
    }
    // vérifie si la quantité saisie par l'utilisateur est inférieure à 1, 1, si c'est le cas
    if (document.getElementById('quantity').value < 1) {
        // affiche un message d'alerte indiquant à l'utilisateur qu'il doit ajouter au moins un article
        alert('You must add at least one item!');
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
// par l'utilisateur, et j'utilise l'objet "localStorage" pour enregistrer ces informations en utilisant l'ID du produit comme clé. Il 
// vérifie également si l'utilisateur a sélectionné une couleur et une quantité valide, et affiche une alerte s'il y a des erreurs.

// En gros, mon code permet de récupérer les données d'un produit spécifique à partir d'un serveur à l'aide d'une requête HTTP, de mettre à 
// jour la page avec ces données et de permettre à l'utilisateur d'ajouter des produits à un panier en stockant les informations sélectionnées 
// dans le stockage local du navigateur.