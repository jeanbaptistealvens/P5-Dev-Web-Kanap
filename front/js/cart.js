// Déclaration de l'URL de l'API
const url = 'http://localhost:3000/api/products/';
 // Déclare un tableau vide pour stocker les produits 
var products = [];

// Ajoute un écouteur d'événement pour l'événement "load"(chargement) de la fenêtre
window.addEventListener('load', function () {
    // Récupère l'élément HTML avec l'id pour la section "cart__items"
    const cart = document.getElementById('cart__items');
    // Si l'élément existe
    if (cart) {
        // Appelle les fonctions pour remplir et surveiller le panier
        fill().then(watch);
    }
});

// Fonction pour remplir le panier avec les produits enregistrés dans le stockage local
async function fill() {
    //Initialise de la quantité totale à 0
    var totalQuantity = 0;
    // Initialise du prix total à 0
    var totalPrice = 0;
    // Initialise la variable html à une chaîne vide
    var html = '';
   // Initialise de la quantité à 0
    var quantity = 0;

    // Récupére toutes les clés dans le localStorage
    let keys = Object.keys(localStorage);
    // Boucle sur chaque clé
    for (let key of keys) {
        // Récupère les informations du produit à partir de la clé
        var product = await get_product(key);
        // Ajoute le produit au tableau "products"
        products[key] = product;
        // Récupère les couleurs du produit enregistrées dans le stockage local
        const colors = Object.getOwnPropertyNames(JSON.parse(localStorage.getItem(key)));
        // Boucle sur chaque couleur
        for (let color of colors) {
            // Récupère la quantité enregistrée pour cette couleur et la convertit en entier
            quantity = parseInt(JSON.parse(localStorage.getItem(key))[color]);
            // Construit la structure HTML pour chaque produit avec les données récupérées
            html += `
            <article class="cart__item" data-id="${product._id}" data-color="${color}">
            <div class="cart__item__img">
                <img src="${product.imageUrl}" alt="${product.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${color}</p>
                <p>${product.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
                </div>
            </div>
        </article>`;

         // Incrémente la quantité et du prix total
        totalQuantity += quantity;
        // Incrémenter le prix total en multipliant la quantité par le prix du produit
        totalPrice += quantity * product.price;
    }
}
// Ajoute le HTML au panier 
document.getElementById('cart__items').insertAdjacentHTML('afterbegin', html);
// Met à jour de la quantité totale affichée
document.getElementById('totalQuantity').innerHTML = totalQuantity;
 // Met à jour du prix total affiché
document.getElementById('totalPrice').innerHTML = totalPrice
}

// Fonction pour ajouter des écouteurs d'événements aux éléments du panier
async function watch() {
// Récupère tous les éléments HTML de classe "cart__item"
var items = document.getElementsByClassName('cart__item');

// Vérifie s'il y a des éléments
if (items) {
    // Boucle sur chaque élément
    for (let item of items) {
        // Ajoute un écouteur d'événement pour l'événement "change" sur la quantité
        item.getElementsByClassName('itemQuantity')[0].addEventListener('change', async () => {
            // Appelle la fonction pour mettre à jour la quantité
            await update_quantity(item.closest('[data-id]'));
        });
        // Ajoute un écouteur d'événement pour le clic sur le bouton "Supprimer"
        item.getElementsByClassName('deleteItem')[0].addEventListener('click', () => {
            // Appelle la fonction pour supprimer l'élément
            remove(item.closest('[data-id]'));
        });
    }
        // Ajoute un écouteur d'événement "click" à l'élément HTML ayant l'id "order"
        // lorsque l'événement "click" est détecté
        document.getElementById('order').addEventListener('click', (event) => {
            // Désactive l'action d'envoyer par défaut de l'élément HTML lorsque l'événement est déclenché
            event.preventDefault();
            submit();
        });
    }
}

