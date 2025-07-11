<?php
// get_species_yesterday.php
require_once 'db.php';
require_once 'config.php';

header('Content-Type: application/json');

$threshold = isset($_GET['threshold']) ? floatval($_GET['threshold']) : 0.3;

try {
    $sql = "
        SELECT DISTINCT species_common_name
        FROM sightings
        WHERE confidence >= :threshold
          AND DATE(timestamp) = CURDATE() - INTERVAL 1 DAY
    ";

    $params = [':threshold' => $threshold];

    if (!empty($station_id)) {
        $sql .= " AND location = :station_id";
        $params[':station_id'] = $station_id;
    }

    $sql .= " ORDER BY species_common_name ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $species = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($species);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database query failed']);
}

