<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Please login first']);
    exit;
}

// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'food_ordering_system';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid JSON input']);
    exit;
}

$itemId = $input['itemId'] ?? '';
$quantity = $input['quantity'] ?? 1;

// Validate input
if (empty($itemId)) {
    http_response_code(400);
    echo json_encode(['message' => 'Item ID is required']);
    exit;
}

try {
    if ($quantity <= 0) {
        // Remove item from cart
        $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND item_id = ?");
        $stmt->execute([$_SESSION['user_id'], $itemId]);
    } else {
        // Update quantity
        $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND item_id = ?");
        $stmt->execute([$quantity, $_SESSION['user_id'], $itemId]);
    }
    
    echo json_encode(['message' => 'Cart updated successfully']);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error']);
}
?>

