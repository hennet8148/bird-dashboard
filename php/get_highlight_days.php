<?php
require_once 'db.php'; // includes PDO $pdo

header('Content-Type: application/json');

$species_code = $_GET['species_code'] ?? '';
if (!$species_code) {
  echo json_encode(['error' => 'Missing species_code']);
  exit;
}

$query = "
  SELECT DATE(s.timestamp) AS day
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = :code
    AND s.confidence >= 0.5
";

$stmt = $pdo->prepare($query);
$stmt->execute(['code' => $species_code]);

$days = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
  $parts = explode('-', $row['day']);
  if (count($parts) === 3) {
    $year = $parts[0];
    $month = date('F', mktime(0, 0, 0, (int)$parts[1], 1));
    $day = (int)$parts[2];
    $days[$month][] = $day;
  }
}

echo json_encode([
  'species_code' => $species_code,
  'result' => $days
]);

