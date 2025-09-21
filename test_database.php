<?php
// Test database connection and tables
echo "🧪 Testing FoodHub Database\n";
echo "==========================\n\n";

// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'food_ordering_system';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Database connection successful!\n\n";
    
    // Test tables
    $tables = ['users', 'menu_items', 'cart', 'reservations', 'orders', 'order_items'];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "✅ Table '$table' exists\n";
        } else {
            echo "❌ Table '$table' missing\n";
        }
    }
    
    echo "\n";
    
    // Test menu items
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM menu_items");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "📋 Menu items: " . $result['count'] . " items\n";
    
    // Show sample menu items
    $stmt = $pdo->query("SELECT name, price, category FROM menu_items LIMIT 3");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "\n🍕 Sample menu items:\n";
    foreach ($items as $item) {
        echo "   - {$item['name']} (${$item['price']}) - {$item['category']}\n";
    }
    
    echo "\n🎉 Database is ready for use!\n";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    echo "\n💡 Make sure:\n";
    echo "1. XAMPP MySQL is running\n";
    echo "2. Database 'food_ordering_system' exists\n";
    echo "3. Tables are created (run setup_database.php)\n";
}
?>

