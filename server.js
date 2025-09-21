const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'food-ordering-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'food_ordering_system'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// User Registration
app.post('/api/register', async (req, res) => {
    const { username, email, password, phone } = req.body;
    
    try {
        // Check if user already exists
        const [existingUsers] = await db.promise().execute(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        await db.promise().execute(
            'INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, phone]
        );
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [users] = await db.promise().execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        req.session.userId = user.id;
        req.session.username = user.username;
        
        res.json({ 
            message: 'Login successful', 
            user: { id: user.id, username: user.username, email: user.email } 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// Get Menu Items
app.get('/api/menu', async (req, res) => {
    try {
        const [items] = await db.promise().execute('SELECT * FROM menu_items ORDER BY category, name');
        res.json(items);
    } catch (error) {
        console.error('Menu fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Menu Items by Category
app.get('/api/menu/category/:category', async (req, res) => {
    const { category } = req.params;
    
    try {
        const [items] = await db.promise().execute(
            'SELECT * FROM menu_items WHERE category = ? ORDER BY name',
            [category]
        );
        res.json(items);
    } catch (error) {
        console.error('Category fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add to Cart
app.post('/api/cart/add', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please login first' });
    }
    
    const { itemId, quantity } = req.body;
    
    try {
        // Check if item already exists in cart
        const [existingItems] = await db.promise().execute(
            'SELECT * FROM cart WHERE user_id = ? AND item_id = ?',
            [req.session.userId, itemId]
        );
        
        if (existingItems.length > 0) {
            // Update quantity
            await db.promise().execute(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?',
                [quantity, req.session.userId, itemId]
            );
        } else {
            // Add new item
            await db.promise().execute(
                'INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)',
                [req.session.userId, itemId, quantity]
            );
        }
        
        res.json({ message: 'Item added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Cart Items
app.get('/api/cart', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please login first' });
    }
    
    try {
        const [cartItems] = await db.promise().execute(`
            SELECT c.*, m.name, m.price, m.image_url, m.description
            FROM cart c
            JOIN menu_items m ON c.item_id = m.id
            WHERE c.user_id = ?
        `, [req.session.userId]);
        
        res.json(cartItems);
    } catch (error) {
        console.error('Cart fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Cart Item Quantity
app.put('/api/cart/update', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please login first' });
    }
    
    const { itemId, quantity } = req.body;
    
    try {
        if (quantity <= 0) {
            await db.promise().execute(
                'DELETE FROM cart WHERE user_id = ? AND item_id = ?',
                [req.session.userId, itemId]
            );
        } else {
            await db.promise().execute(
                'UPDATE cart SET quantity = ? WHERE user_id = ? AND item_id = ?',
                [quantity, req.session.userId, itemId]
            );
        }
        
        res.json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove from Cart
app.delete('/api/cart/:itemId', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please login first' });
    }
    
    const { itemId } = req.params;
    
    try {
        await db.promise().execute(
            'DELETE FROM cart WHERE user_id = ? AND item_id = ?',
            [req.session.userId, itemId]
        );
        
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Reservation
app.post('/api/reservation', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please login first' });
    }
    
    const { date, time, guests, specialRequests } = req.body;
    
    try {
        await db.promise().execute(
            'INSERT INTO reservations (user_id, date, time, guests, special_requests) VALUES (?, ?, ?, ?, ?)',
            [req.session.userId, date, time, guests, specialRequests]
        );
        
        res.status(201).json({ message: 'Reservation created successfully' });
    } catch (error) {
        console.error('Reservation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Reservations
app.get('/api/reservations', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please login first' });
    }
    
    try {
        const [reservations] = await db.promise().execute(
            'SELECT * FROM reservations WHERE user_id = ? ORDER BY date DESC, time DESC',
            [req.session.userId]
        );
        
        res.json(reservations);
    } catch (error) {
        console.error('Reservations fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Check Authentication Status
app.get('/api/auth/status', (req, res) => {
    if (req.session.userId) {
        res.json({ 
            authenticated: true, 
            user: { 
                id: req.session.userId, 
                username: req.session.username 
            } 
        });
    } else {
        res.json({ authenticated: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
