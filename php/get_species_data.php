<?php
require_once 'db.php';
require_once 'config.php';

header('Content-Type: application/json');

$name = isset($_GET['name']) ? trim($_GET['name']) : '';

if (!$name) {
    echo json_encode([]);
    exit;
}

try {
    $sql = "
        SELECT timestamp, confidence
        FROM sightings
        WHERE species_common_name = :name
    ";

    $params = [':name' => $name];

    if (!empty($station)) {
        $sql .= " AND location = :station";
        $params[':station'] = $station;
    }

    $sql .= " ORDER BY timestamp DESC LIMIT 100";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}

