document.addEventListener('DOMContentLoaded', () => {
  const statSightings = document.getElementById('statSightings');
  const statSpecies = document.getElementById('statSpecies');
  const statYesterday = document.getElementById('statYesterday');

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

  // Fetch updated data
  function fetchStats() {
    fetch('php/stats.php')
      .then(response => response.json())
      .then(data => {
        if (data) {
          statSightings.textContent = data.total_sightings ?? '—';
        } else {
          statSightings.textContent = statSpecies.textContent = statYesterday.textContent = '—';
        }
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err);
        statSightings.textContent = statSpecies.textContent = statYesterday.textContent = '—';
      });
  }

  function fetchUniqueSpecies(conf) {
    fetch(`php/get_unique_species.php?conf=${conf}`)
      .then(r => r.json())
      .then(data => {
        statSpecies.textContent = data.count ?? '—';
        statSpecies.classList.add('text-2xl', 'font-bold', 'text-black');
      })
      .catch(() => {
        statSpecies.textContent = '—';
      });
  }

  function fetchYesterdaySpecies(conf) {
    fetch(`php/get_yesterday_species.php?conf=${conf}`)
      .then(r => r.json())
      .then(data => {
        statYesterday.textContent = data.count ?? '—';
        statYesterday.classList.add('text-2xl', 'font-bold', 'text-black');
      })
      .catch(() => {
        statYesterday.textContent = '—';
      });
  }

  if (confSlider && confValue) {
    confSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      confValue.textContent = val.toFixed(2);
      localStorage.setItem('confSlider', val);
      fetchUniqueSpecies(val);
    });
    fetchUniqueSpecies(initialConf);
  }

  if (confSliderYesterday && confValueYesterday) {
    confSliderYesterday.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      confValueYesterday.textContent = val.toFixed(2);
      localStorage.setItem('confSliderYesterday', val);
      fetchYesterdaySpecies(val);
    });
    fetchYesterdaySpecies(initialConfYesterday);
  }

  fetchStats();
});

