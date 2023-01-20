const url = 'http://localhost:3000/api/products/';

let product = '';

window.addEventListener('load', function () {
    const param = window.location.search;
    if (param) {
        get_product(param);

        document.getElementById('addToCart').addEventListener('click', (event) => {
            add_to_cart(product);
        });
    }
});

async function get_product(param) {
    id = new URLSearchParams(param).get('id');
    const response = await fetch(url + id);
    product = await response.json();

    const img = document.getElementsByClassName('item__img')[0];

    img.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;

    set_value('title', product.name);
    set_value('price', product.price);
    set_value('description', product.description);
    set_list('colors', product.colors);
}

function set_value(target, value) {
    document.getElementById(target).innerHTML = value;
}

function set_list(target, options) {
    var select = document.getElementById(target);

    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.value = options[i];
        option.text = options[i];
        select.appendChild(option);
    }
}


function add_to_cart(product) {
    const color = document.getElementById('colors').value;
    if (color) {
        var quantity = parseInt(document.getElementById('quantity').value);
        if (quantity) {

            const key = product._id;

            var record = JSON.parse(localStorage.getItem(key));

            if (record && record[color]) {
                var total = (parseInt(record[color]) || 0) + quantity;

                record[color] = total;
            }
            else if (record && !record[color]) {
                record[color] = quantity;
            }
            else {
                record = {};
                record[color] = quantity;
            }
            localStorage.setItem(key, JSON.stringify(record));
            alert(`Added inside ${key}: ` + localStorage.getItem(key));
        }
    }
    else {
        alert('You must choose a color!');
    }
    if (document.getElementById('quantity').value < 1) {
        alert('You must add at least one item!');
    }
}