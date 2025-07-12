// stats.js

export function updateStatsPanel(passedStation = '') {
  const statSightings = document.getElementById('statSightings');
  const statSpecies = document.getElementById('statSpecies');
  const statYesterday = document.getElementById('statYesterday');
  const lastUpdatedSightings = document.getElementById('lastUpdatedSightings');
  const sightingsTitle = document.getElementById('sightingsTitle');

  const initialConf = 0.5;
  const initialConfYesterday = 0.5;

  const stationSelect = document.getElementById('stationSelect');
  let station = passedStation || (stationSelect ? stationSelect.value : '');

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

const confSlider = document.getElementById('confSlider');
const confValue = document.getElementById('confValue');
const confSliderYesterday = document.getElementById('confSliderYesterday');
const confValueYesterday = document.getElementById('confValueYesterday');

// Clear saved values on initial load
localStorage.removeItem('confSlider');
localStorage.removeItem('confSliderYesterday');

if (confSlider && confValue) {
  confSlider.value = 0.5;
  confValue.textContent = '0.50';
}

if (confSliderYesterday && confValueYesterday) {
  confSliderYesterday.value = 0.5;
  confValueYesterday.textContent = '0.50';
}

function fetchUniqueSpecies(conf) {
  const statSpecies = document.getElementById('statSpecies');
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
  const statYesterday = document.getElementById('statYesterday');
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
  fetchUniqueSpecies(0.5);
}

if (confSliderYesterday && confValueYesterday) {
  confSliderYesterday.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    confValueYesterday.textContent = val.toFixed(2);
    localStorage.setItem('confSliderYesterday', val);
    fetchYesterdaySpecies(val);
  });
  fetchYesterdaySpecies(0.5);
}

// Initial load
updateStatsPanel();

