<?php
// bird.php — router to create and redirect to a species static page using PDO

require_once __DIR__ . '/php/db.php';

$code = $_GET['code'] ?? '';
$code = preg_replace('/[^a-z0-9]/', '', strtolower($code)); // sanitize

if (!$code) {
    http_response_code(400);
    exit('Missing or invalid species code.');
}

$targetFile = __DIR__ . "/$code.php";

// Redirect immediately if the file already exists
if (file_exists($targetFile)) {
    // Uncomment when you want to redirect instead of debug
 header("Location: $code.php");
 exit;
    echo "✅ File already exists: $targetFile\n";
    exit;
}

try {
    // Query species data from species_codes table
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

    // Validate template file
    $templateFile = __DIR__ . "/template_bird_page.php";
    if (!file_exists($templateFile)) {
        http_response_code(500);
        exit("❌ Template file not found: $templateFile");
    }

    if (!is_readable($templateFile)) {
        http_response_code(500);
        exit("❌ Template file not readable: $templateFile");
    }

    if (!is_writable(__DIR__)) {
        http_response_code(500);
        exit("❌ Directory not writable: " . __DIR__);
    }

    $template = file_get_contents($templateFile);
    if ($template === false) {
        http_response_code(500);
        exit("❌ Failed to read template file.");
    }

    // Populate template with species data
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

    // Debug info
    echo "🔧 Attempting to write file: $targetFile\n";
    echo "✏️ Template data (first 200 chars):\n" . substr($page, 0, 200) . "\n\n";

    // Write the species page
    if (!file_put_contents($targetFile, $page)) {
        http_response_code(500);
        exit("❌ Failed to create species page: $targetFile");
    }

    echo "✅ Page written successfully.\n";

    // Uncomment to redirect after page creation
    header("Location: $code.php");
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    exit("❌ Database error: " . $e->getMessage());
}

