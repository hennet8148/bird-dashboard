<?php
// get_species_yesterday.php
require_once 'db.php';

header('Content-Type: application/json');

$threshold = isset($_GET['threshold']) ? floatval($_GET['threshold']) : 0.3;

try {
    $stmt = $pdo->prepare("
        SELECT DISTINCT species_common_name
        FROM sightings
        WHERE confidence >= :threshold
          AND DATE(timestamp) = CURDATE() - INTERVAL 1 DAY
        ORDER BY species_common_name ASC
    ");
    $stmt->execute(['threshold' => $threshold]);
    $species = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($species);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database query failed']);
}

