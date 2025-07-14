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

$query = "
  SELECT HOUR(s.timestamp) AS hour, COUNT(*) AS count
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = :code
    AND s.confidence >= 0.5
  GROUP BY HOUR(s.timestamp)
  ORDER BY hour
";

$stmt = $pdo->prepare($query);
$stmt->execute(['code' => $species_code]);

$results = array_fill(0, 24, 0);
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
  $hour = str_pad((int)$row['hour'], 2, '0', STR_PAD_LEFT);
  $results[$hour] = (int)$row['count'];
}

echo json_encode([
  'species_code' => $species_code,
  'hourly_counts' => $results
]);

