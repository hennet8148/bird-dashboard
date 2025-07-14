<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Weather</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-4 sm:p-8 text-gray-900">

  <div id="weather" class="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
    <h2 class="text-2xl sm:text-3xl font-semibold border-b pb-3 mb-4 text-gray-800">Current Weather</h2>
    <div id="weather-data" class="space-y-2 text-base sm:text-lg text-gray-900">
      <p class="text-gray-500">Loading...</p>
    </div>
  </div>

  <script>
    fetch('/birds/php/weather.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const w = data.data;
          document.getElementById('weather-data').innerHTML = `
            <p><strong>Time:</strong> ${w.timestamp}</p>
            <p><strong>Temperature:</strong> ${w.temperature_f} °F</p>
            <p><strong>Humidity:</strong> ${w.humidity_percent} %</p>
            <p><strong>Dew Point:</strong> ${w.dew_point_f} °F</p>
            <p><strong>Wind:</strong> ${w.wind_speed_mph} mph</p>
            <p><strong>Pressure:</strong> ${w.barometric_pressure_inhg} inHg</p>
            <p><strong>Rain Today:</strong> ${w.rain_day_in} in</p>
            <p><strong>Lightning Strikes:</strong> ${w.lightning_strike_count}</p>
          `;
        } else {
          document.getElementById('weather-data').innerHTML =
            `<p class="text-red-600">${data.error}</p>`;
        }
      })
      .catch(err => {
        document.getElementById('weather-data').innerHTML =
          `<p class="text-red-600">Error fetching weather.</p>`;
        console.error(err);
      });
  </script>

</body>
</html>

