<?php
// php/get_yesterday_species.php
header('Content-Type: application/json');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/config.php'; // gives $pdo and $station

$conf = isset($_GET['conf']) ? floatval($_GET['conf']) : 0.5;
$yesterday = date('Y-m-d', strtotime('-1 day'));

$sql = "
  SELECT COUNT(DISTINCT species_common_name) AS count
  FROM sightings
  WHERE confidence >= :conf
    AND DATE(timestamp) = :yesterday
";

$params = [
    ':conf' => $conf,
    ':yesterday' => $yesterday
];

// apply station filter if not "All"
if (!empty($station) && strtolower($station) !== 'all') {
    $sql .= " AND location = :station";
    $params[':station'] = $station;
}

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $count = $stmt->fetchColumn();

    echo json_encode(['count' => intval($count)]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'details' => $e->getMessage()
    ]);
}

