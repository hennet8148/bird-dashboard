<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Adjust path if needed. If this file is in birds/php/, and db.php is also in php/, then this is correct:
require_once 'db.php';
// If db.php is in the parent of php/, use:
// require_once __DIR__ . '/../db.php';

try {
    // Check if $pdo is set
    if (!isset($pdo)) {
        throw new Exception('Database connection not initialized.');
    }

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
}

