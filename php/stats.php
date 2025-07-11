<?php
header('Content-Type: application/json');
require_once 'db.php';
require_once 'config.php'; // gets $station

$whereStation = $station ? " AND location = " . $pdo->quote($station) : "";

try {
    // Total sightings (optionally filtered by station)
    $totalSightings = $pdo->query("SELECT COUNT(*) FROM sightings WHERE 1=1 $whereStation")->fetchColumn();

    // Total unique species (optionally filtered by station)
    $totalSpecies = $pdo->query("SELECT COUNT(DISTINCT species_common_name) FROM sightings WHERE 1=1 $whereStation")->fetchColumn();

    // Most recent detection (filtered)
    $lastUpdatedStmt = $pdo->query("SELECT MAX(timestamp) FROM sightings WHERE timestamp IS NOT NULL $whereStation");
    $lastUpdated = $lastUpdatedStmt->fetchColumn() ?: null;

    // First recorded detection (filtered)
    $firstDateStmt = $pdo->query("SELECT MIN(timestamp) FROM sightings WHERE timestamp IS NOT NULL $whereStation");
    $firstDate = $firstDateStmt->fetchColumn() ?: null;

    // Unique species by confidence thresholds for yesterday
    $yesterday = date('Y-m-d', strtotime('-1 day'));
    $thresholds = [0.5, 0.4, 0.3];
    $speciesCounts = [];

    foreach ($thresholds as $t) {
        $sql = "
            SELECT COUNT(DISTINCT species_common_name)
            FROM sightings
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
        'total_sightings' => $totalSightings,
        'total_species' => $totalSpecies,
        'yesterday_species' => $speciesCounts,
        'last_updated' => $lastUpdated,
        'first_date' => $firstDate
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}

