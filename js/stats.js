document.addEventListener('DOMContentLoaded', () => {
  const statSightings = document.getElementById('statSightings');
  const statSpecies = document.getElementById('statSpecies');
  const statYesterday = document.getElementById('statYesterday');

  fetch('php/stats.php')
    .then(response => response.json())
    .then(data => {
      if (data) {
        statSightings.textContent = data.total_sightings ?? '—';
        statSpecies.textContent = data.total_species ?? '—';
        statYesterday.textContent = data.yesterday_species?.['0.5'] ?? '—';
      } else {
        statSightings.textContent = statSpecies.textContent = statYesterday.textContent = '—';
      }
    })
    .catch(err => {
      console.error('Failed to fetch stats:', err);
      statSightings.textContent = statSpecies.textContent = statYesterday.textContent = '—';
    });
});

