<?php
// php/db.php — database connection

$host = 'localhost'; // or use 127.0.0.1 if needed
$db   = 'birdnet_db';
$user = 'birdnet_user';
$pass = 'BIRD.stuff.NOW123!';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo "Database connection failed: " . $e->getMessage();
    exit;
}
?>

