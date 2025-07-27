<?php
// File: php/get_species_timeseries.php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$species_code = $_GET['species_code'] ?? '';
if (!$species_code) {
  echo json_encode(['error' => 'Missing species_code']);
  exit;
}

// Optional: change this if you want a different cutoff
$confidence_threshold = 0.25;

// Query for daily counts grouped by date and station
$sql = "
  SELECT 
    DATE(s.timestamp) AS date,
    s.location AS station,
    COUNT(*) AS count
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = :code
    AND s.confidence >= :conf
  GROUP BY DATE(s.timestamp), s.location
  ORDER BY DATE(s.timestamp)
";

$stmt = $pdo->prepare($sql);
$stmt->execute([
  'code' => $species_code,
  'conf' => $confidence_threshold
]);

$raw = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Structure data: one row per date, with optional S1/S2 values
$grouped = [];
foreach ($raw as $row) {
  $date = $row['date'];
  $station = $row['station'];
  $count = (int) $row['count'];

  if (!isset($grouped[$date])) {
    $grouped[$date] = ['date' => $date];
  }
  $grouped[$date][$station] = $count;
}

// Return as sorted array
$output = array_values($grouped);
echo json_encode($output);

