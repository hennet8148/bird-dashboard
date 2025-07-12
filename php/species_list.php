<?php
header('Content-Type: application/json');

require_once 'db.php';
require_once 'config.php';

try {
    $sql = "SELECT DISTINCT species_common_name FROM sightings";
    $params = [];

    if (!empty($station)) {
        $sql .= " WHERE location = :station";
        $params[':station'] = $station;
    }

    $sql .= " ORDER BY species_common_name ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $species = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($species);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
}

