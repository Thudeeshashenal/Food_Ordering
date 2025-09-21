<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

$date = $input['date'] ?? '';
$time = $input['time'] ?? '';
$guests = $input['guests'] ?? '';
$specialRequests = $input['specialRequests'] ?? '';

// Validate input
if (empty($date) || empty($time) || empty($guests)) {
    http_response_code(400);
    echo json_encode(['message' => 'Date, time, and number of guests are required']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO reservations (user_id, date, time, guests, special_requests) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$_SESSION['user_id'], $date, $time, $guests, $specialRequests]);
    
    http_response_code(201);
    echo json_encode(['message' => 'Reservation created successfully']);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error']);
}
?>

