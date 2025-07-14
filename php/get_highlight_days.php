<?php
require_once 'db.php'; // includes PDO $pdo

header('Content-Type: application/json');

$species_code = $_GET['species_code'] ?? '';
if (!$species_code) {
  echo json_encode(['error' => 'Missing species_code']);
  exit;
}

$query = "
  SELECT DATE(timestamp) as day
  FROM sightings_s2
  WHERE species_code = :code AND confidence >= 0.5
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

echo json_encode($days);
?>

