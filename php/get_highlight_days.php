<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require_once 'db.php'; // includes PDO $pdo

header('Content-Type: application/json');

$species_code = $_GET['species_code'] ?? '';
if (!$species_code) {
  echo json_encode(['error' => 'Missing species_code']);
  exit;
}

$year = isset($_GET['year']) ? (int)$_GET['year'] : 2025;
if ($year < 2000 || $year > 2100) {
  echo json_encode(['error' => 'Invalid year']);
  exit;
}

$start = sprintf('%04d-01-01', $year);
$end   = sprintf('%04d-01-01', $year + 1);

$query = "
  SELECT DATE(s.timestamp) AS day
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = :code
    AND s.confidence >= 0.5
    AND s.timestamp >= :start
    AND s.timestamp <  :end
";

$stmt = $pdo->prepare($query);
$stmt->execute([
  'code'  => $species_code,
  'start' => $start,
  'end'   => $end,
]);

$days = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
  $parts = explode('-', $row['day']); // YYYY-MM-DD
  if (count($parts) === 3) {
    $month = date('F', mktime(0, 0, 0, (int)$parts[1], 1));
    $day   = (int)$parts[2];
    $days[$month][] = $day;
  }
}

echo json_encode([
  'species_code' => $species_code,
  'year' => $year,
  'result' => $days
]);

