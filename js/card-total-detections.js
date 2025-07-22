console.log("🟢 card-total-detections.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("📦 DOMContentLoaded");

  fetch('/dashboard/php/get_summary.php')
    .then(res => {
      console.log("📡 Fetched summary response");
      return res.json();
    })
    .then(data => {
      console.log("📊 Received data:", data);

      const el = document.getElementById('totalSightings');
      if (el && data.total_sightings !== undefined) {
        el.textContent = new Intl.NumberFormat().format(data.total_sightings);
        console.log("✅ Total detections updated in DOM");
      } else {
        console.log("⛔ Could not find #totalSightings or no data");
      }
    })
    .catch(err => console.error("❌ Fetch error:", err));
});

