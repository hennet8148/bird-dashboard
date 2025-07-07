<?php
// bird.php — create and redirect to a species static page using PDO

require_once __DIR__ . '/php/db.php';

// Get and sanitize species code
$code = $_GET['code'] ?? '';
$code = preg_replace('/[^a-z0-9]/', '', strtolower($code));

if (!$code) {
    http_response_code(400);
    exit('Missing or invalid species code.');
}

// Create species directory if needed
$speciesDir = __DIR__ . '/species';
if (!is_dir($speciesDir)) {
    if (!mkdir($speciesDir, 0755, true)) {
        http_response_code(500);
        exit("❌ Failed to create directory: $speciesDir");
    }
}

$targetFile = "$speciesDir/$code.php";

// Redirect immediately if the file already exists
if (file_exists($targetFile)) {
    header("Location: species/$code.php");
    exit;
}

try {
    // Look up species info
    $stmt = $pdo->prepare("
        SELECT 
            species_code, 
            species_common_name, 
            scientific_name, 
            url_slug AS slug, 
            external_link AS aab_url 
        FROM species_codes 
        WHERE species_code = ?
    ");
    $stmt->execute([$code]);
    $species = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$species) {
        http_response_code(404);
        exit("Species code not found in database.");
    }

    // Validate and read template
    $templateFile = __DIR__ . '/template_bird_page.php';
    if (!file_exists($templateFile) || !is_readable($templateFile)) {
        http_response_code(500);
        exit("❌ Template not found or unreadable: $templateFile");
    }

    $template = file_get_contents($templateFile);
    if ($template === false) {
        http_response_code(500);
        exit("❌ Failed to read template file.");
    }

    // Replace placeholders
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

    // Write new species file
    if (!file_put_contents($targetFile, $page)) {
        http_response_code(500);
        exit("❌ Failed to write species page: $targetFile");
    }

    // Redirect to the new static page
    header("Location: species/$code.php");
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    exit("❌ Database error: " . $e->getMessage());
}

