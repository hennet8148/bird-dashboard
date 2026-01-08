-- get_sightings_by_timerange.php
SELECT 
        sc.species_code,
        s.species_common_name,
        COUNT(*) AS sightings_count,
        AVG(s.confidence) AS avg_confidence,
        MAX(s.confidence) AS max_confidence
    FROM sightings s
    INNER JOIN species_codes sc
        ON TRIM(LOWER(s.species_common_name)) = TRIM(LOWER(sc.species_common_name))
    WHERE ?
    ?
    GROUP BY s.species_common_name, sc.species_code
    ORDER BY sightings_count DESC
    LIMIT 100
";

-- get_hourly_distribution.php
SELECT HOUR(s.timestamp) AS hour, COUNT(*) AS count
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = :code
    AND s.confidence >= :conf
  GROUP BY HOUR(s.timestamp)
  ORDER BY hour
";

-- get_hourly_distribution.php
SELECT COUNT(*) AS total, AVG(s.confidence) AS avg_conf, MAX(s.confidence) AS max_conf
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = :code
    AND s.confidence >= :conf
";

-- get_highlight_days.php
SELECT DATE(s.timestamp) AS day
  FROM sightings s
  JOIN species_codes sc ON s.species_common_name = sc.species_common_name
  WHERE sc.species_code = :code
    AND s.confidence >= 0.5
";

-- get_sightings_by_bird.php
SELECT timestamp, confidence
    FROM sightings
    WHERE species_common_name = :bird
      AND ?
";

-- get_summary.php
SELECT 
                COUNT(*) AS total_sightings,
                COUNT(DISTINCT species_common_name) AS total_species
            FROM sightings";

-- get_species_yesterday.php
SELECT DISTINCT species_common_name
        FROM sightings
        WHERE confidence >= :threshold
          AND DATE(timestamp) = CURDATE() - INTERVAL 1 DAY
    ";

-- get_unique_species.php
SELECT DISTINCT species_common_name
    FROM sightings
   WHERE confidence >= :conf
";

-- weather.php
SELECT *
        FROM weather_readings
        ORDER BY timestamp DESC
        LIMIT 1
    ");

-- stats.php
SELECT COUNT(*) FROM ? WHERE 1=1 ?")->fetchColumn();

-- stats.php
SELECT COUNT(DISTINCT species_common_name) FROM ? WHERE 1=1 ?")->fetchColumn();

-- stats.php
SELECT MAX(timestamp) FROM ? WHERE timestamp IS NOT NULL ?");

-- stats.php
SELECT start_date FROM station_codes WHERE station_id = :station_id");

-- stats.php
SELECT COUNT(DISTINCT species_common_name)
            FROM ?
            WHERE confidence >= :conf
              AND DATE(timestamp) = :yesterday
              ?
        ";

-- get_species_data.php
SELECT timestamp, confidence
        FROM sightings
        WHERE species_common_name = :name
    ";

-- get_yesterday_species.php
SELECT COUNT(DISTINCT species_common_name) AS count
  FROM sightings
  WHERE confidence >= :conf
    AND DATE(timestamp) = :yesterday
";

-- get_yesterday_species.php
SELECT DISTINCT species_common_name
  FROM sightings
  WHERE confidence >= :conf
    AND DATE(timestamp) = :yesterday
  ORDER BY species_common_name ASC
";

-- get_species_by_confidence.php
SELECT DISTINCT species_common_name 
        FROM sightings 
        WHERE confidence >= :threshold
    ";

-- species_list.php
SELECT DISTINCT species_common_name FROM sightings";

-- test_db.php
SELECT COUNT(*) AS count FROM sightings");

-- get_species_timeseries.php
SELECT 
    DATE(s.`timestamp`) AS `date`,
    s.`location`        AS `station`,
    COUNT(*)            AS `count`
  FROM `sightings` s
  JOIN `species_codes` sc 
    ON s.`species_common_name` = sc.`species_common_name`
  WHERE sc.`species_code` = :code
  GROUP BY DATE(s.`timestamp`), s.`location`
  ORDER BY DATE(s.`timestamp`)
";
