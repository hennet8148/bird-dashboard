<!-- File: includes/hourly_widget.php -->
<div class="w-[412px] border border-gray-300 bg-gray-50 p-4 rounded-lg mt-6">
  <h2 class="text-sm font-semibold text-gray-800 mb-3 text-center">Hourly Activity Pattern</h2>
  <p class="text-[10px] text-gray-600 text-center mb-3">
    Relative number of detections per hour for <strong><?php echo htmlspecialchars($_GET['common_name'] ?? '') ?></strong>.
    Values are scaled to fit the box and emphasize active hours.
  </p>

  <!-- **New canvas container** -->
  <div class="relative" style="height:200px;">
    <canvas id="hourlyWidget"></canvas>
  </div>
  <!-- Summary text will go here -->
  <div id="hourlyWidgetSummary" class="mt-4 text-[10px] text-gray-600 text-center"></div>
</div>

<script type="module">
  import { renderHourlyWidget } from "/dashboard/js/hourlyActivityWidget.js";
  renderHourlyWidget(window.speciesCode);
</script>

