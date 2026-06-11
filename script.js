// Sample products with categories - Prices in FCFA
const products = [
    // Électronique
    { id: 1, name: 'Laptop Gaming', price: 599000, emoji: '💻', category: 'electronique', description: 'Ordinateur performant' },
    { id: 2, name: 'Smartphone Pro', price: 479000, emoji: '📱', category: 'electronique', description: 'Téléphone haut de gamme' },
    { id: 3, name: 'Tablette 10"', price: 299000, emoji: '📱', category: 'electronique', description: 'Tablette tactile' },
    { id: 4, name: 'Montre Intelligente', price: 179000, emoji: '⌚', category: 'electronique', description: 'Montre connectée' },
    { id: 5, name: 'Casque Audio', price: 119000, emoji: '🎧', category: 'electronique', description: 'Casque sans fil' },
    { id: 6, name: 'Caméra 4K', price: 359000, emoji: '📷', category: 'electronique', description: 'Appareil photo 4K' },
    
    // Vêtements
    { id: 7, name: 'T-shirt Premium', price: 15000, emoji: '👕', category: 'vetements', description: 'T-shirt coton' },
    { id: 8, name: 'Jean Classique', price: 35000, emoji: '👖', category: 'vetements', description: 'Jean de qualité' },
    { id: 9, name: 'Chaussures Sport', price: 45000, emoji: '👟', category: 'vetements', description: 'Sneakers tendance' },
    { id: 10, name: 'Veste Cuir', price: 89000, emoji: '🧥', category: 'vetements', description: 'Veste élégante' },
    
    // Maison
    { id: 11, name: 'Lampe LED', price: 25000, emoji: '💡', category: 'maison', description: 'Lampe intelligente' },
    { id: 12, name: 'Coussin Confort', price: 18000, emoji: '🛏️', category: 'maison', description: 'Coussin ergonomique' },
    { id: 13, name: 'Miroir Mural', price: 22000, emoji: '🪞', category: 'maison', description: 'Miroir décoratif' },
    { id: 14, name: 'Tableau Moderne', price: 39000, emoji: '🎨', category: 'maison', description: 'Art mural moderne' },
];

let cart = [];
let filteredProducts = products;
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Format price with FCFA
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR').format(price);
}

// ===== AUTHENTICATION =====
// Auth tabs
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form-content').forEach(f => f.classList.remove('active'));
        e.target.classList.add('active');
        document.querySelector(`.auth-form-content[style*="display: block"] || #${e.target.dataset.tab}Form`).classList.add('active');
        if (e.target.dataset.tab === 'signin') {
            document.getElementById('signInForm').classList.add('active');
        } else {
            document.getElementById('signUpForm').classList.add('active');
        }
    });
});

// Sign Up
document.getElementById('signUpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const phone = document.getElementById('signupPhone').value;

    if (users.find(u => u.email === email)) {
        alert('❌ Cet email existe déjà');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        phone,
        createdAt: new Date().toLocaleDateString('fr-FR')
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('✅ Inscription réussie! Veuillez vous connecter.');
    document.getElementById('signUpForm').reset();
    document.querySelector('[data-tab="signin"]').click();
});

// Sign In
document.getElementById('signInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        alert('❌ Email ou mot de passe incorrect');
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert(`✅ Bienvenue ${user.name}!`);
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signInForm').reset();
    updateAuthUI();
});

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    alert('👋 Vous avez été déconnecté');
    document.getElementById('profileModal').style.display = 'none';
    document.getElementById('ordersModal').style.display = 'none';
    updateAuthUI();
}

// Update Auth UI
function updateAuthUI() {
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const signupLink = document.getElementById('signupLink');
    const profileLink = document.getElementById('profileLink');
    const ordersLink = document.getElementById('ordersLink');

    if (currentUser) {
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        logoutLink.style.display = 'block';
        profileLink.style.display = 'block';
        ordersLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        signupLink.style.display = 'block';
        logoutLink.style.display = 'none';
        profileLink.style.display = 'none';
        ordersLink.style.display = 'none';
    }
}

// Open Login
function openLogin() {
    if (currentUser) return;
    document.querySelector('[data-tab="signin"]').click();
    document.getElementById('loginModal').style.display = 'block';
}

// Open Signup
function openSignup() {
    if (currentUser) return;
    document.querySelector('[data-tab="signup"]').click();
    document.getElementById('loginModal').style.display = 'block';
}

