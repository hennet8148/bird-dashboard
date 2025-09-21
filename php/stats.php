<?php

header('Content-Type: application/json');
require_once 'db.php';
require_once 'config.php'; // gets $station

$table = 'sightings';

try {
    // Total sightings (from station_counts)
    if (!empty($station) && strtolower($station) !== 'all') {
        $stmt = $pdo->prepare("SELECT total_count FROM station_counts WHERE location = :station");
        $stmt->execute([':station' => $station]);
        $totalSightings = $stmt->fetchColumn();
    } else {
        $stmt = $pdo->prepare("SELECT total_count FROM station_counts WHERE location = 'ALL'");
        $stmt->execute();
        $totalSightings = $stmt->fetchColumn();
    }

    // Most recent detection
    $whereStation = $station ? " AND location = " . $pdo->quote($station) : "";
    $stmt = $pdo->query("SELECT MAX(timestamp) FROM $table WHERE timestamp IS NOT NULL $whereStation");
    $lastUpdated = $stmt->fetchColumn();

    // First detection: use station_codes.start_date if available
    $firstDate = '2025-06-24'; // fallback
    if ($station) {
        $stmt = $pdo->prepare("SELECT start_date FROM station_codes WHERE station_id = :station_id");
        $stmt->execute(['station_id' => $station]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result && !empty($result['start_date'])) {
            $firstDate = $result['start_date'];
        }
    }

    // Unique species by confidence thresholds for yesterday
    $yesterday = date('Y-m-d', strtotime('-1 day'));
    $thresholds = [0.5, 0.4, 0.3];
    $speciesCounts = [];

    foreach ($thresholds as $t) {
        $sql = "
            SELECT COUNT(DISTINCT species_common_name)
            FROM $table
            WHERE confidence >= :conf
              AND DATE(timestamp) = :yesterday
              $whereStation
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':conf' => $t,
            ':yesterday' => $yesterday
        ]);
        $speciesCounts[(string)$t] = $stmt->fetchColumn();
    }

    echo json_encode([
        'total_sightings' => intval($totalSightings),
        // 'total_species' => removed
        'yesterday_species' => $speciesCounts,
        'last_updated' => $lastUpdated,
        'first_date' => $firstDate
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}