//  Fonction pour mettre à jour la quantité d'un produit spécifique dans le panier en récupérant l'identifiant, 
// la couleur et la quantité à partir des données de l'élément ciblé.
async function update_quantity(target) {
    // Récupère l'id et la couleur du produit à partir des attributs de données de l'élément
    const id = target.dataset.id;
    const color = target.dataset.color;
    // Récupère la quantité du produit enregistrée dans le stockage local
    const quantity = parseInt(target.getElementsByClassName('itemQuantity')[0].value);

// Récupère les informations enregistrées pour ce produit dans le stockage local
var record = JSON.parse(localStorage.getItem(id));
// Met à jour la quantité pour la couleur spécifiée
record[color] = quantity;
// Enregistre les informations mises à jour dans le stockage local
if (quantity>0 && quantity<101){
    localStorage.setItem(id, JSON.stringify(record));
    location.reload() 
} 
else {
    // Affiche un message d'erreur si la quantité saisie est inférieure à 1
    if (quantity < 1) alert('Vous devez ajouter au moins 1 article!');
    location.reload()
    // Affiche un message d'erreur si la quantité saisie est supérieure à 100
    if (quantity > 100) alert('Vous ne pouvez pas ajouter plus de 100 articles!');
    location.reload()
}

// Appelle la fonction pour mettre à jour le prix total
await update_price();
}

// Fonction pour mettre à jour la quantité d'un produit spécifique dans le panier en récupérant l'identifiant, 
// la couleur et la quantité à partir des données de l'élément ciblé.
async function remove(target) {
    const id = target.dataset.id;
    const color = target.dataset.color;

// Récupère les informations enregistrées pour ce produit dans le stockage local
var obj = JSON.parse(localStorage.getItem(id));
// Supprime la couleur spécifiée de l'objet
delete obj[color];

// S'il reste des couleurs pour ce produit dans le stockage local
if (Object.keys(obj).length === 0) {
    // Supprime de l'objet entier s'il ne contient plus de couleurs
    localStorage.removeItem(id);
}
else {
    // Enregistre les informations mises à jour dans le stockage local
    localStorage.setItem(id, JSON.stringify(obj));
}

// Supprime l'élément HTML du panier
target.remove();
// Appelle la fonction pour mettre à jour le prix total
await update_price();
}

// Fonction pour mettre à jour le prix total du panier
// Ignorer les quantités inférieures à 0 ou supérieures à 100 lors du calcul du total
// afin de s'assurer que la quantité ne s'incrémente pas si elle est inférieure à 0 ou supérieure à 100
async function update_price() {
    var articles = 0;
    var total = 0;

    const ids = Object.keys(localStorage);

    for (let id of ids) {
        var targets = document.querySelectorAll(`[data-id="${id}"]`);
        for (let target of targets) {
            const quantity = parseInt(target.getElementsByClassName('itemQuantity')[0].value);
            
            var product = await get_product(id);
            
            const amount = parseInt(product.price) * quantity;
            articles += quantity;
            total += amount;
        }
    }
    document.getElementById('totalQuantity').innerHTML = articles;
    document.getElementById('totalPrice').innerHTML = total;
}  

// Fonction pour récupèrer les informations du produit à partir de l'API 
// en utilisant l'identifiant du produit en paramètre
async function get_product(id) {
    // Envoie une requête pour récupérer les informations du produit
    const response = await fetch(url + id);
    // Retourne les informations sous forme de JSON
    return await response.json();
}

// Fonction pour mettre à jour le prix total du panier
async function submit() {
// Vide les messages d'erreur pour les champs "firstName", "lastName", "address", "city" et "email"
    get_data('firstNameErrorMsg').innerHTML = '';
    get_data('lastNameErrorMsg').innerHTML = '';
    get_data('lastNameErrorMsg').innerHTML = '';
    get_data('addressErrorMsg').innerHTML = '';
    get_data('cityErrorMsg').innerHTML = '';
    get_data('emailErrorMsg').innerHTML = '';
    
    // Valide les données du client
    validate_customer_data();
    
    // Récupère le formulaire
    var form = document.getElementsByClassName('cart__order__form')[0];

     // Si le formulaire est valide
    if (form.checkValidity()) {
        // Crée un objet "contact" pour stocker les données du formulaire
        contact = {};
        for (let element of form.elements) {
            if (element.type !== "submit") {
                contact[element.name] = element.value;
            }
        }
        // Récupère les produits du panier
        const products = Object.keys(localStorage);
        // Crée un objet "data" pour stocker les produits et les données de contact
        data = { products, contact };
        // Envoie les données et récupère la réponse
        response = await send(data);
        // Redirige vers la page de confirmation avec l'identifiant de commande
        window.location.href = '/front/html/confirmation.html?orderId=' + response.orderId;;
    }
}

