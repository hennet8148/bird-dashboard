<?php
header('Content-Type: application/json');
require_once 'db.php';

$conf = isset($_GET['conf']) ? floatval($_GET['conf']) : 0.3;

$stmt = $pdo->prepare("
  SELECT COUNT(DISTINCT species_common_name) as count
  FROM sightings
  WHERE confidence >= :conf
");
$stmt->execute(['conf' => $conf]);
$count = $stmt->fetchColumn();

echo json_encode(['count' => intval($count)]);

