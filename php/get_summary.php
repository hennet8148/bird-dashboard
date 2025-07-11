<?php
header('Content-Type: application/json');

require_once 'db.php';
require_once 'config.php';

try {
    $sql = "SELECT 
                COUNT(*) AS total_sightings,
                COUNT(DISTINCT species_common_name) AS total_species
            FROM sightings";
    $params = [];

    if (!empty($station_id)) {
        $sql .= " WHERE location = :station_id";
        $params[':station_id'] = $station_id;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $summary = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($summary);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
}

