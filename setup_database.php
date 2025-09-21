<?php
// Database setup script for FoodHub
echo "🍽️  FoodHub Database Setup\n";
echo "========================\n\n";

// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'food_ordering_system';

try {
    // Connect to MySQL server
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "🔌 Connected to MySQL server\n";
    
    // Read SQL file
    $sqlContent = file_get_contents('database.sql');
    
    echo "📊 Creating database and tables...\n";
    
    // Execute SQL commands
    $pdo->exec($sqlContent);
    
    echo "✅ Database setup completed successfully!\n";
    echo "📋 Created tables: users, menu_items, cart, reservations, orders, order_items\n";
    echo "🍕 Added sample menu items with categories\n\n";
    
    echo "🎉 Setup completed successfully!\n";
    echo "\n📋 Next steps:\n";
    echo "1. Make sure Apache is running in XAMPP\n";
    echo "2. Open: http://localhost/food_ordering_system/\n";
    echo "3. Try registering a new user!\n\n";
    echo "🍽️  Enjoy your FoodHub system!\n";
    
} catch (PDOException $e) {
    echo "❌ Database setup failed: " . $e->getMessage() . "\n";
    echo "\n💡 Troubleshooting tips:\n";
    echo "1. Make sure MySQL is running in XAMPP\n";
    echo "2. Check your database credentials\n";
    echo "3. Ensure you have permission to create databases\n";
    echo "4. Try running the SQL commands manually from database.sql\n";
}
?>