// Open Profile
function openProfile() {
    if (!currentUser) {
        alert('Veuillez vous connecter d\'abord');
        return;
    }
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.phone;
    document.getElementById('profileDate').textContent = currentUser.createdAt;
    document.getElementById('profileModal').style.display = 'block';
}

// Open Orders
function openOrders() {
    if (!currentUser) {
        alert('Veuillez vous connecter d\'abord');
        return;
    }
    const userOrders = orders.filter(o => o.userId === currentUser.id);
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';

    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Aucune commande</p>';
    } else {
        userOrders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-item';
            orderDiv.innerHTML = `
                <div class="order-header">
                    <span class="order-number">Commande #${order.id}</span>
                    <span class="order-date">${order.date}</span>
                </div>
                <div class="order-total">Montant: ${formatPrice(order.total)} FCFA</div>
                <span class="order-status ${order.status}">${order.status === 'confirmed' ? '✅ Confirmée' : '⏳ En attente'}</span>
            `;
            ordersList.appendChild(orderDiv);
        });
    }
    document.getElementById('ordersModal').style.display = 'block';
}

// User Menu Toggle
document.getElementById('userBtn').addEventListener('click', () => {
    document.getElementById('userMenu').classList.toggle('active');
});

// ===== PRODUCTS =====
// Display products
function displayProducts(productsToDisplay = products) {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">Aucun produit trouvé</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">${formatPrice(product.price)} FCFA</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Ajouter au Panier</button>
            </div>
        `;
        productsList.appendChild(productCard);
    });
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
});

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const filter = e.target.dataset.filter;
        if (filter === 'all') {
            filteredProducts = products;
        } else {
            filteredProducts = products.filter(p => p.category === filter);
        }
        displayProducts(filteredProducts);
    });
});

// ===== CART =====
// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    alert(`✅ ${product.name} ajouté au panier!`);
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Display cart modal
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');

    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 1rem; color: #999;">Votre panier est vide</p>';
        totalPrice.textContent = '0';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span><strong>${item.name}</strong> x${item.quantity} = ${formatPrice(itemTotal)} FCFA</span>
            <span class="cart-item-remove" onclick="removeFromCart(${item.id})">❌</span>
        `;
        cartItems.appendChild(cartItem);
    });

    totalPrice.textContent = formatPrice(total);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    displayCart();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide');
        return;
    }

    if (!currentUser) {
        alert('Veuillez vous connecter pour commander');
        document.getElementById('cartModal').style.display = 'none';
        openLogin();
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('paymentTotal').textContent = formatPrice(total);
    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('paymentModal').style.display = 'block';
}

// Payment form submission
document.getElementById('paymentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order = {
        id: Math.floor(Math.random() * 10000),
        userId: currentUser.id,
        date: new Date().toLocaleDateString('fr-FR'),
        total: total,
        status: 'confirmed',
        items: cart
    };

    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert(`✅ Paiement confirmé!\n\nCommande #${order.id}\nMontant: ${formatPrice(total)} FCFA\n\nMerci pour votre achat!`);
    
    cart = [];
    updateCart();
    document.getElementById('paymentForm').reset();
    document.getElementById('paymentModal').style.display = 'none';
});

// ===== MODALS =====
// Cart Modal
document.getElementById('cartIcon').addEventListener('click', () => {
    displayCart();
    document.getElementById('cartModal').style.display = 'block';
});

document.getElementById('closeCart').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none';
});

document.getElementById('checkoutBtn').addEventListener('click', checkout);

// Profile Modal
document.getElementById('closeProfile').addEventListener('click', () => {
    document.getElementById('profileModal').style.display = 'none';
});

// Orders Modal
document.getElementById('closeOrders').addEventListener('click', () => {
    document.getElementById('ordersModal').style.display = 'none';
});

// Login Modal
document.getElementById('closeLogin').addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'none';
});

// Payment Modal
document.getElementById('closePayment').addEventListener('click', () => {
    document.getElementById('paymentModal').style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('cartModal')) {
        document.getElementById('cartModal').style.display = 'none';
    }
    if (event.target === document.getElementById('loginModal')) {
        document.getElementById('loginModal').style.display = 'none';
    }
    if (event.target === document.getElementById('profileModal')) {
        document.getElementById('profileModal').style.display = 'none';
    }
    if (event.target === document.getElementById('ordersModal')) {
        document.getElementById('ordersModal').style.display = 'none';
    }
    if (event.target === document.getElementById('paymentModal')) {
        document.getElementById('paymentModal').style.display = 'none';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    updateAuthUI();
    displayProducts();
    updateCart();
});