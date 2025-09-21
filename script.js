// Global variables
let currentUser = null;
let cartItems = [];
let menuItems = [];

// DOM Elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const cartModal = document.getElementById('cartModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const menuGrid = document.getElementById('menuGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const reservationForm = document.getElementById('reservationForm');
const contactForm = document.getElementById('contactForm');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
    loadMenuItems();
});

// Initialize the application
function initializeApp() {
    // Set minimum date for reservation to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reservationDate').setAttribute('min', today);
    
    // Load cart from localStorage
    loadCartFromStorage();
    updateCartUI();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Modal controls
    loginBtn.addEventListener('click', () => openModal(loginModal));
    registerBtn.addEventListener('click', () => openModal(registerModal));
    cartBtn.addEventListener('click', () => openModal(cartModal));
    logoutBtn.addEventListener('click', logout);
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    reservationForm.addEventListener('submit', handleReservation);
    contactForm.addEventListener('submit', handleContact);
    
    // Menu filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => filterMenu(btn.dataset.category));
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Show register modal from login modal
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
        openModal(registerModal);
    });
    
    // Show login modal from register modal
    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
        openModal(loginModal);
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Modal functions
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Authentication functions
async function checkAuthStatus() {
    try {
        const response = await fetch('api/auth_status.php');
        const data = await response.json();
        
        if (data.authenticated) {
            currentUser = data.user;
            updateAuthUI(true);
            loadCartItems(); // Load cart items for authenticated user
        } else {
            updateAuthUI(false);
            cartItems = []; // Clear cart for non-authenticated user
            updateCartUI();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        // Don't show error message for auth status check failures
    }
}

function updateAuthUI(isLoggedIn) {
    if (isLoggedIn) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Login successful!', 'success');
            currentUser = data.user;
            updateAuthUI(true);
            loadCartItems(); // Load cart items after successful login
            closeModal();
            loginForm.reset();
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('An error occurred during login', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const phone = document.getElementById('registerPhone').value;
    
    try {
        const response = await fetch('api/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, phone }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Registration successful! Please login.', 'success');
            registerForm.reset();
            setTimeout(() => {
                closeModal();
                openModal(loginModal);
            }, 1500);
        } else {
            showMessage(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('An error occurred during registration', 'error');
    }
}

async function logout() {
    try {
        const response = await fetch('api/logout.php', {
            method: 'POST',
        });
        
        if (response.ok) {
            currentUser = null;
            cartItems = []; // Clear cart on logout
            updateCartUI();
            updateAuthUI(false);
            showMessage('Logged out successfully', 'success');
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Menu functions
async function loadMenuItems() {
    try {
        const response = await fetch('api/menu.php');
        menuItems = await response.json();
        displayMenuItems(menuItems);
    } catch (error) {
        console.error('Error loading menu:', error);
        showMessage('Error loading menu items', 'error');
    }
}

function displayMenuItems(items) {
    menuGrid.innerHTML = '';
    
    if (items.length === 0) {
        menuGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #666;">No items found</p>';
        return;
    }
    
    items.forEach(item => {
        const menuItemElement = createMenuItemElement(item);
        menuGrid.appendChild(menuItemElement);
    });
}

function createMenuItemElement(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
        <img src="${item.image_url}" alt="${item.name}" loading="lazy">
        <div class="menu-item-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="menu-item-price">$${item.price}</div>
            <button class="add-to-cart" onclick="addToCart(${item.id}, this)">
                <i class="fas fa-plus"></i> Add to Cart
            </button>
        </div>
    `;
    return div;
}

function filterMenu(category) {
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Filter items
    let filteredItems = menuItems;
    if (category !== 'all') {
        filteredItems = menuItems.filter(item => item.category === category);
    }
    
    displayMenuItems(filteredItems);
}

// Cart functions
async function addToCart(itemId, buttonElement = null) {
    if (!currentUser) {
        showMessage('❌ Please login to add items to cart', 'error');
        openModal(loginModal);
        return;
    }
    
    try {
        const response = await fetch('api/cart_add.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId, quantity: 1 }),
        });
        
        if (response.ok) {
            showMessage('✅ Item added to cart!', 'success');
            loadCartItems();
            
            // Add visual feedback to the button
            if (buttonElement) {
                const originalHTML = buttonElement.innerHTML;
                buttonElement.style.transform = 'scale(0.95)';
                buttonElement.style.backgroundColor = '#28a745';
                buttonElement.innerHTML = '<i class="fas fa-check"></i> Added!';
                
                setTimeout(() => {
                    buttonElement.style.transform = 'scale(1)';
                    buttonElement.style.backgroundColor = '';
                    buttonElement.innerHTML = originalHTML;
                }, 1500);
            }
        } else {
            const data = await response.json();
            showMessage('❌ ' + (data.message || 'Error adding to cart'), 'error');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        showMessage('❌ Error adding item to cart', 'error');
    }
}

async function loadCartItems() {
    if (!currentUser) {
        // Clear cart items if user is not logged in
        cartItems = [];
        updateCartUI();
        return;
    }
    
    try {
        const response = await fetch('api/cart.php');
        if (response.ok) {
            cartItems = await response.json();
            updateCartUI();
        } else if (response.status === 401) {
            // User is not authenticated, clear cart
            cartItems = [];
            updateCartUI();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        // Don't show error message for cart loading failures
    }
}

function updateCartUI() {
    // Update cart count
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal
    displayCartItems();
}

function displayCartItems() {
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price} each</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.item_id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.item_id}, ${item.quantity + 1})">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.item_id})">Remove</button>
            </div>
            <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

async function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        await removeFromCart(itemId);
        return;
    }
    
    try {
        const response = await fetch('api/cart_update.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId, quantity: newQuantity }),
        });
        
        if (response.ok) {
            loadCartItems();
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

async function removeFromCart(itemId) {
    try {
        const response = await fetch(`api/cart_remove.php?itemId=${itemId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            showMessage('Item removed from cart', 'success');
            loadCartItems();
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

// Reservation functions
async function handleReservation(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showMessage('Please login to make a reservation', 'error');
        openModal(loginModal);
        return;
    }
    
    const formData = new FormData(reservationForm);
    const reservationData = {
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests'),
        specialRequests: formData.get('specialRequests')
    };
    
    try {
        const response = await fetch('api/reservation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Reservation made successfully!', 'success');
            reservationForm.reset();
        } else {
            showMessage(data.message || 'Reservation failed', 'error');
        }
    } catch (error) {
        console.error('Reservation error:', error);
        showMessage('An error occurred while making reservation', 'error');
    }
}

// Contact functions
async function handleContact(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    try {
        const response = await fetch('api/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('✅ ' + data.message, 'success');
            contactForm.reset();
        } else {
            showMessage('❌ ' + (data.message || 'Error sending message'), 'error');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        showMessage('❌ An error occurred while sending your message', 'error');
    }
}

// Utility functions
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    // Add icon based on message type
    let icon = '';
    if (type === 'success') {
        icon = '<i class="fas fa-check-circle"></i> ';
    } else if (type === 'error') {
        icon = '<i class="fas fa-exclamation-circle"></i> ';
    } else if (type === 'info') {
        icon = '<i class="fas fa-info-circle"></i> ';
    }
    
    messageDiv.innerHTML = icon + message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.className = 'message-close';
    closeBtn.onclick = () => messageDiv.remove();
    messageDiv.appendChild(closeBtn);
    
    // Insert at the top of the page
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Add animation
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 4000);
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cartItems = JSON.parse(savedCart);
        } catch (error) {
            console.error('Error parsing saved cart:', error);
            cartItems = [];
        }
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Checkout function
checkoutBtn.addEventListener('click', async function() {
    if (!currentUser) {
        showMessage('Please login to checkout', 'error');
        openModal(loginModal);
        return;
    }
    
    if (cartItems.length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }
    
    try {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // For demo purposes, simulate order creation
        showMessage(`Order placed successfully! Total: $${total.toFixed(2)}`, 'success');
        
        // Clear cart
        cartItems = [];
        updateCartUI();
        closeModal();
        
        // In a real application, you would create an order here
        // await createOrder(cartItems, total);
        
    } catch (error) {
        console.error('Checkout error:', error);
        showMessage('Error processing order', 'error');
    }
});

// Add loading states to buttons
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || button.textContent;
    }
}

// Add original text attribute to buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('button').forEach(button => {
        button.setAttribute('data-original-text', button.textContent);
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.menu-item, .feature, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Search functionality
function searchMenu(query) {
    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    displayMenuItems(filteredItems);
}

// Add search input if needed
function addSearchInput() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <input type="text" id="menuSearch" placeholder="Search menu items...">
            <i class="fas fa-search"></i>
        </div>
    `;
    
    const menuSection = document.querySelector('.menu-section .container');
    menuSection.insertBefore(searchContainer, menuSection.querySelector('.menu-filters'));
    
    const searchInput = document.getElementById('menuSearch');
    searchInput.addEventListener('input', (e) => {
        if (e.target.value.trim()) {
            searchMenu(e.target.value);
        } else {
            displayMenuItems(menuItems);
        }
    });
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', addSearchInput);
