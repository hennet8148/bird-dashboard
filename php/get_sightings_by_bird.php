<?php
header('Content-Type: application/json');
require_once 'db.php';
require_once 'config.php';

$bird = $_GET['bird'] ?? '';
$timeRange = $_GET['timerange'] ?? 'last_hour';

if (!$bird) {
    echo json_encode([]);
    exit;
}

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

$sql = "
    SELECT timestamp, confidence
    FROM sightings
    WHERE species_common_name = :bird
      AND $timeCondition
";

$params = [':bird' => $bird];

if (!empty($station_id)) {
    $sql .= " AND location = :station_id";
    $params[':station_id'] = $station_id;
}

$sql .= " ORDER BY timestamp DESC LIMIT 1000";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($results);

