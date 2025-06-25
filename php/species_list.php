<?php
header('Content-Type: application/json');

require_once 'db.php';

try {
    $stmt = $pdo->query("SELECT DISTINCT species_common_name FROM sightings ORDER BY species_common_name ASC");
    $species = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($species);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
}

