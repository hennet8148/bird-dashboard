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

  // Confidence slider logic
  const confSlider = document.getElementById('confSlider');
  const confValue = document.getElementById('confValue');

  function fetchUniqueSpecies(conf) {
    fetch(`php/get_unique_species.php?conf=${conf}`)
      .then(r => r.json())
      .then(data => {
        statSpecies.textContent = data.count ?? '—';
      })
      .catch(() => {
        statSpecies.textContent = '—';
      });
  }

  if (confSlider && confValue) {
    confSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      confValue.textContent = parseFloat(val).toFixed(2);
      fetchUniqueSpecies(val);
    });

    // Initial fetch on load
    fetchUniqueSpecies(confSlider.value);
  }
});
