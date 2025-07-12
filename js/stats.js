document.addEventListener('DOMContentLoaded', () => {
  const statSightings = document.getElementById('statSightings');
  const statSpecies = document.getElementById('statSpecies');
  const statYesterday = document.getElementById('statYesterday');
  const lastUpdatedSightings = document.getElementById('lastUpdatedSightings');
  const sightingsTitle = document.getElementById('sightingsTitle');

  // Clear saved values on initial load
  localStorage.removeItem('confSlider');
  localStorage.removeItem('confSliderYesterday');

  function fetchStats() {
    const station = document.getElementById('stationSelect')?.value || '';
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

        if (data) {
          if (statSightings) statSightings.textContent = data.total_sightings ?? '—';
          if (statSpecies) statSpecies.textContent = data.total_species ?? '—';
          if (statYesterday) statYesterday.textContent = data.yesterday_species?.count ?? '—';

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
        } else {
          if (statSightings) statSightings.textContent = '—';
          if (statSpecies) statSpecies.textContent = '—';
          if (statYesterday) statYesterday.textContent = '—';
        }
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err);
        if (statSightings) statSightings.textContent = '—';
        if (statSpecies) statSpecies.textContent = '—';
        if (statYesterday) statYesterday.textContent = '—';
        if (lastUpdatedSightings) {
          lastUpdatedSightings.textContent = 'Last updated at —';
        }
      });
  }

  // Initial load
  fetchStats();

  const stationSelect = document.getElementById('stationSelect');
  if (stationSelect) {
    stationSelect.addEventListener('change', () => {
      fetchStats();
    });
  }
});

