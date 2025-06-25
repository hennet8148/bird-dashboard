<?php
// php/test_db.php

require_once 'db.php';

$stmt = $pdo->query("SELECT COUNT(*) AS count FROM sightings");
$row = $stmt->fetch();

echo "Total sightings in DB: " . $row['count'];
?>

