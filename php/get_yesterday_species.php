<?php
// php/get_yesterday_species.php
header('Content-Type: application/json');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/config.php'; // gives $pdo, $station

$conf = isset($_GET['conf']) ? floatval($_GET['conf']) : 0.5;

// Compute yesterday start and end timestamps
$yesterdayStart = date('Y-m-d 00:00:00', strtotime('-1 day'));
$yesterdayEnd   = date('Y-m-d 00:00:00'); // today at midnight

$sqlCount = "
  SELECT COUNT(DISTINCT species_common_name) AS count
  FROM sightings
  WHERE confidence >= :conf
    AND timestamp >= :yesterday_start
    AND timestamp < :yesterday_end
";

$sqlList = "
  SELECT DISTINCT species_common_name
  FROM sightings
  WHERE confidence >= :conf
    AND timestamp >= :yesterday_start
    AND timestamp < :yesterday_end
";

$params = [
    ':conf' => $conf,
    ':yesterday_start' => $yesterdayStart,
    ':yesterday_end'   => $yesterdayEnd,
];

if (!empty($station) && strtolower($station) !== 'all') {
    $sqlCount .= " AND location = :station";
    $sqlList  .= " AND location = :station";
    $params[':station'] = $station;
}

// Append ORDER BY *after* possible station filter
$sqlList .= " ORDER BY species_common_name ASC";

try {
    // Fetch count
    $stmt = $pdo->prepare($sqlCount);
    $stmt->execute($params);
    $count = $stmt->fetchColumn();

    // Fetch species list
    $stmt = $pdo->prepare($sqlList);
    $stmt->execute($params);
    $species = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        'count' => intval($count),
        'species_list' => $species
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'details' => $e->getMessage()
    ]);
}

