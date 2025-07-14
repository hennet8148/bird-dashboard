<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Sightings and data for {{common_name}} at Davidson Farm Bird Project.">
  <title>{{common_name}} | Davidson Farm Bird Project</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-gray-800">

  <!-- Inject species code early so calendar.php can pick it up -->
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

    <div class="border-t pt-6 mt-6">
      <h2 class="text-xl font-semibold mb-4">Live Sightings Dashboard</h2>

      <div class="rounded-lg border border-gray-300 bg-gray-50 p-4">
        <p class="text-sm mb-3 text-gray-700">
          This calendar shows the days that <strong>{{common_name}}</strong> has been detected on our land by the BirdNET audio monitoring system with a confidence of <strong>0.50 or greater</strong>. Black-highlighted days indicate confirmed detections.
        </p>

        <div id="speciesDashboard" class="text-xs">
          <!-- 🗓️ Real Calendar Layout -->
          <?php include __DIR__ . '/../includes/calendar.php'; ?>
        </div>
      </div>
    </div>
  </div>

</body>
</html>

