let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

let menus = {
    biryani: {
        name: "🍗 Biryani House",
        items: [
            ["🍗", "Chicken Biryani", 220],
            ["🍖", "Mutton Biryani", 280],
            ["🥘", "Paneer Biryani", 180],
            ["🍚", "Veg Biryani", 150]
        ]
    },

    pizza: {
        name: "🍕 Pizza Corner",
        items: [
            ["🍕", "Margherita Pizza", 180],
            ["🍕", "Farmhouse Pizza", 220],
            ["🍕", "Paneer Pizza", 230],
            ["🍕", "Chicken Pizza", 250]
        ]
    },

    burger: {
        name: "🍔 Burger Point",
        items: [
            ["🍔", "Chicken Burger", 150],
            ["🍔", "Cheese Burger", 170],
            ["🥬", "Veg Burger", 120],
            ["🍔", "Double Chicken Burger", 220]
        ]
    }
};


let type = new URLSearchParams(location.search).get("restaurant");

if (type && menus[type]) {

    document.getElementById("restaurantName").innerText =
        menus[type].name;

    let menu = document.getElementById("menu");

    menus[type].items.forEach(item => {

        menu.innerHTML += `
            <div class="card">
                <div class="food-img">${item[0]}</div>
                <h2>${item[1]}</h2>
                <h3>₹${item[2]}</h3>

                <button onclick="addToCart('${item[1]}',${item[2]})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}


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

    if (cart.length == 0) {
        box.innerHTML = "<p>Your cart is empty 🛒</p>";
        document.getElementById("total").innerText = "0";
        return;
    }

    let total = 0;
    box.innerHTML = "";

    cart.forEach((item, index) => {

        box.innerHTML += `
            <div class="cart-item">
                <span>${item.name} - ₹${item.price}</span>
                <button onclick="removeItem(${index})">
                    Remove
                </button>
            </div>
        `;

        total += item.price;
    });

    document.getElementById("total").innerText = total;
}


function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    showCart();
}


function placeOrder() {

    if (cart.length == 0) {
        alert("Your cart is empty!");
        return;
    }

    let address = document.getElementById("address").value;
    let time = document.getElementById("deliveryTime").value;

    if (address == "") {
        alert("Enter delivery address!");
        return;
    }

    let order = {
        id: "FE" + Math.floor(1000 + Math.random() * 9000),
        items: cart,
        address: address,
        deliveryTime: time,
        status: "Order Placed"
    };

    orders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");

    cart = [];

    window.location.href = "order.html";
}


function showOrder() {

    let number = document.getElementById("orderNumber");

    if (!number || orders.length == 0) return;

    let order = orders[orders.length - 1];

    number.innerText = "Order #" + order.id;

    document.getElementById("orderAddress").innerText =
        order.address;

    document.getElementById("orderTime").innerText =
        order.deliveryTime;

    document.getElementById("currentStatus").innerText =
        order.status;

    let status = [
        "Order Placed",
        "Restaurant Accepted",
        "Preparing Food",
        "Ready for Pickup",
        "Out for Delivery",
        "Delivered"
    ];

    let current = status.indexOf(order.status);

    status.forEach((s, i) => {

        let box = document.getElementById("status" + (i + 1));

        if (box) {
            box.classList.toggle("completed", i <= current);
        }
    });
}


function showRestaurantOrders() {

    let box = document.getElementById("restaurantOrders");

    if (!box) return;

    box.innerHTML = "";

    if (orders.length == 0) {
        box.innerHTML = "<p>No incoming orders.</p>";
        return;
    }

    orders.forEach((order, index) => {

        box.innerHTML += `
            <div class="order-card">

                <h3>Order #${order.id}</h3>

                <p>Address: ${order.address}</p>

                <p>Delivery: ${order.deliveryTime}</p>

                <p>Status: <b>${order.status}</b></p>

                <button onclick="updateStatus(${index}, 'Restaurant Accepted')">
                    Accept
                </button>

                <button onclick="updateStatus(${index}, 'Preparing Food')">
                    Preparing
                </button>

                <button onclick="updateStatus(${index}, 'Ready for Pickup')">
                    Ready
                </button>

            </div>
        `;
    });
}


function showDeliveryOrders() {

    let box = document.getElementById("deliveryOrders");

    if (!box) return;

    box.innerHTML = "";

    if (orders.length == 0) {
        box.innerHTML = "<p>No deliveries available.</p>";
        return;
    }

    orders.forEach((order, index) => {

        box.innerHTML += `
            <div class="order-card">

                <h3>Order #${order.id}</h3>

                <p>Address: ${order.address}</p>

                <p>Status: <b>${order.status}</b></p>

                <button onclick="updateStatus(${index}, 'Out for Delivery')">
                    Out for Delivery
                </button>

                <button onclick="updateStatus(${index}, 'Delivered')">
                    Delivered
                </button>

            </div>
        `;
    });
}


function updateStatus(index, status) {

    orders[index].status = status;

    localStorage.setItem("orders", JSON.stringify(orders));

    showRestaurantOrders();
    showDeliveryOrders();
    showOrder();
}


function addFood() {

    let name = document.getElementById("newFood").value;
    let price = document.getElementById("newPrice").value;

    if (name == "" || price == "") {
        alert("Enter food name and price!");
        return;
    }

    menus.biryani.items.push([
        "🍽️",
        name,
        Number(price)
    ]);

    document.getElementById("newFood").value = "";
    document.getElementById("newPrice").value = "";

    showRestaurantMenu();
}


function showRestaurantMenu() {

    let box = document.getElementById("restaurantMenu");

    if (!box) return;

    box.innerHTML = "";

    menus.biryani.items.forEach((item, index) => {

        box.innerHTML += `
            <div class="menu-admin">

                <span>
                    ${item[0]} ${item[1]} - ₹${item[2]}
                </span>

                <button onclick="removeFood(${index})">
                    Remove
                </button>

            </div>
        `;
    });
}


function removeFood(index) {

    menus.biryani.items.splice(index, 1);

    showRestaurantMenu();
}


showCart();
showOrder();
showRestaurantOrders();
showDeliveryOrders();
showRestaurantMenu();