<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require_once 'db.php'; // includes $pdo
header('Content-Type: application/json');

$species_code = $_GET['species_code'] ?? '';
if (!$species_code) {
  echo json_encode(['error' => 'Missing species_code']);
  exit;
}

// Threshold can be adjusted here
$confidence_threshold = 0.255555;

// Hourly counts
$query_counts = "
  SELECT HOUR(s.timestamp) AS hour, COUNT(*) AS count
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = :code
    AND s.confidence >= :conf
  GROUP BY HOUR(s.timestamp)
  ORDER BY hour
";

$stmt = $pdo->prepare($query_counts);
$stmt->execute(['code' => $species_code, 'conf' => $confidence_threshold]);

$hourly_counts = array_fill(0, 24, 0);
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
  $hour = str_pad((int)$row['hour'], 2, '0', STR_PAD_LEFT);
  $hourly_counts[$hour] = (int)$row['count'];
}

// Summary stats
$query_stats = "
  SELECT COUNT(*) AS total, AVG(s.confidence) AS avg_conf, MAX(s.confidence) AS max_conf
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = :code
    AND s.confidence >= :conf
";

$stmt = $pdo->prepare($query_stats);
$stmt->execute(['code' => $species_code, 'conf' => $confidence_threshold]);
$stats = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
  'species_code' => $species_code,
  'hourly_counts' => $hourly_counts,
  'total_detections' => (int) $stats['total'],
  'average_confidence' => round((float) $stats['avg_conf'], 3),
  'max_confidence' => round((float) $stats['max_conf'], 3)
]);

