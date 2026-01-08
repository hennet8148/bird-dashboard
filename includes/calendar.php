<?php
/**
 * BirdMonitor Year Calendar (Jan–Dec, fixed year)
 *
 * - Computes month start weekday dynamically (no hardcoded offsets)
 * - Uses year-scoped day IDs: day-YYYY-month-dd (e.g., day-2025-january-06)
 * - Exposes year in data-calendar-year for JS highlighting
 */

$calendarYear = 2025;

// Month meta: month number => [name, days]
$months = [
  1  => ['January',   31],
  2  => ['February',  28], // leap year handled below
  3  => ['March',     31],
  4  => ['April',     30],
  5  => ['May',       31],
  6  => ['June',      30],
  7  => ['July',      31],
  8  => ['August',    31],
  9  => ['September', 30],
  10 => ['October',   31],
  11 => ['November',  30],
  12 => ['December',  31],
];

// Leap year adjustment
$isLeap = ((int)$calendarYear % 4 === 0 && ((int)$calendarYear % 100 !== 0 || (int)$calendarYear % 400 === 0));
if ($isLeap) {
  $months[2][1] = 29;
}

// Helper: compute start day (0=Su..6=Sa) for a given month/year
function monthStartDow(int $year, int $month): int {
  // PHP 'w' => 0 (Sunday) through 6 (Saturday)
  $dt = new DateTime(sprintf('%04d-%02d-01', $year, $month));
  return (int)$dt->format('w');
}

// Helper: month name slug used in IDs (lowercase)
function monthSlug(string $name): string {
  return strtolower($name);
}
?>

<div class="w-full">
  <!-- Year label -->
  <div class="text-sm font-semibold text-gray-700 mb-2 text-center">
    <?= htmlspecialchars((string)$calendarYear, ENT_QUOTES) ?>
  </div>

  <div id="birdCalendar"
       data-calendar-year="<?= htmlspecialchars((string)$calendarYear, ENT_QUOTES) ?>"
       class="inline-grid grid-cols-4 gap-0 text-[8px] leading-tight text-center">

    <?php foreach ($months as $monthNum => $meta): ?>
      <?php
        $monthName = $meta[0];
        $daysInMonth = (int)$meta[1];
        $startDow = monthStartDow((int)$calendarYear, (int)$monthNum);
        $slug = monthSlug($monthName);
      ?>

      <div class="border rounded bg-gray-50 p-0 w-[96px]">
        <h3 class="text-xs font-semibold bg-gray-200 rounded px-0 py-0 mb-0">
          <?= htmlspecialchars($monthName, ENT_QUOTES) ?>
        </h3>

        <div class="grid grid-cols-7 gap-0">
          <?php
            // Weekday headers
            foreach (['Su','Mo','Tu','We','Th','Fr','Sa'] as $wd) {
              echo "<div class='font-bold text-gray-500'>{$wd}</div>";
            }

            // Leading blanks
            for ($i = 0; $i < $startDow; $i++) {
              echo "<div class='w-4 h-4'></div>";
            }

            // Days
            for ($d = 1; $d <= $daysInMonth; $d++) {
              $dayStr = str_pad((string)$d, 2, '0', STR_PAD_LEFT);
              $id = "day-{$calendarYear}-{$slug}-{$dayStr}";
              echo "<div id='{$id}' class='w-4 h-4 flex items-center justify-center rounded hover:bg-gray-200'>{$d}</div>";
            }
          ?>
        </div>
      </div>
    <?php endforeach; ?>

  </div>
</div>

<script type="module">
  import { highlightCalendarDays } from '/dashboard/js/highlightCalendarDays.js';

  const cal = document.getElementById('birdCalendar');
  const year = cal?.dataset?.calendarYear ? parseInt(cal.dataset.calendarYear, 10) : 2025;

  if (window.speciesCode) {
    highlightCalendarDays(window.speciesCode, { year });
  }
</script>

