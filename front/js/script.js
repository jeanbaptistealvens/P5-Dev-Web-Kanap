const url = 'http://localhost:3000/api/products/';

window.addEventListener('load', function () {
    const items = document.getElementById('items');
    if (items) {
        get_products(items);
    }
})

async function get_products(items) {
    const response = await fetch(url);

    if (response.ok) { // if HTTP-status is 200-299

        // get the response body (the method explained below)
        let products = await response.json();
        let html = '';

        // iterate result and build html code
        products.forEach(product => {
            let exerpt = `<a href="./product.html?id=${product._id}">
                                <article>
                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                                <h3 class="productName">${product.name}</h3>
                                <p class="productDescription">${product.description}.</p>
                                </article>
                            </a>`;

            // concatenate html
            html += exerpt;
        });

        // insert
        items.innerHTML = html;
    } else {
        alert("HTTP-Error: " + response.status);
    }
}