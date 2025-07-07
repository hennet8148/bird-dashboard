<?php
// bird.php — router to create and redirect to a species static page using PDO

require_once '../php/db.php';

$code = $_GET['code'] ?? '';
$code = preg_replace('/[^a-z0-9]/', '', strtolower($code)); // sanitize

if (!$code) {
    http_response_code(400);
    exit('Missing or invalid species code.');
}

$targetFile = __DIR__ . "/$code.php";

// Redirect immediately if the file already exists
if (file_exists($targetFile)) {
    header("Location: $code.php");
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT species_code, species_common_name, scientific_name, slug, aab_url FROM species WHERE species_code = ?");
    $stmt->execute([$code]);
    $species = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$species) {
        http_response_code(404);
        exit("Species code not found in database.");
    }

    $templateFile = __DIR__ . "/template_bird_page.php";
    if (!file_exists($templateFile)) {
        http_response_code(500);
        exit("Template file not found.");
    }

    $template = file_get_contents($templateFile);

    $page = str_replace(
        ['{{common_name}}', '{{sci_name}}', '{{slug}}', '{{aab_url}}', '{{species_code}}'],
        [
            htmlspecialchars($species['species_common_name']),
            htmlspecialchars($species['scientific_name']),
            htmlspecialchars($species['slug']),
            htmlspecialchars($species['aab_url']),
            htmlspecialchars($species['species_code']),
        ],
        $template
    );

    if (!file_put_contents($targetFile, $page)) {
        http_response_code(500);
        exit("Failed to create species page.");
    }

    header("Location: $code.php");
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    exit("Database error: " . $e->getMessage());
}

