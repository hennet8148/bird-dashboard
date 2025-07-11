<?php
header('Content-Type: application/json');
require_once 'db.php';
require_once 'config.php';

$conf = isset($_GET['conf']) ? floatval($_GET['conf']) : 0.3;

// Use station filter if defined
$stationClause = '';
$params = [':conf' => $conf];

if (!empty($station_id)) {
    $stationClause = " AND location = :station_id";
    $params[':station_id'] = $station_id;
}

$stmt = $pdo->prepare("
  SELECT COUNT(DISTINCT species_common_name) as count
  FROM sightings
  WHERE confidence >= :conf
  $stationClause
");

$stmt->execute($params);
$count = $stmt->fetchColumn();

echo json_encode(['count' => intval($count)]);

