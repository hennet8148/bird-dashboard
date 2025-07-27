<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Sightings and data for {{common_name}} at Davidson Farm Bird Project.">
  <title>{{common_name}} | Davidson Farm Bird Project</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> <!-- ✅ Add this line -->
</head>
<body class="bg-white text-gray-800">

  <!-- Inject species code early so all components can pick it up -->
  <script>
    window.speciesCode = "{{species_code}}";
  </script>

  <div class="max-w-5xl mx-auto p-6">
    <a href="javascript:history.back()" class="text-sm text-blue-600 hover:underline">&larr; Return to Previous Page</a>

    <h1 class="text-3xl font-serif mt-4 mb-2">{{common_name}}</h1>
    <p class="text-gray-600 italic mb-6">{{sci_name}}</p>

    <p class="mb-4">
      Learn more at:
      <a href="{{aab_url}}" class="text-blue-600 underline" target="_blank">
        Cornell Lab of Ornithology — All About Birds
      </a>
    </p>
  </div>

  <!-- Tight calendar block -->
  <div class="border-t pt-6 mt-6 flex justify-center">
    <div class="rounded-lg border border-gray-300 bg-gray-50 p-4">
      <div class="w-[412px]">
        <p class="text-sm mb-3 text-gray-700 text-center">
          This calendar shows the days that <strong>{{common_name}}</strong> has been detected with a confidence of <strong>0.50 or greater</strong>. Black-highlighted days indicate confirmed detections. Detections started June 24, 2025 for this project.
        </p>
        <div id="speciesDashboard" class="text-xs">
          <!-- 🗓️ Real Calendar Layout -->
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
          Hourly audio detections for <strong>{{common_name}}</strong> since June 24, 2025. 
          For species with fewer strong matches, lower-confidence detections may be shown to reveal broader patterns.
        </p>
        <div id="hourlyChart" class="text-xs">
          <!-- 📊 Hourly Chart Layout Placeholder -->
          <?php include __DIR__ . '/../includes/hourly_widget.php'; ?>
        </div>
      </div>
    </div>
  </div>

</body>
</html>

