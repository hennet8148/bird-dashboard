<?php
header('Content-Type: application/json');
require_once 'db.php';
require_once 'config.php';

$conf = isset($_GET['conf']) ? floatval($_GET['conf']) : 0.3;

// Use station filter if defined
$stationClause = '';
$params = [':conf' => $conf];

if (!empty($station)) {
    $stationClause = " AND location = :station";
    $params[':station'] = $station;
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

