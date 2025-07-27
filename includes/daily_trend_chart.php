<!-- File: includes/daily_trend_chart.php -->
<div class="w-full max-w-5xl mx-auto border border-gray-300 bg-gray-50 p-4 rounded-lg mt-6">
  <h2 class="text-sm font-semibold text-gray-800 mb-3 text-center">Daily Detection Trend</h2>
  <p class="text-[10px] text-gray-600 text-center mb-3">
    Stacked bars showing total detections of <strong><?php echo htmlspecialchars($_GET['common_name'] ?? '') ?></strong> by day since monitoring began.
    Each bar is divided into two segments—dark for Station S1 and blue for Station S2—so you can compare activity across sites. Days without any detections will appear as blank gaps.
  </p>

  <!-- Chart container: fixed height, full width -->
  <div style="position: relative; width: 100%; height: 300px;">
    <canvas id="speciesTrendChart"></canvas>
  </div>
</div>

<script type="module">
  import { renderSpeciesTrendChart } from "/dashboard/js/trendLineChart.js";
  renderSpeciesTrendChart(window.speciesCode);
</script>

