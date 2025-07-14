<?php
declare(strict_types=1);

// 🚨 DEBUG: show PHP errors in-browser (remove in production)
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/db.php';  // your PDO $pdo

    // Validate species_code
    $code = $_GET['species_code'] ?? '';
    if (!preg_match('/^[a-z0-9]+$/i', $code)) {
        throw new InvalidArgumentException("Invalid or missing species_code");
    }

    // Fetch DISTINCT dates, joined on common_name, sorted
    $sql = "
      SELECT DISTINCT DATE(s.timestamp) AS day
      FROM sightings s
      LEFT JOIN species_codes sc 
        ON s.species_common_name = sc.species_common_name
      WHERE (s.species_code = :code OR sc.species_code = :code)
        AND s.confidence >= 0.5
      ORDER BY day
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['code' => $code]);

    // Build month→day list
    $days = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // $row['day'] looks like "2025-07-14"
        [$y, $m, $d] = explode('-', $row['day']);
        $monthName = date('F', mktime(0, 0, 0, (int)$m, 1));
        $days[$monthName][] = (int)$d;
    }

    echo json_encode([
        'species_code' => $code,
        'result'       => $days,
    ], JSON_PRETTY_PRINT);

} catch (Throwable $e) {
    // Log full PHP error to your server log
    error_log("get_highlight_days.php error: " . $e->getMessage());
    // Return JSON error
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}

