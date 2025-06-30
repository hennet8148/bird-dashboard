<?php
header('Content-Type: application/json');
require_once 'db.php';

try {
    // Connect using PDO from db.php
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Total sightings
    $totalSightings = $pdo->query("SELECT COUNT(*) FROM sightings")->fetchColumn();

    // Total unique species all time
    $totalSpecies = $pdo->query("SELECT COUNT(DISTINCT species_common_name) FROM sightings")->fetchColumn();

    // Most recent detection timestamp
    $lastUpdated = $pdo->query("SELECT MAX(timestamp) FROM sightings")->fetchColumn();

    // Yesterday’s date
    $yesterday = date('Y-m-d', strtotime('-1 day'));

    // Unique species at different thresholds
    $thresholds = [0.5, 0.4, 0.3];
    $speciesCounts = [];

    foreach ($thresholds as $t) {
        $stmt = $pdo->prepare("
            SELECT COUNT(DISTINCT species_common_name)
            FROM sightings
            WHERE confidence >= :conf
              AND DATE(timestamp) = :yesterday
        ");
        $stmt->execute([
            ':conf' => $t,
            ':yesterday' => $yesterday
        ]);
        $speciesCounts[(string) $t] = $stmt->fetchColumn();
    }

    echo json_encode([
        'total_sightings'   => $totalSightings,
        'total_species'     => $totalSpecies,
        'yesterday_species' => $speciesCounts,
        'last_updated'      => $lastUpdated
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database co]()_

