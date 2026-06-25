<!-- File: includes/daily_trend_chart.php -->

<div class="w-full max-w-5xl mx-auto border border-gray-300 bg-gray-50 p-4 rounded-lg mt-6">
  <h2 class="text-sm font-semibold text-gray-800 mb-1 text-center">
    Daily Detection Trend — Year 1
  </h2>

  <p class="text-[10px] text-gray-600 text-center mb-3">
    June 24, 2025 through June 23, 2026. Stacked bars showing total detections of
    <strong><?php echo htmlspecialchars($_GET['common_name'] ?? '') ?></strong>
    by day. Each bar is divided by station: dark for Station S1, blue for Station S2, and red for Station S3.
    Days without detections appear as blank gaps.
  </p>

  <div style="position: relative; width: 100%; height: 300px;">
    <canvas id="speciesTrendChartYear1"></canvas>
  </div>
</div>

<div class="w-full max-w-5xl mx-auto border border-gray-300 bg-gray-50 p-4 rounded-lg mt-8">
  <h2 class="text-sm font-semibold text-gray-800 mb-1 text-center">
    Daily Detection Trend — Year 2
  </h2>

  <p class="text-[10px] text-gray-600 text-center mb-3">
    June 24, 2026 through June 23, 2027. Stacked bars showing total detections of
    <strong><?php echo htmlspecialchars($_GET['common_name'] ?? '') ?></strong>
    by day. Each bar is divided by station: dark for Station S1, blue for Station S2, and red for Station S3.
    This chart will fill in as the second project year accumulates.
  </p>

  <div style="position: relative; width: 100%; height: 300px;">
    <canvas id="speciesTrendChartYear2"></canvas>
  </div>
</div>

<script type="module">
  import { renderSpeciesTrendCharts } from "/dashboard/js/trendLineChart.js";
  renderSpeciesTrendCharts(window.speciesCode);
</script>
