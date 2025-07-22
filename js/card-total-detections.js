document.addEventListener("DOMContentLoaded", () => {
  fetch('/dashboard/php/get_summary.php')
    .then(res => res.json())
    .then(data => {
      const el = document.getElementById('totalSightings');
      if (el && data.total_sightings !== undefined) {
        el.textContent = new Intl.NumberFormat().format(data.total_sightings);
      }
    })
    .catch(err => console.error("Error loading total detections:", err));
});

