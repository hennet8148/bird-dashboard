<?php
// get_species_data.php
require_once 'db.php';

header('Content-Type: application/json');

$name = isset($_GET['name']) ? trim($_GET['name']) : '';

if (!$name) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT timestamp, confidence
        FROM sightings
        WHERE species_common_name = :name
        ORDER BY timestamp DESC
        LIMIT 100
    ");
    $stmt->execute(['name' => $name]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>

