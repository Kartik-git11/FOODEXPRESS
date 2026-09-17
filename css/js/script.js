let cart = JSON.parse(localStorage.getItem("cart")) || [];


function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart!");
}


function showCart() {

    let box = document.getElementById("cartItems");

    if (!box) return;

    if (cart.length === 0) {
        box.innerHTML = "<p>Your cart is empty 🛒</p>";
        document.getElementById("total").innerText = "0";
        return;
    }

    let total = 0;

    box.innerHTML = "";

    cart.forEach(item => {

        box.innerHTML += `
            <p>${item.name} - ₹${item.price}</p>
        `;

        total += item.price;
    });

    document.getElementById("total").innerText = total;
}


function placeOrder() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    window.location.href = "order.html";
}


showCart();