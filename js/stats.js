// stats.js

function getSelectedStation() {
  const stationSelect = document.getElementById('stationSelect');
  return stationSelect ? stationSelect.value : 'All';
}

export function updateStatsPanel(passedStation = '') {
  const statSightings = document.getElementById('statSightings');
  const statSpecies = document.getElementById('statSpecies');
  const statYesterday = document.getElementById('statYesterday');
  const lastUpdatedSightings = document.getElementById('lastUpdatedSightings');
  const sightingsTitle = document.getElementById('sightingsTitle');

  const initialConfYesterday = 0.5;
  const station = passedStation || getSelectedStation();

  const formData = new FormData();
  if (station && station !== 'All') {
    formData.append('station', station);
  }

  fetch('php/stats.php', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log("DEBUG: stats.php returned →", data);

      if (!data) return;

      if (statSightings) statSightings.textContent = data.total_sightings ?? '—';
      if (statSpecies) statSpecies.textContent = data.total_species ?? '—';

      if (statYesterday && data.yesterday_species) {
        const confKey = initialConfYesterday.toFixed(1);
        statYesterday.textContent = data.yesterday_species[confKey] ?? '—';
      }

      if (sightingsTitle && data.first_date) {
        sightingsTitle.textContent = `Total Detections since ${data.first_date}`;
      }

      if (lastUpdatedSightings && data.last_updated) {
        const localDate = new Date(data.last_updated.replace(' ', 'T'));
        const localTime = localDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/New_York',
          timeZoneName: 'short'
        });
        lastUpdatedSightings.textContent = 'Last updated at ' + localTime;
      } else if (lastUpdatedSightings) {
        lastUpdatedSightings.textContent = 'Last updated at —';
      }
    })
    .catch(err => {
      console.error('Failed to fetch stats:', err);
      if (statSightings) statSightings.textContent = '—';
      if (statSpecies) statSpecies.textContent = '—';
      if (statYesterday) statYesterday.textContent = '—';
      if (lastUpdatedSightings) lastUpdatedSightings.textContent = 'Last updated at —';
    });
}

function fetchUniqueSpecies(conf) {
  const statSpecies = document.getElementById('statSpecies');
  const station = getSelectedStation();
  const params = new URLSearchParams({ conf, station });

  fetch(`php/get_unique_species.php?${params.toString()}`)
    .then(r => r.json())
    .then(data => {
      console.log(`[DEBUG] fetchUniqueSpecies(conf=${conf}, station=${station}) returned →`, data.count);
      if (statSpecies) {
        statSpecies.textContent = data.count ?? '—';
        statSpecies.classList.add('text-2xl', 'font-bold', 'text-black');
      }
    })
    .catch(() => {
      if (statSpecies) statSpecies.textContent = '—';
    });
}

function fetchYesterdaySpecies(conf) {
  const statYesterday = document.getElementById('statYesterday');
  const station = getSelectedStation();
  const params = new URLSearchParams({ conf, station });

  fetch(`php/get_yesterday_species.php?${params.toString()}`)
    .then(r => r.json())
    .then(data => {
      if (statYesterday) {
        statYesterday.textContent = data.count ?? '—';
        statYesterday.classList.add('text-2xl', 'font-bold', 'text-black');
      }
    })
    .catch(() => {
      if (statYesterday) statYesterday.textContent = '—';
    });
}

// UI Elements
const confSlider = document.getElementById('confSlider');
const confValue = document.getElementById('confValue');
const confSliderYesterday = document.getElementById('confSliderYesterday');
const confValueYesterday = document.getElementById('confValueYesterday');
const stationSelect = document.getElementById('stationSelect');

// Clear localStorage on load
localStorage.removeItem('confSlider');
localStorage.removeItem('confSliderYesterday');

// Reset sliders visually
if (confSlider && confValue) {
  confSlider.value = 0.5;
  confValue.textContent = '0.50';
}

if (confSliderYesterday && confValueYesterday) {
  confSliderYesterday.value = 0.5;
  confValueYesterday.textContent = '0.50';
}

// Slider events
if (confSlider && confValue) {
  confSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    confValue.textContent = val.toFixed(2);
    localStorage.setItem('confSlider', val);
    fetchUniqueSpecies(val);
  });
}

if (confSliderYesterday && confValueYesterday) {
  confSliderYesterday.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    confValueYesterday.textContent = val.toFixed(2);
    localStorage.setItem('confSliderYesterday', val);
    fetchYesterdaySpecies(val);
  });
}

// Station change = full reload of panel + re-fetches
if (stationSelect) {
  stationSelect.addEventListener('change', () => {
    const val1 = parseFloat(confSlider?.value ?? 0.5);
    const val2 = parseFloat(confSliderYesterday?.value ?? 0.5);
    fetchUniqueSpecies(val1);
    fetchYesterdaySpecies(val2);
    updateStatsPanel(getSelectedStation());
  });
}

// ✅ Initial load with debug logging
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const defaultStation = getSelectedStation();
    console.log('[DEBUG] Delayed load, station:', defaultStation);

    updateStatsPanel(defaultStation);

    fetch(`php/get_unique_species.php?conf=0.5&station=${defaultStation}`)
      .then(r => r.json())
      .then(data => {
        console.log(`[DEBUG] Unique species at 0.5 for ${defaultStation}:`, data.count);
        const statSpecies = document.getElementById('statSpecies');
        if (statSpecies) {
          statSpecies.textContent = data.count ?? '—';
          statSpecies.classList.add('text-2xl', 'font-bold', 'text-black');
        }
      });

    fetchYesterdaySpecies(0.5);
  }, 100);
});

