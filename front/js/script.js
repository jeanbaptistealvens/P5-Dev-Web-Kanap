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