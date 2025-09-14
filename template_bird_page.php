<?php
  $species_common_name = '{{common_name}}';
  $scientific_name = '{{sci_name}}';
  $species_code = '{{species_code}}';
  $aab_url = '{{aab_url}}';
  $page_title = "$species_common_name | Davidson Farm Bird Project";
  $meta_description = "Sightings and data for $species_common_name at Davidson Farm Bird Project.";
  include(__DIR__ . '/../includes/static-header.php');
?>

<!-- Inject species code early so all components can pick it up -->
<script>
  window.speciesCode = "<?php echo $species_code; ?>";
</script>

<div class="max-w-5xl mx-auto p-6">

  <!-- Optional "back" link -->
  <div class="mb-4">
    <a href="/dashboard/species.html" class="text-sm text-blue-600 hover:underline">&larr; Browse all species</a>
  </div>

  <!-- Heading -->
  <h1 class="text-3xl font-serif mt-2 mb-1"><?php echo $species_common_name; ?></h1>
  <p class="text-gray-600 italic text-lg mb-4"><?php echo $scientific_name; ?></p>

  <!-- Orientation block for first-time visitors -->
  <div class="bg-blue-50 border border-blue-100 text-sm text-gray-700 p-4 rounded mb-6 leading-relaxed">
    You’ve landed on a species-specific page from the <strong>Davidson Farm Bird Project</strong>, a passive acoustic monitoring system that listens for bird vocalizations 24/7 using AI.
    <br><br>
    Below, you’ll find visualizations showing when the <strong><?php echo $species_common_name; ?></strong> has been detected on our northeastern Pennsylvania farm — including daily presence, hourly patterns, and historical trends.
  </div>

  <!-- External Learn More link -->
  <p class="mb-8">
    Learn more about this species at:
    <a href="<?php echo $aab_url; ?>" class="text-blue-600 underline" target="_blank">
      Cornell Lab of Ornithology — All About Birds
    </a>
  </p>

  <!-- Tight calendar block -->
  <div class="border-t pt-6 mt-6 flex justify-center">
    <div class="rounded-lg border border-gray-300 bg-gray-50 p-4">
      <div class="w-[412px]">
        <p class="text-sm mb-3 text-gray-700 text-center">
          This calendar shows the days that <strong><?php echo $species_common_name; ?></strong> was detected with confidence <strong>0.50 or greater</strong>.
          Detections began June 24, 2025.
        </p>
        <div id="speciesDashboard" class="text-xs">
          <?php include __DIR__ . '/../includes/calendar.php'; ?>
        </div>
      </div>
    </div>
  </div>

  <!-- Daily detection trend chart block -->
  <div class="mt-10 flex justify-center">
    <?php include __DIR__ . '/../includes/daily_trend_chart.php'; ?>
  </div>

  <!-- Hourly detection widget block -->
  <div class="mt-10 flex justify-center">
    <div class="rounded-lg border border-gray-300 bg-gray-50 p-4">
      <div class="w-[412px]">
        <p class="text-sm mb-3 text-gray-700 text-center">
          Hourly audio detections for <strong><?php echo $species_common_name; ?></strong> since June 24, 2025.
          For species with fewer strong matches, lower-confidence detections may also be included to highlight patterns.
        </p>
        <div id="hourlyChart" class="text-xs">
          <?php include __DIR__ . '/../includes/hourly_widget.php'; ?>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer links -->
  <div class="mt-12 text-sm text-center text-gray-500 border-t pt-6">
    <p class="mb-2">Explore more:</p>
    <a href="/dashboard/species.html" class="text-blue-600 hover:underline mx-2">All species</a> |
    <a href="/dashboard/index.html" class="text-blue-600 hover:underline mx-2">Main Dashboard</a> |
    <a href="/" class="text-blue-600 hover:underline mx-2">DFBP Home</a>
  </div>

</div>

<?php include(__DIR__ . '/../includes/static-footer.php'); ?>

