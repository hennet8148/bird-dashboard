<?php
// php/get_unique_species.php

header('Content-Type: application/json');

require_once 'db.php';
require_once 'config.php'; // sets $station and debug_log()

// Default confidence if not passed
$conf = isset($_GET['conf']) ? floatval($_GET['conf']) : 0.5;

// Validate confidence
if ($conf < 0 || $conf > 1) {
    echo json_encode(['error' => 'Invalid confidence value']);
    exit;
}

// Build query and parameters
$sql = "SELECT COUNT(DISTINCT species_common_name) AS count FROM sightings WHERE confidence >= :conf";
$params = [':conf' => $conf];

// Add station clause if provided and not 'All'
if (!empty($station) && strtolower($station) !== 'all') {
    $sql .= " AND location = :station";
    $params[':station'] = $station;
}

// Optional debug logging
debug_log("get_unique_species.php SQL: $sql");
debug_log("Params: " . json_encode($params));

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $count = $stmt->fetchColumn();
    echo json_encode(['count' => intval($count)]);
} catch (Exception $e) {
    http_response_code(500);
    debug_log("Database error in get_unique_species.php: " . $e->getMessage());
    echo json_encode(['error' => 'Database error']);
}