function validate_customer_data() {
    // Déclare les expressions régulières pour valider les données
    const nameRegex = /^[A-Za-zàâäèéêîïôöùûüÿçÀÂÄÈÉÊËÎÏÔÖÙÛÜŸÇ -]+$/;
    const addressRegex = /^[\wàâäèéêëîïôöùûüçÀÂÄÈÉÊËÎÏÔÖÙÛÜÇ' -]{10,}$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    // Récupère les valeurs des champs et les messages d'erreur
    const firstName = get_data('firstName').value;
    const firstNameError = get_data('firstNameErrorMsg');
    const lastName = get_data('lastName').value;
    const lastNameError = get_data('lastNameErrorMsg');
    const address = get_data('address').value;
    const addressError = get_data('addressErrorMsg');
    const city = get_data('city').value;
    const cityError = get_data('cityErrorMsg');
    const email = get_data('email').value;
    const emailError = get_data('emailErrorMsg');

    // Ajouter l'attribut "required" aux champs de formulaire
    firstName.required = true;
    lastName.required = true;
    address.required = true;
    city.required = true;
    email.required = true;

    // Valide les données saisies
    if (!nameRegex.test(firstName)) {
        firstNameError.innerHTML = 'Le prénom est invalide.';
    } else {
        firstNameError.innerHTML = '';
    }
    if (!nameRegex.test(lastName)) {
        lastNameError.innerHTML = 'Le nom est invalide.';
    } else {
        lastNameError.innerHTML = '';
    }
    if (!addressRegex.test(address)) {
        addressError.innerHTML = 'L’adresse est invalide. Elle doit contenir au moins 10 caractères';
    } else {
        addressError.innerHTML = '';
    }
    if (!nameRegex.test(city)) {
        cityError.innerHTML = 'La ville est invalide.';
    } else {
        cityError.innerHTML = '';
    }
    if (!emailRegex.test(email)) {
        emailError.innerHTML = 'L’addresse mail est invalide.';
    } else {
        emailError.innerHTML = '';
    }
}

// Cela ajoute un écouteur d'événements "input" pour chaque champ de saisie, qui déclenchera 
// la fonction "validate_customer_data" chaque fois que l'utilisateur entre des données dans le champ. 
const firstName = get_data('firstName');
firstName.addEventListener('input', validate_customer_data);
const lastName = get_data('lastName');
lastName.addEventListener('input', validate_customer_data);
const address = get_data('address');
address.addEventListener('input', validate_customer_data);
const city = get_data('city');
city.addEventListener('input', validate_customer_data);
const email = get_data('email');
email.addEventListener('input', validate_customer_data);

// Fonction pour récupérer l'élément HTML à partir de son identifiant (id)
function get_data(id) {
    return document.getElementById(id);
}

// Envoie une requête HTTP POST pour envoyer les données de commande 
// à l'URL spécifiée en utilisant la méthode fetch 
async function send(data) {
    const response = await fetch(url + 'order', {
        // La méthode utilisée pour envoyer les données est POST
        method: 'POST',
        // Le mode CORS,
        mode: 'cors', 
        // la méthode de cache
        cache: 'no-cache',
        // les informations d'identification
        credentials: 'same-origin', 
        // les en-têtes
        headers: {
            'Content-Type': 'application/json'
        },
        // les informations de redirection
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify(data) 
        // sont configurés pour que les données soient envoyées 
        // de manière sécurisée.
    });

    // Retourne la réponse en format JSON.
    return await response.json();
}

