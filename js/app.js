// ... (all your existing code above remains unchanged)

// ✅ NEW: Populate the bird dropdown based on selected station
function updateBirdDropdown(station = '') {
  const birdSelect = document.getElementById('birdSelect');
  if (!birdSelect) return;

  let url = 'php/species_list.php';
  if (station && station !== 'All') {
    url += `?station=${encodeURIComponent(station)}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(species => {
      birdSelect.innerHTML = '<option value="">-- Select a bird --</option>';
      species.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        birdSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Error loading bird dropdown:', err);
    });
}

// ✅ DOM load event listener (slightly expanded)
document.addEventListener('DOMContentLoaded', () => {
  const birdSelect = document.getElementById('birdSelect');
  const timeRangeSelect = document.getElementById('timeRange');
  const stationSelect = document.getElementById('stationSelect');
  const dataExplorer = document.getElementById('dataExplorerContent');

  function updateDataExplorer() {
    const selectedBird = birdSelect.value;
    const selectedTime = timeRangeSelect.value;
    const selectedStation = stationSelect.value;

    if (selectedBird) {
      fetchSightingsByBird(selectedBird, selectedTime, selectedStation);
    } else {
      fetchSightingsByTimeRange(selectedTime, selectedStation, fetchSightingsByTimeRange.currentSort);
    }
  }

  if (birdSelect && timeRangeSelect && stationSelect && dataExplorer) {
    birdSelect.addEventListener('change', updateDataExplorer);
    timeRangeSelect.addEventListener('change', updateDataExplorer);
    stationSelect.addEventListener('change', () => {
      updateBirdDropdown(stationSelect.value); // 🔁 Refresh bird list
      updateDataExplorer();                    // 🔁 Refresh main table
      updateTotalSightings(stationSelect.value); // 🔁 Refresh applet
    });

    // Initial load
    const initialStation = stationSelect.value;
    fetchSightingsByTimeRange.currentSort = { key: 'sightings_count', asc: false };
    updateBirdDropdown(initialStation);       // ✅ First bird list load
    updateDataExplorer();                     // ✅ First table load
    updateTotalSightings(initialStation);     // ✅ First applet load
  }
});

