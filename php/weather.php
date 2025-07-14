<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

require_once 'db.php';

try {
    $stmt = $pdo->query("
        SELECT *
        FROM weather_readings
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

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Exception: ' . $e->getMessage()
    ]);
}

