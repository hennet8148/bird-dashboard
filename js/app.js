// dashboard/js/app.js

import { fetchUniqueSpecies } from './stats.js';

// Debounce helper
en function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function createSortableHeader(text, key, currentSort, setSort) {
  const th = document.createElement('th');
  th.classList.add(
    'px-6', 'py-3', 'text-left', 'text-xs',
    'font-medium', 'text-gray-500', 'uppercase',
    'tracking-wider', 'cursor-pointer'
  );
  th.textContent = text;

  if (currentSort.key === key) {
    const arrow = document.createElement('span');
    arrow.textContent = currentSort.asc ? ' ▲' : ' ▼';
    th.appendChild(arrow);
  }

  th.addEventListener('click', () => {
    if (currentSort.key === key) {
      setSort({ key, asc: !currentSort.asc });
    } else {
      setSort({ key, asc: true });
    }
  });

  return th;
}

function fetchSightingsByTimeRange(timeRange, station = '', sort) {
  const url = `/dashboard/php/get_sightings_by_timerange.php?timerange=${encodeURIComponent(timeRange)}&station=${encodeURIComponent(station)}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('dataExplorerContent');
      container.innerHTML = '';

      if (!Array.isArray(data) || data.length === 0) {
        container.textContent = 'No sightings found for this time range.';
        return;
      }

      if (sort && sort.key) {
        data.sort((a, b) => {
          if (a[sort.key] < b[sort.key]) return sort.asc ? -1 : 1;
          if (a[sort.key] > b[sort.key]) return sort.asc ? 1 : -1;
          return 0;
        });
      }

      const table = document.createElement('table');
      table.classList.add('min-w-full', 'divide-y', 'divide-gray-200');

      const thead = document.createElement('thead');
      thead.classList.add('bg-gray-50');
      const trHead = document.createElement('tr');

      const currentSort = fetchSightingsByTimeRange.currentSort || { key: 'sightings_count', asc: false };
      const setSort = newSort => {
        fetchSightingsByTimeRange.currentSort = newSort;
        fetchSightingsByTimeRange(timeRange, station, newSort);
      };

      trHead.appendChild(createSortableHeader('Species', 'species_common_name', currentSort, setSort));
      trHead.appendChild(createSortableHeader('Sightings', 'sightings_count', currentSort, setSort));
      trHead.appendChild(createSortableHeader('Avg Confidence', 'avg_confidence', currentSort, setSort));
      trHead.appendChild(createSortableHeader('Max Confidence', 'max_confidence', currentSort, setSort));

      thead.appendChild(trHead);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      tbody.classList.add('bg-white', 'divide-y', 'divide-gray-200');

      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700 underline cursor-pointer">
            <a href="bird.php?code=${encodeURIComponent(row.species_code)}">${row.species_common_name}</a>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${row.sightings_count}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(row.avg_confidence).toFixed(2)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(row.max_confidence).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      container.appendChild(table);
    })
    .catch(err => {
      console.error('Error fetching sightings:', err);
      const container = document.getElementById('dataExplorerContent');
      if (container) container.textContent = 'Failed to load data.';
    });
}

function updateTotalSightings(station = '') {
  const url = `/dashboard/php/stats.php`;
  const formData = new FormData();
  if (station && station !== 'All') formData.append('station', station);

  fetch(url, { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('totalSightings');
      if (!container) return;

      const startDate = new Date(data.first_date).toLocaleDateString();
      const lastTime = new Date(data.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

      container.innerHTML = `
        <div class="text-sm text-gray-500 text-center mb-1">Total Sightings since ${startDate}</div>
        <div class="text-3xl font-bold text-center">${data.total_sightings.toLocaleString()}</div>
        <hr class="my-2">
        <div class="text-sm text-gray-500 text-center">Last updated at ${lastTime}</div>
      `;
    })
    .catch(err => console.error('Error fetching total sightings:', err));
}

document.addEventListener('DOMContentLoaded', () => {
  const birdSelect = document.getElementById('birdSelect');
  const timeRangeSelect = document.getElementById('timeRange');
  const stationSelect = document.getElementById('stationSelect');
  const dataExplorer = document.getElementById('dataExplorerContent');

  if (!birdSelect || !timeRangeSelect || !stationSelect || !dataExplorer) return;

  fetchSightingsByTimeRange.currentSort = { key: 'sightings_count', asc: false };

  birdSelect.addEventListener('change', () => {
    const station = stationSelect.value;
    const timeRange = timeRangeSelect.value;
    fetchUniqueSpecies(parseFloat(localStorage.getItem('confSlider') || 0.5), station);
    fetchSightingsByBird(birdSelect.value, timeRange, station);
    updateTotalSightings(station);
  });

  timeRangeSelect.addEventListener('change', () => {
    const station = stationSelect.value;
    const timeRange = timeRangeSelect.value;
    fetchSightingsByTimeRange(timeRange, station, fetchSightingsByTimeRange.currentSort);
    updateTotalSightings(station);
  });

  stationSelect.addEventListener('change', () => {
    const station = stationSelect.value;
    const timeRange = timeRangeSelect.value;
    fetchUniqueSpecies(parseFloat(localStorage.getItem('confSlider') || 0.5), station);
    fetchSightingsByTimeRange(timeRange, station, fetchSightingsByTimeRange.currentSort);
    updateTotalSightings(station);
  });

  const initStation = stationSelect.value;
  const initTime = timeRangeSelect.value;
  fetchUniqueSpecies(parseFloat(localStorage.getItem('confSlider') || 0.5), initStation);
  fetchSightingsByTimeRange(initTime, initStation, fetchSightingsByTimeRange.currentSort);
  updateTotalSightings(initStation);
});

