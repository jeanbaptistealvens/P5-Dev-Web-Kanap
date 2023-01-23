// Déclare une variable "url" qui contient l'URL d'une API pour récupérer des informations sur les produits
const url = 'http://localhost:3000/api/products/';
// Stocke les produits dans un tableau vide 
var products = [];
// Ajoute un écouteur d'événement pour l'événement "load" de la fenêtre
window.addEventListener('load', function () {
    // Récupère l'élément HTML avec l'id "cart__items"
    const cart = document.getElementById('cart__items');
    // Si l'élément existe
    if (cart) {
        // Exécute la fonction "fill" pour remplir le panier, puis 
        // exécute la fonction "watch" pour surveiller les événements sur les éléments du panier
        fill().then(watch);
    }
});
// Rempli le panier d'achat en initialisant des variable pour
async function fill() {
    // Stocke la quantité totale, le prix total, le code HTML et la quantité d'un produit 
    // spécifique dans des variables
    var totalQuantity = 0;
    var totalPrice = 0;
    var html = '';
    var quantity = 0;
    // Récupére toutes les clés stockées dans le localStorage 
    let keys = Object.keys(localStorage);
    // Itère sur toutes les clés récupérées
    for (let key of keys) {
        // Récupère le produit correspondant à la clé courante
        var product = await get_product(key);
        // Stocke le produit dans le tableau products
        products[key] = product;
        // Récupère les propriétés de l'objet JSON (couleurs) stocké dans localStorage pour cette clé
        const colors = Object.getOwnPropertyNames(JSON.parse(localStorage.getItem(key)));
         // Boucle sur toutes les couleurs
        for (let color of colors) {
            // Récupère la quantité stockée pour cette couleur
            quantity = parseInt(JSON.parse(localStorage.getItem(key))[color]);
            // Ajoute le code HTML pour afficher les informations sur le produit dans le panier
            html += `
            <article class="cart__item" data-id="${product._id}" data-color="${color}">
                <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${color}</p>
                    <p>${product.price} €</p>
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
            // Incrémente les totaux de quantité et de prix
            totalQuantity += quantity;
            totalPrice += quantity * product.price;
        }
    }
    // Insère le HTML généré dans le panier
    document.getElementById('cart__items').insertAdjacentHTML('afterbegin', html);
    // Met à jour les totaux affichés
    document.getElementById('totalQuantity').innerHTML = totalQuantity;
    document.getElementById('totalPrice').innerHTML = totalPrice
}

async function watch() {
    var items = document.getElementsByClassName('cart__item');
    
    if (items) {
        // Boucle sur tous les éléments
        for (let item of items) {
            item.getElementsByClassName('itemQuantity')[0].addEventListener('change', async () => {
                await update_quantity(item.closest('[data-id]'));
            });
            item.getElementsByClassName('deleteItem')[0].addEventListener('click', () => {
                remove(item.closest('[data-id]'));
            });
        }
        document.getElementById('order').addEventListener('click', (event) => {
            event.preventDefault();
            submit();
        });
    }
}

async function update_quantity(target) {
    const id = target.dataset.id;
    const color = target.dataset.color;
    const quantity = parseInt(target.getElementsByClassName('itemQuantity')[0].value);

    var record = JSON.parse(localStorage.getItem(id));
    record[color] = quantity;
    localStorage.setItem(id, JSON.stringify(record));

    await update_price();
}

async function remove(target) {
    const id = target.dataset.id;
    const color = target.dataset.color;

    var obj = JSON.parse(localStorage.getItem(id));
    delete obj[color];

    if (Object.keys(obj).length === 0) {
        localStorage.removeItem(id);
    }
    else {
        localStorage.setItem(id, JSON.stringify(obj));
    }

    target.remove();
    await update_price();
}

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

async function get_product(id) {
    const response = await fetch(url + id);
    return await response.json();
}


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
    const name_regex = new RegExp('[A-Za-z \-]+');

    const firstName = get_data('firstName').value;
    if (!name_regex.test(firstName)) {
        get_data('firstNameErrorMsg').innerHTML = 'Le prénom est invalide.';
    }

    const lastName = get_data('lastName').value;
    if (!name_regex.test(lastName)) {
        get_data('lastNameErrorMsg').innerHTML = 'Le nom est invalide.';
    }
    else if (get_data('lastNameErrorMsg').innerHTML) {
        get_data('lastNameErrorMsg').innerHTML = '';
    }

    const address_regex = new RegExp('[\w \-]+');
    const address = get_data('address').value;
    if (!address_regex.test(address)) {
        get_data('addressErrorMsg').innerHTML = 'L’adresse est invalide.';
    }

    const city = get_data('city').value;
    if (!name_regex.test(city)) {
        get_data('cityErrorMsg').innerHTML = 'La ville est invalide.';
    }

    const email_regex = new RegExp('[A-Za-z\.\-]+@[A-Za-z\.\-]{2,}\.[a-zA-Z]{2,}');
    const email = get_data('email').value;
    if (!email_regex.test(email)) {
        get_data('emailErrorMsg').innerHTML = 'L’addresse mail est invalide.';
    }
}

function get_data(id) {
    return document.getElementById(id);
}

async function send(data) {
    const response = await fetch(url + 'order', {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    return await response.json();
}

// J'utilise l'événement "load" de la fenêtre pour déclencher une fonction lorsque la page est chargée. Il recherche un 
// élément HTML avec l'identifiant "cart__items" et appelle les fonctions "fill" et "watch" si l'élément est présent. J'utilise 
// ensuite la fonction "if" pour permettre quoi qu'il arrive que les données  soient exploitables et d'éviter donc de produire des erreurs.

// J'utilise la fonction "fill" qui utilise l'objet "localStorage" pour récupérer les données des produits ajoutés au panier et 
// pour construire une chaîne HTML qui affiche ces produits. J'utilise des boucles pour parcourir les produits et les couleurs, et 
// j'utilise des fonctions "get_product" pour récupérer les données des produits. J'utilise également des variables pour calculer le 
// total de la quantité et le total des prix. J'utilise la fonction "parseInt" est pour convertir la valeur de la quantité d'un article 
// dans le panier stocké dans le localStorage en un nombre entier avant de l'utiliser pour calculer le total de la quantité et le total du 
// prix. Cela s'assure que les calculs mathématiques effectués sur ces valeurs sont corrects et précis. J'utilise ensuite la propriété 
// "innerHTML" pour insérer cette chaîne HTML dans la page et mettre à jour les éléments de totalisation.

// J'utilise la fonction "watch" et j'ajoute des événements "change" et "click" aux éléments de la page pour permettre à l'utilisateur 
// de mettre à jour la quantité et de supprimer des produits du panier. J'ajoute également un événement "click" au bouton de commande 
// pour lancer la fonction "submit" lorsque l'utilisateur clique dessus.

// J'utilise les fonctions "update_quantity", "remove" et "update_price"pour mettre à jour les informations de panier en utilisant l'objet 
// "localStorage" et pour mettre à jour les éléments de la page en conséquence.

// En gros, mon code permet d'afficher les produits ajoutés au panier, de permettre à l'utilisateur de mettre à jour les quantités et de 
// supprimer les produits, et de soumettre la commande.