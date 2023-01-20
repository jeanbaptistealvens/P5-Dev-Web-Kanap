const url = 'http://localhost:3000/api/products/';
var products = [];

window.addEventListener('load', function () {
    const cart = document.getElementById('cart__items');
    if (cart) {
        fill().then(watch);
    }
});

async function fill() {
    var totalQuantity = 0;
    var totalPrice = 0;
    var html = '';
    var quantity = 0;

    let keys = Object.keys(localStorage);
    for (let key of keys) {
        var product = await get_product(key);
        products[key] = product;
        const colors = Object.getOwnPropertyNames(JSON.parse(localStorage.getItem(key)));
        for (let color of colors) {
            quantity = parseInt(JSON.parse(localStorage.getItem(key))[color]);
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

            totalQuantity += quantity;
            totalPrice += quantity * product.price;
        }
    }
    document.getElementById('cart__items').insertAdjacentHTML('afterbegin', html);
    document.getElementById('totalQuantity').innerHTML = totalQuantity;
    document.getElementById('totalPrice').innerHTML = totalPrice
}

async function watch() {
    var items = document.getElementsByClassName('cart__item');

    if (items) {
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

    get_data('firstNameErrorMsg').innerHTML = '';
    get_data('lastNameErrorMsg').innerHTML = '';
    get_data('lastNameErrorMsg').innerHTML = '';
    get_data('addressErrorMsg').innerHTML = '';
    get_data('cityErrorMsg').innerHTML = '';
    get_data('emailErrorMsg').innerHTML = '';

    validate_customer_data();

    var form = document.getElementsByClassName('cart__order__form')[0];

    if (form.checkValidity()) {
        contact = {};
        for (let element of form.elements) {
            if (element.type !== "submit") {
                contact[element.name] = element.value;
            }
        }
        const products = Object.keys(localStorage);
        data = { products, contact };
        response = await send(data);

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