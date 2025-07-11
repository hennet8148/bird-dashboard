<?php
// php/config.php
$station = $_POST['station'] ?? $_GET['station'] ?? null;

// Toggle this to enable/disable debug output globally
define('DEBUG_MODE', true);

/**
 * Log a debug message if DEBUG_MODE is enabled.
 *
 * @param string $msg The debug message to log.
 */
function debug_log($msg) {
    if (DEBUG_MODE) {
        $logDir = __DIR__ . '/../log';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0775, true);
        }
        $logFile = $logDir . '/debug.log';
        error_log($msg . "\n", 3, $logFile);
    }
}

