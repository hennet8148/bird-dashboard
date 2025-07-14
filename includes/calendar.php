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
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 text-[9px] leading-tight text-center">
  <?php foreach ($calendar_data as $month => $meta): ?>
    <div class="border rounded bg-gray-50 p-1 w-[110px] mx-auto">
      <h3 class="text-xs font-semibold bg-gray-200 rounded px-1 py-0.5 mb-0.5"><?php echo $month; ?></h3>
      <div class="grid grid-cols-7 gap-[1px]">
        <?php
          // Weekday headers
          foreach (['Su','Mo','Tu','We','Th','Fr','Sa'] as $wd) {
            echo "<div class='font-bold text-gray-500'>{$wd}</div>";
          }
          // Empty slots
          for ($i = 0; $i < $meta['start']; $i++) {
            echo "<div class='w-5 h-5'></div>";
          }
          // Day cells
          for ($d = 1; $d <= $meta['days']; $d++) {
            $id = 'day-'.strtolower($month).'-'.str_pad($d,2,'0',STR_PAD_LEFT);
            echo "<div id='{$id}' class='w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200'>{$d}</div>";
          }
        ?>
      </div>
    </div>
  <?php endforeach; ?>
</div>

<script type="module">
  import { highlightCalendarDays } from '/birds/js/highlightCalendarDays.js';
  if (window.speciesCode) {
    highlightCalendarDays(window.speciesCode);
  }
</script>

