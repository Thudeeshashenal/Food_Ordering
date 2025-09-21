<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Messages - FoodHub Admin</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            color: #333;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 0;
            text-align: center;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }
        
        .stat-label {
            color: #666;
            margin-top: 5px;
        }
        
        .messages-table {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
        }
        
        .status {
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status.new {
            background: #d4edda;
            color: #155724;
        }
        
        .status.read {
            background: #d1ecf1;
            color: #0c5460;
        }
        
        .status.replied {
            background: #d4edda;
            color: #155724;
        }
        
        .message-preview {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #667eea;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5a6fd8;
        }
        
        .btn-success {
            background: #28a745;
            color: white;
        }
        
        .btn-success:hover {
            background: #218838;
        }
        
        .no-messages {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .refresh-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            margin-bottom: 20px;
        }
        
        .refresh-btn:hover {
            background: #218838;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1><i class="fas fa-envelope"></i> Contact Messages - FoodHub Admin</h1>
        <p>Manage customer inquiries and feedback</p>
    </div>
    
    <div class="container">
        <button class="refresh-btn" onclick="location.reload()">
            <i class="fas fa-sync-alt"></i> Refresh
        </button>
        
        <?php
        // Database configuration
        $host = 'localhost';
        $username = 'root';
        $password = '';
        $database = 'food_ordering_system';
        
        try {
            $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Get statistics
            $totalMessages = $pdo->query("SELECT COUNT(*) FROM contact_messages")->fetchColumn();
            $newMessages = $pdo->query("SELECT COUNT(*) FROM contact_messages WHERE status = 'new'")->fetchColumn();
            $readMessages = $pdo->query("SELECT COUNT(*) FROM contact_messages WHERE status = 'read'")->fetchColumn();
            $repliedMessages = $pdo->query("SELECT COUNT(*) FROM contact_messages WHERE status = 'replied'")->fetchColumn();
            
            echo "<div class='stats'>";
            echo "<div class='stat-card'>";
            echo "<div class='stat-number'>$totalMessages</div>";
            echo "<div class='stat-label'>Total Messages</div>";
            echo "</div>";
            echo "<div class='stat-card'>";
            echo "<div class='stat-number'>$newMessages</div>";
            echo "<div class='stat-label'>New Messages</div>";
            echo "</div>";
            echo "<div class='stat-card'>";
            echo "<div class='stat-number'>$readMessages</div>";
            echo "<div class='stat-label'>Read Messages</div>";
            echo "</div>";
            echo "<div class='stat-card'>";
            echo "<div class='stat-number'>$repliedMessages</div>";
            echo "<div class='stat-label'>Replied Messages</div>";
            echo "</div>";
            echo "</div>";
            
            // Get messages
            $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (count($messages) > 0) {
                echo "<div class='messages-table'>";
                echo "<table>";
                echo "<thead>";
                echo "<tr>";
                echo "<th>Name</th>";
                echo "<th>Email</th>";
                echo "<th>Subject</th>";
                echo "<th>Message</th>";
                echo "<th>Status</th>";
                echo "<th>Date</th>";
                echo "<th>Actions</th>";
                echo "</tr>";
                echo "</thead>";
                echo "<tbody>";
                
                foreach ($messages as $message) {
                    echo "<tr>";
                    echo "<td>" . htmlspecialchars($message['name']) . "</td>";
                    echo "<td>" . htmlspecialchars($message['email']) . "</td>";
                    echo "<td>" . htmlspecialchars($message['subject']) . "</td>";
                    echo "<td class='message-preview'>" . htmlspecialchars(substr($message['message'], 0, 50)) . "...</td>";
                    echo "<td><span class='status " . $message['status'] . "'>" . $message['status'] . "</span></td>";
                    echo "<td>" . date('M j, Y g:i A', strtotime($message['created_at'])) . "</td>";
                    echo "<td>";
                    echo "<button class='btn btn-primary' onclick='viewMessage(" . $message['id'] . ")'>View</button> ";
                    if ($message['status'] == 'new') {
                        echo "<button class='btn btn-success' onclick='markAsRead(" . $message['id'] . ")'>Mark Read</button>";
                    }
                    echo "</td>";
                    echo "</tr>";
                }
                
                echo "</tbody>";
                echo "</table>";
                echo "</div>";
            } else {
                echo "<div class='no-messages'>";
                echo "<i class='fas fa-inbox' style='font-size: 3rem; color: #ccc; margin-bottom: 20px;'></i>";
                echo "<h3>No contact messages yet</h3>";
                echo "<p>Customer messages will appear here when they submit the contact form.</p>";
                echo "</div>";
            }
            
        } catch (PDOException $e) {
            echo "<div class='no-messages'>";
            echo "<h3>Database Error</h3>";
            echo "<p>Could not connect to database: " . $e->getMessage() . "</p>";
            echo "</div>";
        }
        ?>
    </div>
    
    <script>
        function viewMessage(id) {
            // In a real application, you would open a modal or redirect to a detailed view
            alert('View message ID: ' + id + '\n\nIn a real application, this would show the full message details.');
        }
        
        function markAsRead(id) {
            if (confirm('Mark this message as read?')) {
                // In a real application, you would make an AJAX call to update the status
                alert('Message marked as read!');
                location.reload();
            }
        }
    </script>
</body>
</html>

