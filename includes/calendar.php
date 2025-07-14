<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[10px] leading-none text-center">
  <!-- January 2025 -->
  <div class="border rounded bg-gray-50 p-2 w-[140px] mx-auto">
    <h3 class="text-sm font-semibold bg-gray-200 rounded px-2 py-1 mb-1">January</h3>
    <div class="grid grid-cols-7 gap-[2px]">
      <?php
        // Weekday headers
        $weekdays = ['Su','Mo','Tu','We','Th','Fr','Sa'];
        foreach ($weekdays as $day) {
          echo "<div class='font-bold text-gray-500'>$day</div>";
        }

        // January 2025 starts on a Wednesday, so we need 3 blanks
        for ($i = 0; $i < 3; $i++) {
          echo "<div class='w-6 h-6'></div>";
        }

        // Render days 1–31
        for ($d = 1; $d <= 31; $d++) {
          echo "<div class='w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200'>$d</div>";
        }
      ?>
    </div>
  </div>
</div>

