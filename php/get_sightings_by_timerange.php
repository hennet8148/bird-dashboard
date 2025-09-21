<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'db.php';
require_once 'config.php'; // for debug_log()

$timeRange = $_GET['timerange'] ?? 'last_hour';
$station   = $_GET['station']   ?? null;

// Debug log incoming parameters
debug_log("get_sightings_by_timerange.php → timerange = $timeRange, station = " . ($station ?? 'NULL'));

// Time filter logic (use range conditions to make idx_timestamp usable)
switch ($timeRange) {
    case 'last_hour':
        $timeCondition = "s.timestamp >= NOW() - INTERVAL 1 HOUR";
        break;
    case 'today':
        $timeCondition = "s.timestamp >= CURDATE() AND s.timestamp < CURDATE() + INTERVAL 1 DAY";
        break;
    case 'yesterday':
        $timeCondition = "s.timestamp >= CURDATE() - INTERVAL 1 DAY AND s.timestamp < CURDATE()";
        break;
    case 'last_week':
        $timeCondition = "s.timestamp >= NOW() - INTERVAL 7 DAY";
        break;
    case 'last_month':
        $timeCondition = "s.timestamp >= NOW() - INTERVAL 30 DAY";
        break;
    default:
        $timeCondition = "s.timestamp >= NOW() - INTERVAL 1 HOUR";
}

$params = [];

// Station filter logic (accept any non-empty station value; "" = All Stations)
if (!empty($station) && strtolower($station) !== 'all') {
    $stationCondition = "AND s.location = :station";
    $params[':station'] = $station;
} else {
    $stationCondition = "";
}

$sql = "
    SELECT 
        sc.species_code,
        s.species_common_name,
        COUNT(*) AS sightings_count,
        AVG(s.confidence) AS avg_confidence,
        MAX(s.confidence) AS max_confidence
    FROM sightings s
    INNER JOIN species_codes sc
        ON TRIM(LOWER(s.species_common_name)) = TRIM(LOWER(sc.species_common_name))
    WHERE $timeCondition
    $stationCondition
    GROUP BY s.species_common_name, sc.species_code
    ORDER BY sightings_count DESC
    LIMIT 100
";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'details' => $e->getMessage()
    ]);
}

