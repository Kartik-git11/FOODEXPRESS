// Food Express - Vanilla JS + localStorage (demo auth only, not secure for production)

const foods = [
  { id: 1, name: "Chicken Biryani", category: "Biryani", price: 249, rating: 4.5, desc: "Aromatic basmati rice with tender chicken & spices", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80" },
  { id: 2, name: "Veg Biryani", category: "Biryani", price: 199, rating: 4.3, desc: "Fragrant rice loaded with veggies and cashews", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80" },
  { id: 3, name: "Cheese Burst Pizza", category: "Pizza", price: 299, rating: 4.7, desc: "Extra cheese, mozzarella & cheesy crust delight", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80" },
  { id: 4, name: "Veg Burger", category: "Burger", price: 99, rating: 4.2, desc: "Crispy veg patty with fresh lettuce & mayo", image: "https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=600&auto=format&fit=crop&q=80" },
  { id: 5, name: "Chicken Burger", category: "Burger", price: 149, rating: 4.5, desc: "Juicy grilled chicken patty with cheese", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80" },
  { id: 6, name: "Masala Dosa", category: "South Indian", price: 120, rating: 4.4, desc: "Crispy dosa stuffed with spiced potato masala", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80" },
  { id: 7, name: "Paneer Tikka", category: "Snacks", price: 220, rating: 4.6, desc: "Grilled paneer cubes marinated in spices", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80" },
  { id: 8, name: "Veg Chowmein", category: "Chinese", price: 140, rating: 4.1, desc: "Stir-fried noodles with veggies & sauces", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80" },
  { id: 9, name: "Fried Rice", category: "Chinese", price: 160, rating: 4.3, desc: "Wok-tossed rice with veggies & manchurian", image: "https://images.unsplash.com/photo-1603133872875-ca2a98a0c7a3?w=600&auto=format&fit=crop&q=80" },
];
const categories = [
  { id: "All", label: "All", icon: "🍽️" },
  { id: "Pizza", label: "Pizza", icon: "🍕" },
  { id: "Burger", label: "Burger", icon: "🍔" },
  { id: "Biryani", label: "Biryani", icon: "🍚" },
];
let currentCategory = "All", currentSearch = "";

// ---- LocalStorage helpers ----
const ls = (k, v) => v === undefined ? JSON.parse(localStorage.getItem(k) || "null") : localStorage.setItem(k, JSON.stringify(v));
const getUsers = () => ls("users") || [];
const saveUsers = u => ls("users", u);
const getCurrentUser = () => ls("currentUser");
const saveCurrentUser = u => ls("currentUser", u);
const getCart = () => ls("cart") || [];
const saveCart = c => { ls("cart", c); updateCartCount(); };
const getOrders = () => ls("orders") || [];
const saveOrders = o => ls("orders", o);

// ---- Toast ----
function showToast(message, type = "info") {
  const c = document.getElementById("toastContainer");
  if (!c) return;
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ️"}</span><span>${message}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = "toastOut .3s ease forwards"; setTimeout(() => t.remove(), 300); }, 3000);
}

// ---- Header & auth UI ----
function updateHeader() {
  const user = getCurrentUser();
  const ids = { loginBtn: !user, registerBtn: !user, profileLink: !!user, ordersLink: !!user, logoutBtn: !!user };
  for (const [id, show] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? (id === "logoutBtn" ? "inline-flex" : id === "loginBtn" || id === "registerBtn" ? "inline-flex" : "inline") : "none";
  }
  updateCartCount();
}
function updateCartCount() {
  const qty = getCart().reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById("cartCount");
  if (el) { el.textContent = qty; el.style.display = qty > 0 ? "grid" : "none"; }
}
function logoutUser() {
  localStorage.removeItem("currentUser");
  showToast("Logged out successfully", "success");
  setTimeout(() => location.href = "index.html", 800);
}

// ---- Food rendering ----
function renderCategories() {
  const c = document.getElementById("categories");
  if (!c) return;
  c.innerHTML = categories.map(cat => `<button class="cat-btn ${currentCategory === cat.id ? "active" : ""}" data-cat="${cat.id}"><span>${cat.icon}</span> ${cat.label}</button>`).join("");
  c.querySelectorAll(".cat-btn").forEach(btn => btn.addEventListener("click", () => { currentCategory = btn.dataset.cat; renderCategories(); renderFoods(); }));
}
function renderFoods() {
  const c = document.getElementById("foodContainer");
  if (!c) return;
  let list = foods.filter(f => currentCategory === "All" || f.category === currentCategory);
  if (currentSearch.trim()) {
    const q = currentSearch.toLowerCase();
    list = list.filter(f => [f.name, f.category, f.desc].some(v => v.toLowerCase().includes(q)));
  }
  c.innerHTML = list.length ? list.map(f => `
    <div class="food-card">
      <div class="food-img">
        <img src="${f.image}" alt="${f.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'">
        <span class="food-badge">${f.category}</span>
        <span class="food-rating">⭐ ${f.rating}</span>
      </div>
      <div class="food-info">
        <h3>${f.name}</h3>
        <p class="food-desc">${f.desc}</p>
        <div class="food-foot">
          <div class="price">₹${f.price}</div>
          <button class="add-btn" onclick="addToCart(${f.id})">Add to Cart</button>
        </div>
      </div>
    </div>`).join("") : `<div class="no-result"><h3>😕 No food items found</h3><p>Try searching for Pizza, Burger, Biryani, Momos etc.</p></div>`;
}

// ---- Cart ----
function addToCart(foodId) {
  const food = foods.find(f => f.id === foodId);
  if (!food) return;
  const cart = getCart();
  const item = cart.find(i => i.id === foodId);
  item ? item.qty++ : cart.push({ id: food.id, name: food.name, price: food.price, image: food.image, qty: 1 });
  saveCart(cart);
  showToast(`${food.name} added to cart`, "success");
  if (document.getElementById("cartContainer")) renderCart();
}
function removeFromCart(foodId) {
  saveCart(getCart().filter(i => i.id !== foodId));
  showToast("Item removed from cart", "info");
  renderCart();
}
function updateQuantity(foodId, change) {
  let cart = getCart();
  const item = cart.find(i => i.id === foodId);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) { cart = cart.filter(i => i.id !== foodId); showToast("Item removed", "info"); }
  saveCart(cart);
  renderCart();
}
function clearCart() { saveCart([]); renderCart(); showToast("Cart cleared", "info"); }

function renderCart() {
  const container = document.getElementById("cartContainer");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const checkoutSection = document.getElementById("checkoutSection");
  if (!container) return;
  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `<div class="empty-cart"><div class="icon">🛒</div><h3>Your cart is empty</h3><p style="color:var(--gray); margin-bottom:16px;">Add some delicious food to get started</p><a href="index.html" class="btn btn-primary">Browse Menu</a></div>`;
    if (subtotalEl) subtotalEl.textContent = "₹0";
    if (totalEl) totalEl.textContent = "₹0";
    if (checkoutSection) checkoutSection.style.display = "none";
    return;
  }
  if (checkoutSection) checkoutSection.style.display = "block";

  container.innerHTML = cart.map(i => `
    <div class="cart-item">
      <img src="${i.image}" alt="${i.name}" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'">
      <div class="cart-item-info">
        <h4>${i.name}</h4>
        <p>₹${i.price} × ${i.qty} = ₹${i.price * i.qty}</p>
        <button class="remove-btn" onclick="removeFromCart(${i.id})">Remove</button>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="updateQuantity(${i.id}, -1)">−</button>
        <span class="qty">${i.qty}</span>
        <button class="qty-btn" onclick="updateQuantity(${i.id}, 1)">+</button>
      </div>
    </div>`).join("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = subtotal > 0 ? 40 : 0;
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  const deliveryEl = document.getElementById("deliveryFee");
  if (deliveryEl) deliveryEl.textContent = `₹${deliveryFee}`;
  if (totalEl) totalEl.textContent = `₹${subtotal + deliveryFee}`;
}

// ---- Checkout & orders ----
function placeOrder() {
  const user = getCurrentUser();
  if (!user) { showToast("Please login first to place order", "error"); setTimeout(() => location.href = "login.html", 1000); return; }

  const cart = getCart();
  if (!cart.length) { showToast("Your cart is empty", "error"); return; }

  const addressInput = document.getElementById("deliveryAddress");
  const phoneInput = document.getElementById("deliveryPhone");
  if (!addressInput?.value.trim()) { showToast("Please enter delivery address", "error"); return; }
  if (!phoneInput?.value.trim()) { showToast("Please enter phone number", "error"); return; }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + 40;
  const orderId = "FE" + Math.floor(10000 + Math.random() * 90000);

  const order = {
    id: orderId, userEmail: user.email, items: [...cart], subtotal, deliveryFee: 40, total,
    address: addressInput.value.trim(), phone: phoneInput.value.trim(),
    status: "Confirmed", date: new Date().toLocaleString(), estimatedDelivery: "30-45 minutes"
  };
  saveOrders([order, ...getOrders()]);
  saveCart([]);

  const modal = document.getElementById("orderSuccessModal");
  if (modal) {
    document.getElementById("successOrderId").textContent = orderId;
    document.getElementById("successOrderTotal").textContent = `₹${total}`;
    modal.classList.add("active");
  } else {
    showToast("Order placed successfully! 🎉", "success");
    setTimeout(() => location.href = "orders.html", 1200);
  }
}

function renderOrders() {
  const container = document.getElementById("ordersContainer");
  if (!container) return;
  const user = getCurrentUser();
  if (!user) {
    container.innerHTML = `<div class="empty-cart"><div class="icon">🔒</div><h3>Please login first</h3><p style="color:var(--gray); margin-bottom:16px;">Login to view your orders</p><a href="login.html" class="btn btn-primary">Login Now</a></div>`;
    return;
  }
  const myOrders = getOrders().filter(o => o.userEmail === user.email);
  if (!myOrders.length) {
    container.innerHTML = `<div class="empty-cart"><div class="icon">📦</div><h3>No orders yet</h3><p style="color:var(--gray); margin-bottom:16px;">Your delicious orders will appear here</p><a href="index.html" class="btn btn-primary">Order Now</a></div>`;
    return;
  }
  container.innerHTML = myOrders.map(o => `
    <div class="order-card">
      <h4><span>Order <span class="order-id">#${o.id}</span></span><span class="order-status status-confirmed">${o.status}</span></h4>
      <div style="font-size:0.85rem; color:var(--gray); margin-bottom:10px;">${o.date} • ${o.estimatedDelivery}</div>
      <div class="order-items">${o.items.map(i => `<div class="order-item"><span>${i.name} × ${i.qty}</span><span>₹${i.price * i.qty}</span></div>`).join("")}</div>
      <div style="font-size:0.85rem; color:var(--gray); margin-top:10px;">📍 ${o.address} • 📞 ${o.phone}</div>
      <div class="order-total">Total: ₹${o.total}</div>
    </div>`).join("");
}

// ---- Auth ----
function showError(el, msg) { if (!el) return showToast(msg, "error"); el.textContent = msg; el.style.display = "block"; }

function registerUser(e) {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;
  const errorEl = document.getElementById("regError"), successEl = document.getElementById("regSuccess");
  [errorEl, successEl].forEach(el => el && (el.style.display = "none"));

  if (!name || !email || !phone || !password || !confirmPassword) return showError(errorEl, "All fields are required");
  if (!/^\S+@\S+\.\S+$/.test(email)) return showError(errorEl, "Please enter a valid email");
  if (password.length < 6) return showError(errorEl, "Password must be at least 6 characters");
  if (password !== confirmPassword) return showError(errorEl, "Passwords do not match");

  const users = getUsers();
  if (users.find(u => u.email === email)) return showError(errorEl, "Email already registered. Please login.");

  users.push({ name, email, phone, password });
  saveUsers(users);
  if (successEl) { successEl.textContent = "Account created successfully! Redirecting to login..."; successEl.style.display = "block"; }
  showToast("Account created successfully!", "success");
  setTimeout(() => location.href = "login.html", 1200);
}

function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const errorEl = document.getElementById("loginError");
  if (errorEl) errorEl.style.display = "none";

  if (!email || !password) return showError(errorEl, "Email and password are required");
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (!user) { showError(errorEl, "Invalid email or password"); showToast("Invalid email or password", "error"); return; }

  saveCurrentUser({ name: user.name, email: user.email, phone: user.phone });
  showToast(`Welcome back, ${user.name}! 👋`, "success");
  setTimeout(() => location.href = "index.html", 800);
}

function handleForgotPassword(e) {
  e.preventDefault();
  const emailInput = document.getElementById("forgotEmail");
  const errorEl = document.getElementById("forgotError"), successEl = document.getElementById("forgotSuccess");
  const resetDiv = document.getElementById("resetFormDiv");
  const email = emailInput.value.trim().toLowerCase();
  [errorEl, successEl].forEach(el => el && (el.style.display = "none"));

  const user = getUsers().find(u => u.email === email);
  if (!user) return showError(errorEl, "Email not found. Please check your email.");

  if (resetDiv) resetDiv.style.display = "block";
  if (successEl) { successEl.textContent = `Email verified! Set new password for ${email}`; successEl.style.display = "block"; }
  showToast("Email verified. Set new password.", "success");
  emailInput.dataset.verifiedEmail = email;
}

function handleResetPassword(e) {
  e.preventDefault();
  const newPass = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("confirmNewPassword").value;
  const errorEl = document.getElementById("resetError"), successEl = document.getElementById("resetSuccess");
  const email = document.getElementById("forgotEmail").dataset.verifiedEmail;
  [errorEl, successEl].forEach(el => el && (el.style.display = "none"));

  if (!newPass || !confirmPass) return showError(errorEl, "Both fields required");
  if (newPass.length < 6) return showError(errorEl, "Password must be at least 6 characters");
  if (newPass !== confirmPass) return showError(errorEl, "Passwords do not match");

  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) return;
  users[idx].password = newPass;
  saveUsers(users);
  if (successEl) { successEl.textContent = "Password updated successfully! Redirecting to login..."; successEl.style.display = "block"; }
  showToast("Password updated successfully!", "success");
  setTimeout(() => location.href = "login.html", 1200);
}

// ---- Profile ----
function renderProfile() {
  const container = document.getElementById("profileContent");
  if (!container) return;
  const user = getCurrentUser();
  if (!user) {
    container.innerHTML = `<div class="empty-cart"><div class="icon">🔒</div><h3>Please login first</h3><p style="color:var(--gray); margin-bottom:16px;">Login to view your profile</p><a href="login.html" class="btn btn-primary">Login Now</a></div>`;
    return;
  }
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div><h3 style="font-size:1.3rem;">${user.name}</h3><p style="color:var(--gray); font-size:0.9rem;">Food Express Member</p></div>
      </div>
      <div class="profile-details">
        <div class="detail-row"><span>Full Name</span><span>${user.name}</span></div>
        <div class="detail-row"><span>Email Address</span><span>${user.email}</span></div>
        <div class="detail-row"><span>Phone Number</span><span>${user.phone}</span></div>
        <div class="detail-row"><span>Account Status</span><span style="color:#16a34a;">● Active</span></div>
      </div>
      <div style="margin-top:20px; display:flex; gap:10px;">
        <a href="orders.html" class="btn btn-outline btn-full">My Orders</a>
        <button class="btn btn-primary btn-full" onclick="logoutUser()">Logout</button>
      </div>
      <p style="margin-top:16px; font-size:0.8rem; color:var(--gray); text-align:center;">Demo auth using localStorage. Not secure for production.</p>
    </div>`;
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  updateHeader();
  renderCategories();
  renderFoods();

  document.getElementById("searchInput")?.addEventListener("input", e => { currentSearch = e.target.value; renderFoods(); });

  if (document.getElementById("cartContainer")) renderCart();
  if (document.getElementById("ordersContainer")) renderOrders();
  if (document.getElementById("profileContent")) renderProfile();

  document.getElementById("registerForm")?.addEventListener("submit", registerUser);
  document.getElementById("loginForm")?.addEventListener("submit", loginUser);
  document.getElementById("forgotForm")?.addEventListener("submit", handleForgotPassword);
  document.getElementById("resetPasswordForm")?.addEventListener("submit", handleResetPassword);

  const hamburger = document.getElementById("hamburger"), mainNav = document.getElementById("mainNav");
  hamburger?.addEventListener("click", () => mainNav.classList.toggle("open"));

  const menuSection = document.getElementById("menuSection");
  const scrollToMenu = () => menuSection?.scrollIntoView({ behavior: "smooth" });
  document.getElementById("orderNowBtn")?.addEventListener("click", scrollToMenu);
  document.getElementById("exploreMenuBtn")?.addEventListener("click", scrollToMenu);

  document.getElementById("orderSuccessModal")?.addEventListener("click", e => {
    if (e.target.id === "orderSuccessModal") { e.target.classList.remove("active"); location.href = "orders.html"; }
  });
});

document.addEventListener("click", e => {
  const nav = document.getElementById("mainNav");
  if (nav && e.target.closest(".nav a") && nav.classList.contains("open")) nav.classList.remove("open");
});