<?php
// php/get_unique_species.php

header('Content-Type: application/json');

// Autoload your DB connection and any helpers
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/config.php'; // sets $station and debug_log()

// Default confidence threshold
$conf = isset($_GET['conf']) ? floatval($_GET['conf']) : 0.5;
if ($conf < 0 || $conf > 1) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid confidence value']);
    exit;
}

// Build SQL to fetch distinct species names above threshold
$sql = "
  SELECT DISTINCT species_common_name
    FROM sightings
   WHERE confidence >= :conf
";
$params = [':conf' => $conf];

// Filter by station if provided
if (!empty($station) && strtolower($station) !== 'all') {
    $sql .= " AND location = :station";
    $params[':station'] = $station;
}

// Debug logging (optional)
debug_log("get_unique_species.php SQL: $sql");
debug_log("Params: " . json_encode($params));

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $species = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Prepare response
    $response = [
        'unique_species_count' => count($species),
        'species_list'         => $species,
    ];

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    debug_log("Database error in get_unique_species.php: " . $e->getMessage());
    echo json_encode(['error' => 'Database error']);
}

