document.addEventListener('DOMContentLoaded', () => {
  const statSightings = document.getElementById('statSightings');
  const statSpecies = document.getElementById('statSpecies');
  const statYesterday = document.getElementById('statYesterday');
  const lastUpdatedSightings = document.getElementById('lastUpdatedSightings');

  const confSlider = document.getElementById('confSlider');
  const confValue = document.getElementById('confValue');
  const confSliderYesterday = document.getElementById('confSliderYesterday');
  const confValueYesterday = document.getElementById('confValueYesterday');

  // Clear saved values on initial load for fresh defaults
  localStorage.removeItem('confSlider');
  localStorage.removeItem('confSliderYesterday');

  // Default both sliders to 0.5
  const initialConf = 0.5;
  const initialConfYesterday = 0.5;
  confSlider.value = initialConf;
  confValue.textContent = initialConf.toFixed(2);
  confSliderYesterday.value = initialConfYesterday;
  confValueYesterday.textContent = initialConfYesterday.toFixed(2);

  function fetchStats() {
    fetch('php/stats.php')
      .then(response => response.json())
      .then(data => {
        console.log("DEBUG: stats.php returned →", data);

        if (data) {
          statSightings.textContent = data.total_sightings ?? '—';

          if (lastUpdatedSightings && data.last_updated) {
            const dt = new Date(data.last_updated.replace(' ', 'T'));

