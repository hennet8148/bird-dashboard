// stats.js

export function getSelectedStation() {
  const stationSelect = document.getElementById('stationSelect');
  return stationSelect ? stationSelect.value : 'All';
}

export function updateStatsPanel(station = getSelectedStation()) {
  const statSightings = document.getElementById('statSightings');
  const statSpecies = document.getElementById('statSpecies');
  const statYesterday = document.getElementById('statYesterday');
  const lastUpdatedSightings = document.getElementById('lastUpdatedSightings');
  const sightingsTitle = document.getElementById('sightingsTitle');

  const initialConfYesterday = 0.5;

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

export function fetchUniqueSpecies(conf, station = getSelectedStation()) {
  const statSpecies = document.getElementById('statSpecies');
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

export function fetchYesterdaySpecies(conf, station = getSelectedStation()) {
  const statYesterday = document.getElementById('statYesterday');
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

