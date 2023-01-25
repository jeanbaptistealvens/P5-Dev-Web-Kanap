// Déclaration de l'URL de l'API
const url = 'http://localhost:3000/api/products/';

// Ecoute de l'événement de chargement de la fenêtre
window.addEventListener('load', function () {
    // Récupère l'élément HTML pour afficher les produits
    const items = document.getElementById('items');
    // Si l'élément existe
    if (items) {
        // Appel de la fonction pour récupérer les produits
        get_products(items);
    }
});

// Fonction pour récupérer les produits à partir de l'API
async function get_products(items) {
    // Récupère les données des produits à partir de l'API
    const response = await fetch(url);

    // Si la réponse est valide
    if (response.ok) { 
        // Transforme la réponse en un objet JavaScript
        let products = await response.json();
        // Initialise une variable pour stocker le code HTML des produits
        let html = '';

        // Pour chaque produit
        products.forEach(product => {
            // Génère le code HTML 
            let exerpt = `<a href="./product.html?id=${product._id}">
                                <article>
                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                                <h3 class="productName">${product.name}</h3>
                                <p class="productDescription">${product.description}.</p>
                                </article>
                            </a>`;

            // Ajoute le code HTML à la variable (concaténer)
            html += exerpt;
        });

        // Affiche les produits sur la page HTML
        items.innerHTML = html;
    } else {
        // Affiche un message d'erreur
        alert("HTTP-Error: " + response.status);
    }
}


// J'utilise l'événement "load" de la fenêtre pour déclencher une fonction lorsque la page est chargée. 
// Cette fonction recherche un élément HTML avec l'identifiant "items" et appelle une fonction "get_products" 
// en lui passant cet élément en paramètre. J'utilise la fonction "if" pour permettre quoi qu'il arrive que les données 
// soient exploitables et d'éviter donc de produire des erreurs.

// J'utilise la fonction "get_products" qui utilise une fonction "fetch" pour envoyer une requête HTTP à l'URL stockée dans la variable 
// "url" et attend la réponse. Si la réponse HTTP est réussie (code de statut entre 200 et 299), elle utilise la méthode "json" pour 
// traiter le corps de la réponse en tant que données JSON. 

// Ensuite, J'utilise une boucle "forEach" pour parcourir les produits et construit un code HTML pour chaque produit. 
// Je concatène ensuite ce code HTML pour chaque produit pour créer une chaîne de caractères qui contient tous les produits. 
// Enfin, j'utilise la propriété "innerHTML" de l'élément passé en paramètre pour insérer ce code HTML dans la page. 

// Si la réponse HTTP n'est pas réussie, la fonction affiche une alerte indiquant le code d'erreur HTTP reçu. 

// En gros, mon code permet d'afficher une liste de produits en récupérant les données d'un serveur à l'aide d'une requête HTTP et en 
// utilisant ces données pour construire un code HTML qui est ensuite inséré dans la page. 