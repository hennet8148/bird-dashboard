<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Sightings and data for {{common_name}} at Davidson Farm Bird Project.">
  <title>{{common_name}} | Davidson Farm Bird Project</title>
  <link href="/dashboard/css/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-white text-gray-800">
  <div class="max-w-4xl mx-auto p-6">
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
      <h2 class="text-xl font-semibold mb-2">Live Sightings Dashboard</h2>
      <p class="text-sm text-gray-500 mb-4">(Coming soon — this section will show graphs and recent data.)</p>
      <div id="speciesDashboard">
        <!-- Dynamic charts and tables will load here -->
      </div>
    </div>
  </div>
</body>
</html>

