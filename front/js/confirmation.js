window.addEventListener('load', function () {
    const param = window.location.search;
    if (param) {
        print_order(param);
    }
})

function print_order(param) {
    orderId = new URLSearchParams(param).get('orderId');
    document.getElementById('orderId').innerHTML = orderId;
}