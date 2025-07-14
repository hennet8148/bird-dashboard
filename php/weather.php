<?php
header('Content-Type: application/json');
require_once 'php/db.php'; // Adjust path if needed

try {
    $stmt = $pdo->query("
        SELECT * 
        FROM weather 
        ORDER BY timestamp DESC 
        LIMIT 1
    ");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        echo json_encode([
            'success' => true,
            'data' => $row
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'No weather data found.'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}

