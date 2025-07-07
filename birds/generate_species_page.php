<?php
/**
 * Template Bird Page - Used by bird.php to create static pages per species
 * Variables expected:
 * - $species_common_name
 * - $scientific_name
 * - $external_link
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Sightings and data for <?php echo htmlspecialchars(\$species_common_name); ?> at Davidson Farm Bird Project.">
  <title><?php echo htmlspecialchars(\$species_common_name); ?> | Davidson Farm Bird Project</title>
  <link href="/dashboard/css/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-white text-gray-800">
  <div class="max-w-4xl mx-auto p-6">
    <a href="/dashboard/species.html" class="text-sm text-blue-600 hover:underline">&larr; Back to Species List</a>

    <h1 class="text-3xl font-serif mt-4 mb-2"><?php echo htmlspecialchars(\$species_common_name); ?></h1>
    <p class="text-gray-600 italic mb-6"><?php echo htmlspecialchars(\$scientific_name); ?></p>

    <p class="mb-4">
      Learn more at:
      <a href="<?php echo htmlspecialchars(\$external_link); ?>" class="text-blue-600 underline" target="_blank">
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

