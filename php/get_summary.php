<?php
header('Content-Type: application/json');

require_once 'db.php';
require_once 'config.php';

try {
    if (!empty($station) && strtolower($station) !== 'all') {
        $stmt = $pdo->prepare("SELECT total_count AS total_sightings FROM station_counts WHERE location = :station");
        $stmt->execute([':station' => $station]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $stmt = $pdo->prepare("SELECT total_count AS total_sightings FROM station_counts WHERE location = 'ALL'");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // force integer output
    $summary = [
        'total_sightings' => intval($row['total_sightings'])
    ];

    echo json_encode($summary);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
}

