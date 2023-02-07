// Ecoute de l'événement de chargement de la fenêtre
window.addEventListener('load', function () {
    // Récupère les paramètres de la requête de l'URL
    const param = window.location.search;
    // Si des paramètres sont présents
    if (param) {
        // Appel de la fonction pour afficher l'ID de commande et 
        print_order(param);
        // Appel de la fonction pour réinitialiser le locastorage
        resetLocalStorage();
    }
});

//Fonction pour être sûr que les paramètres de l'URL sont disponibles pour récupérer 
// et l'utiliser avant de les afficher sur la page
function print_order(param) {
    // Récupère l'ID de commande à partir des paramètres de la requête
    const orderId = new URLSearchParams(param).get('orderId');
    // Récupère l'élément HTML qui contient l'ID de commande
    const orderIdElement = document.getElementById("orderId");
    // Modifie le contenu de l'élément pour afficher l'ID de commande
    orderIdElement.innerHTML = orderId;
    // Crée un nouvel élément HTML pour le message de remerciement
    const thankYouMessage = document.createElement("p");
    thankYouMessage.innerHTML = "Merci pour votre achat !";
    // Ajoute le message de remerciement en dessous de l'ID de commande
    orderIdElement.parentNode.appendChild(thankYouMessage);
}
//Fonction pour réinitialiser le localstorage
function resetLocalStorage() {
    localStorage.clear();
}