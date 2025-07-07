<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'db.php';

$timeRange = $_GET['timerange'] ?? 'last_hour';

switch ($timeRange) {
    case 'last_hour':
        $timeCondition = "s.timestamp >= NOW() - INTERVAL 1 HOUR";
        break;
    case 'today':
        $timeCondition = "DATE(s.timestamp) = CURDATE()";
        break;
    case 'yesterday':
        $timeCondition = "DATE(s.timestamp) = CURDATE() - INTERVAL 1 DAY";
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
    GROUP BY s.species_common_name, sc.species_code
    ORDER BY sightings_count DESC
    LIMIT 100
";

$stmt = $pdo->prepare($sql);
$stmt->execute();
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($results);

