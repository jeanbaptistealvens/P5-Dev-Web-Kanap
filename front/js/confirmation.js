// Ecoute de l'événement de chargement de la fenêtre
window.addEventListener('load', function () {
    // Récupère les paramètres de la requête de l'URL
    const param = window.location.search;
    // Si des paramètres sont présents
    if (param) {
        // Appel de la fonction pour afficher l'ID de commande
        print_order(param);
    }
});

// Fonction pour afficher l'ID de commande
function print_order(param) {
    // Récupère l'ID de commande à partir des paramètres de la requête
    orderId = new URLSearchParams(param).get('orderId');
    // Affiche l'ID de commande sur la page HTML
    document.getElementById('orderId').innerHTML = orderId;
}


// J'utilise l'événement "load" de la fenêtre pour déclencher une fonction lorsque la page est chargée. 
// Il récupère les paramètres dans l'URL de la page en utilisant "window.location.search" et appelle une 
// fonction "print_order" en lui passant ces paramètres en paramètre.Je peux ainisi être sûr que les paramètres 
// de l'URL sont disponibles pour récupérer et l'utiliser avant de les afficher sur la page.J'utilise la fonction "if" 
// pour permettre quoi qu'il arrive que les données soient exploitables et d'éviter donc de produire des erreurs.

// J'utilise la fonction "print_order" qui utilise l'objet URLSearchParams pour récupérer l'ID de la commande 
// à partir des paramètres de l'URL, puis j'utilise la propriété "innerHTML" pour insérer cette ID dans un élément HTML 
// avec l'identifiant "orderId".

// En gros, ce code permet d'afficher l'ID de la commande sur la page en récupérant cet ID à partir de l'URL de la page.