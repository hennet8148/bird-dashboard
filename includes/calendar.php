<?php
$calendar_data = [
  'January'   => ['start' => 3, 'days' => 31],
  'February'  => ['start' => 6, 'days' => 28],
  'March'     => ['start' => 6, 'days' => 31],
  'April'     => ['start' => 2, 'days' => 30],
  'May'       => ['start' => 4, 'days' => 31],
  'June'      => ['start' => 0, 'days' => 30],
  'July'      => ['start' => 2, 'days' => 31],
  'August'    => ['start' => 5, 'days' => 31],
  'September' => ['start' => 1, 'days' => 30],
  'October'   => ['start' => 3, 'days' => 31],
  'November'  => ['start' => 6, 'days' => 30],
  'December'  => ['start' => 1, 'days' => 31],
];
?>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[10px] leading-none text-center">
  <?php foreach ($calendar_data as $month => $meta): ?>
    <div class="border rounded bg-gray-50 p-2 w-[140px] mx-auto">
      <h3 class="text-sm font-semibold bg-gray-200 rounded px-2 py-1 mb-1">
        <?php echo $month; ?>
      </h3>
      <div class="grid grid-cols-7 gap-[2px]">
        <?php
          // Weekday headers
          $weekdays = ['Su','Mo','Tu','We','Th','Fr','Sa'];
          foreach ($weekdays as $wd) {
            echo "<div class='font-bold text-gray-500'>{$wd}</div>";
          }

          // Empty slots to align the first day
          for ($i = 0; $i < $meta['start']; $i++) {
            echo "<div class='w-6 h-6'></div>";
          }

          // Day cells with unique IDs
          for ($d = 1; $d <= $meta['days']; $d++) {
            $id = 'day-' . strtolower($month) . '-' . str_pad($d, 2, '0', STR_PAD_LEFT);
            echo "<div id='{$id}' class='w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200'>{$d}</div>";
          }
        ?>
      </div>
    </div>
  <?php endforeach; ?>
</div>

<!-- Load the highlighting module and run it -->
<script type="module">
  import { highlightCalendarDays } from '/birds/js/highlightCalendarDays.js';
  if (window.speciesCode) {
    highlightCalendarDays(window.speciesCode);
  }
</script>

