<?php
header('Content-Type: application/json');
require_once 'db.php';

$timeRange = $_GET['timerange'] ?? 'last_hour';

switch ($timeRange) {
    case 'last_hour':
        $timeCondition = "timestamp >= NOW() - INTERVAL 1 HOUR";
        break;
    case 'today':
        $timeCondition = "DATE(timestamp) = CURDATE()";
        break;
    case 'yesterday':
        $timeCondition = "DATE(timestamp) = CURDATE() - INTERVAL 1 DAY";
        break;
    case 'last_week':
        $timeCondition = "timestamp >= NOW() - INTERVAL 7 DAY";
        break;
    case 'last_month':
        $timeCondition = "timestamp >= NOW() - INTERVAL 30 DAY";
        break;
    default:
        $timeCondition = "timestamp >= NOW() - INTERVAL 1 HOUR";
}

$stmt = $pdo->prepare("
    SELECT species_common_name,
           COUNT(*) as sightings_count,
           AVG(confidence) as avg_confidence,
           MAX(confidence) as max_confidence
    FROM sightings
    WHERE $timeCondition
    GROUP BY species_common_name
    ORDER BY sightings_count DESC
    LIMIT 100
");

$stmt->execute();
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($results);

