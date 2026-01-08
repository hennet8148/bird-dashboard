-- get_sightings_by_timerange.php
EXPLAIN FORMAT=JSON
SELECT 
        sc.species_code,
        s.species_common_name,
        COUNT(*) AS sightings_count,
        AVG(s.confidence) AS avg_confidence,
        MAX(s.confidence) AS max_confidence
    FROM sightings s
    INNER JOIN species_codes sc
        ON TRIM(LOWER(s.species_common_name)) = TRIM(LOWER(sc.species_common_name))
    WHERE 1=1
    1=1
    GROUP BY s.species_common_name, sc.species_code
    ORDER BY sightings_count DESC
    LIMIT 100
";

-- get_hourly_distribution.php
EXPLAIN FORMAT=JSON
SELECT HOUR(s.timestamp) AS hour, COUNT(*) AS count
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = 'TEST'
    AND s.confidence >= 0.5
  GROUP BY HOUR(s.timestamp)
  ORDER BY hour
";

-- get_hourly_distribution.php
EXPLAIN FORMAT=JSON
SELECT COUNT(*) AS total, AVG(s.confidence) AS avg_conf, MAX(s.confidence) AS max_conf
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = 'TEST'
    AND s.confidence >= 0.5
";

-- get_highlight_days.php
EXPLAIN FORMAT=JSON
SELECT DATE(s.timestamp) AS day
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = 'TEST'
    AND s.confidence >= 0.5
";

-- get_sightings_by_bird.php
EXPLAIN FORMAT=JSON
SELECT timestamp, confidence
    FROM sightings
    WHERE species_common_name = 'Wood Thrush'
      AND 1=1
";

-- get_summary.php
EXPLAIN FORMAT=JSON
SELECT 
                COUNT(*) AS total_sightings,
                COUNT(DISTINCT species_common_name) AS total_species
            FROM sightings";

-- get_species_yesterday.php
EXPLAIN FORMAT=JSON
SELECT DISTINCT species_common_name
        FROM sightings
        WHERE confidence >= 0.5
          AND DATE(timestamp) = CURDATE() - INTERVAL 1 DAY
    ";

-- get_unique_species.php
EXPLAIN FORMAT=JSON
SELECT DISTINCT species_common_name
    FROM sightings
   WHERE confidence >= 0.5
";

-- weather.php
EXPLAIN FORMAT=JSON
SELECT *
        FROM weather_readings
        ORDER BY timestamp DESC
        LIMIT 1
    ;-- stats.php
EXPLAIN FORMAT=JSON
SELECT COUNT(*) FROM 1=1 WHERE 1=1 1=1")->fetchColumn();

-- stats.php
EXPLAIN FORMAT=JSON
SELECT COUNT(DISTINCT species_common_name) FROM 1=1 WHERE 1=1 1=1")->fetchColumn();

-- stats.php
EXPLAIN FORMAT=JSON
SELECT MAX(timestamp) FROM 1=1 WHERE timestamp IS NOT NULL 1=1;-- stats.php
EXPLAIN FORMAT=JSON
SELECT start_date FROM station_codes WHERE station_id = 'S1';-- stats.php
EXPLAIN FORMAT=JSON
SELECT COUNT(DISTINCT species_common_name)
            FROM 1=1
            WHERE confidence >= 0.5
              AND DATE(timestamp) = '2025-09-20'
              1=1
        ";

-- get_species_data.php
EXPLAIN FORMAT=JSON
SELECT timestamp, confidence
        FROM sightings
        WHERE species_common_name = 'Wood Thrush'
    ";

-- get_yesterday_species.php
EXPLAIN FORMAT=JSON
SELECT COUNT(DISTINCT species_common_name) AS count
  FROM sightings
  WHERE confidence >= 0.5
    AND DATE(timestamp) = '2025-09-20'
";

-- get_yesterday_species.php
EXPLAIN FORMAT=JSON
SELECT DISTINCT species_common_name
  FROM sightings
  WHERE confidence >= 0.5
    AND DATE(timestamp) = '2025-09-20'
  ORDER BY species_common_name ASC
";

-- get_species_by_confidence.php
EXPLAIN FORMAT=JSON
SELECT DISTINCT species_common_name 
        FROM sightings 
        WHERE confidence >= 0.5
    ";

-- species_list.php
EXPLAIN FORMAT=JSON
SELECT DISTINCT species_common_name FROM sightings";

-- test_db.php
EXPLAIN FORMAT=JSON
SELECT COUNT(*) AS count FROM sightings;-- get_species_timeseries.php
EXPLAIN FORMAT=JSON
SELECT 
    DATE(s.`timestamp`) AS `date`,
    s.`location`        AS `station`,
    COUNT(*)            AS `count`
  FROM `sightings` s
  JOIN `species_codes` sc 
    ON s.`species_common_name` = sc.`species_common_name`
  WHERE sc.`species_code` = 'TEST'
  GROUP BY DATE(s.`timestamp`), s.`location`
  ORDER BY DATE(s.`timestamp`)
";
