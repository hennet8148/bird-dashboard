<?php
if (!isset($page_title)) $page_title = "Davidson Farm Bird Project";
if (!isset($meta_description)) $meta_description = "Bird vocalization detections from Davidson Farm using passive acoustic monitoring.";
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= htmlspecialchars($page_title) ?></title>
  <meta name="description" content="<?= htmlspecialchars($meta_description) ?>">
  <link rel="canonical" href="https://davidsonfarmbirdproject.org<?= $_SERVER['REQUEST_URI'] ?? '' ?>">

  <!-- Tailwind + Fonts + Chart.js -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
  <link href="/dashboard/css/fonts.css" rel="stylesheet">

</head>
<body class="bg-white text-gray-800">

<!-- Top black bar -->
<div class="w-full h-7 bg-neutral-900" style="background-color: oklch(12.9% 0.042 264.695);"></div>

<!-- Header with project stamp -->
<header class="w-full px-6 py-4 border-b border-gray-200">
  <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-2">
      <a href="/" class="bg-black text-white px-4 py-2 text-xl font-semibold font-sans leading-tight select-none w-max block lowercase">
        Davidson Farm Bird Project
      </a>
    </div>
    <!-- Optional nav menu placeholder -->
    <nav class="mt-4 sm:mt-0">
      <ul class="flex flex-col sm:flex-row sm:space-x-6 text-sm font-sans text-gray-700">
        <li><a href="/" class="hover:underline">Home</a></li>
        <li><a href="/dashboard/index.html" class="hover:underline">Dashboard</a></li>
        <li><a href="/dashboard/species.html" class="hover:underline">Species List</a></li>
      </ul>
    </nav>
  </div>
</header>

<main>

