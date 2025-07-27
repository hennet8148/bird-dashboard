<!-- File: includes/daily_trend_chart.php -->
<div class="w-full max-w-5xl border border-gray-300 bg-gray-50 p-4 rounded-lg mt-6">
  <h2 class="text-sm font-semibold text-gray-800 mb-3 text-center">Daily Detection Trend</h2>
  <p class="text-[10px] text-gray-600 text-center mb-3">
    Detections of <strong><?php echo htmlspecialchars($_GET['common_name'] ?? '') ?></strong> by day since monitoring began.
    Each line represents one recording station. Patterns may reflect migration, habitat shifts, or microphone coverage.
  </p>
  <canvas id="speciesTrendChart" class="w-full h-[300px]"></canvas>
</div>

<script type="module">
  import { renderSpeciesTrendChart } from "/dashboard/js/trendLineChart.js";
  renderSpeciesTrendChart(window.speciesCode);
</script>

