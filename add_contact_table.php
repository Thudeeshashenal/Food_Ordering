<?php
// Script to add contact_messages table to existing database
echo "📧 Adding Contact Table to FoodHub Database\n";
echo "==========================================\n\n";

// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'food_ordering_system';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "🔌 Connected to database: $database\n";
    
    // Check if contact_messages table already exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'contact_messages'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Contact table already exists!\n";
    } else {
        echo "📊 Creating contact_messages table...\n";
        
        // Create contact_messages table
        $sql = "CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            subject VARCHAR(200) NOT NULL,
            message TEXT NOT NULL,
            status ENUM('new', 'read', 'replied') DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        
        $pdo->exec($sql);
        echo "✅ Contact table created successfully!\n";
    }
    
    // Show table structure
    echo "\n📋 Contact table structure:\n";
    $stmt = $pdo->query("DESCRIBE contact_messages");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        echo "   - {$column['Field']} ({$column['Type']}) - {$column['Null']} - {$column['Default']}\n";
    }
    
    echo "\n🎉 Contact functionality is now ready!\n";
    echo "\n📋 What you can do now:\n";
    echo "1. Users can submit contact forms\n";
    echo "2. Messages are stored in the database\n";
    echo "3. You can view messages in phpMyAdmin\n";
    echo "4. Messages have status tracking (new/read/replied)\n";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    echo "\n💡 Make sure:\n";
    echo "1. XAMPP MySQL is running\n";
    echo "2. Database 'food_ordering_system' exists\n";
    echo "3. You have permission to create tables\n";
}
?>

