// stats.js

const statSightings = document.getElementById('statSightings');
const statSpecies = document.getElementById('statSpecies');
const statYesterday = document.getElementById('statYesterday');
const lastUpdatedSightings = document.getElementById('lastUpdatedSightings');
const sightingsTitle = document.getElementById('sightingsTitle');

const confSlider = document.getElementById('confSlider');
const confValue = document.getElementById('confValue');
const confSliderYesterday = document.getElementById('confSliderYesterday');
const confValueYesterday = document.getElementById('confValueYesterday');

const initialConf = 0.5;
const initialConfYesterday = 0.5;

// Clear saved values on initial load
localStorage.removeItem('confSlider');
localStorage.removeItem('confSliderYesterday');

if (confSlider && confValue) {
  confSlider.value = initialConf;
  confValue.textContent = initialConf.toFixed(2);
}

if (confSliderYesterday && confValueYesterday) {
  confSliderYesterday.value = initialConfYesterday;
  confValueYesterday.textContent = initialConfYesterday.toFixed(2);
}

// Reusable fetch for stats block
export function updateStatsPanel(passedStation = '') {
  // If no station passed, try DOM
  let station = passedStation;
  if (!station) {
    const stationSelect = document.getElementById('stationSelect');
    station = stationSelect ? stationSelect.value : '';
  }

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
  fetch(`php/get_unique_species.php?conf=${conf}`)
    .then(r => r.json())
    .then(data => {
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
  fetch(`php/get_yesterday_species.php?conf=${conf}`)
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

// Initial stats fetch (defaults to stationSelect value)
updateStatsPanel();

