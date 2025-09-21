-- Create database
CREATE DATABASE IF NOT EXISTS food_ordering_system;
USE food_ordering_system;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_item (user_id, item_id)
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests INT NOT NULL,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    delivery_address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, image_url) VALUES
-- Breakfast Items
('Pancakes with Maple Syrup', 'Fluffy pancakes served with pure maple syrup and butter', 12.99, 'breakfast', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'),
('Eggs Benedict', 'Poached eggs on English muffins with hollandaise sauce', 15.99, 'breakfast', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400'),
('Avocado Toast', 'Smashed avocado on artisan bread with cherry tomatoes', 11.99, 'breakfast', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400'),
('French Toast', 'Thick slices of bread dipped in egg batter and fried', 13.99, 'breakfast', 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400'),

-- Main Courses
('Grilled Salmon', 'Fresh Atlantic salmon with lemon herb butter', 24.99, 'main', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400'),
('Beef Steak', 'Premium ribeye steak cooked to perfection', 32.99, 'main', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400'),
('Chicken Parmesan', 'Breaded chicken breast with marinara and mozzarella', 19.99, 'main', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'),
('Vegetarian Pasta', 'Penne pasta with seasonal vegetables in garlic sauce', 16.99, 'main', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400'),

-- Desserts
('Chocolate Cake', 'Rich chocolate cake with chocolate ganache', 8.99, 'dessert', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'),
('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 9.99, 'dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400'),
('Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and nuts', 6.99, 'dessert', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'),
('Cheesecake', 'New York style cheesecake with berry compote', 7.99, 'dessert', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400'),

-- Beverages
('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'beverage', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400'),
('Coffee Latte', 'Espresso with steamed milk and foam', 5.99, 'beverage', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'),
('Green Tea', 'Premium green tea leaves', 3.99, 'beverage', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'),
('Smoothie Bowl', 'Acai bowl with fresh fruits and granola', 12.99, 'beverage', 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400');
