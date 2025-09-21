<?php
// Test all API endpoints
echo "🧪 Testing FoodHub API Endpoints\n";
echo "================================\n\n";

$baseUrl = 'http://localhost/food_ordering_system/';
$endpoints = [
    'api/menu.php' => 'GET',
    'api/auth_status.php' => 'GET',
    'api/contact.php' => 'POST',
    'api/register.php' => 'POST',
    'api/login.php' => 'POST',
    'api/logout.php' => 'POST',
    'api/cart.php' => 'GET',
    'api/cart_add.php' => 'POST',
    'api/reservation.php' => 'POST'
];

foreach ($endpoints as $endpoint => $method) {
    echo "Testing $endpoint ($method)... ";
    
    $url = $baseUrl . $endpoint;
    
    if ($method === 'GET') {
        $response = @file_get_contents($url);
        if ($response !== false) {
            echo "✅ OK\n";
        } else {
            echo "❌ ERROR\n";
        }
    } else {
        // For POST endpoints, we'll just check if the file exists and is readable
        $filePath = $endpoint;
        if (file_exists($filePath) && is_readable($filePath)) {
            echo "✅ File exists\n";
        } else {
            echo "❌ File missing or not readable\n";
        }
    }
}

echo "\n🔍 Checking API files:\n";
$apiFiles = [
    'api/menu.php',
    'api/auth_status.php', 
    'api/contact.php',
    'api/register.php',
    'api/login.php',
    'api/logout.php',
    'api/cart.php',
    'api/cart_add.php',
    'api/cart_update.php',
    'api/cart_remove.php',
    'api/reservation.php'
];

foreach ($apiFiles as $file) {
    if (file_exists($file)) {
        echo "✅ $file exists\n";
    } else {
        echo "❌ $file missing\n";
    }
}

echo "\n💡 Common causes of 'Server error':\n";
echo "1. Database connection issues\n";
echo "2. Missing API files\n";
echo "3. PHP syntax errors\n";
echo "4. Permission issues\n";
echo "5. XAMPP Apache not running\n";
?>

