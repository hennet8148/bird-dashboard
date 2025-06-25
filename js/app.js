// Helper to create sortable table headers
function createSortableHeader(text, key, currentSort, setSort) {
  const th = document.createElement('th');
  th.classList.add('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider', 'cursor-pointer');
  th.textContent = text;

  // Add sort indicator if sorting by this column
  if (currentSort.key === key) {
    const arrow = document.createElement('span');
    arrow.textContent = currentSort.asc ? ' ▲' : ' ▼';
    th.appendChild(arrow);
  }

  th.addEventListener('click', () => {
    if (currentSort.key === key) {
      // Toggle asc/desc
      setSort({ key, asc: !currentSort.asc });
    } else {
      // New sort key, ascending
      setSort({ key, asc: true });
    }
  });

  return th;
}

function fetchSightingsByTimeRange(timeRange, sort) {
  fetch(`php/get_sightings_by_timerange.php?timerange=${timeRange}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('dataExplorerContent');
      container.innerHTML = ''; // Clear previous

      if (!data.length) {
        container.textContent = 'No sightings found for this time range.';
        return;
      }

      // Apply sorting client-side for now
      if (sort && sort.key) {
        data.sort((a, b) => {
          if (a[sort.key] < b[sort.key]) return sort.asc ? -1 : 1;
          if (a[sort.key] > b[sort.key]) return sort.asc ? 1 : -1;
          return 0;
        });
      }

      const table = document.createElement('table');
      table.classList.add('min-w-full', 'divide-y', 'divide-gray-200');

      // Table header
      const thead = document.createElement('thead');
      thead.classList.add('bg-gray-50');
      const trHead = document.createElement('tr');

      const currentSort = fetchSightingsByTimeRange.currentSort || { key: 'sightings_count', asc: false };
      const setSort = (newSort) => {
        fetchSightingsByTimeRange.currentSort = newSort;
        fetchSightingsByTimeRange(timeRange, newSort);
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
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${row.species_common_name}</td>
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
      container.textContent = 'Failed to load data.';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const timeRangeSelect = document.getElementById('timeRange');
  const dataExplorer = document.getElementById('dataExplorerContent');

  if (timeRangeSelect && dataExplorer) {
    timeRangeSelect.addEventListener('change', (e) => {
      fetchSightingsByTimeRange(e.target.value);
    });

    // Set default sort
    fetchSightingsByTimeRange.currentSort = { key: 'sightings_count', asc: false };

    // Load default time range data on page load
    fetchSightingsByTimeRange(timeRangeSelect.value, fetchSightingsByTimeRange.currentSort);
  }
});
// ... your existing code ...

// Add this new function to fetch sightings for a selected bird and time range
function fetchSightingsByBird(bird, timeRange) {
  const container = document.getElementById('dataExplorerContent');
  if (!bird) {
    container.innerHTML = '<p>Please select a bird to see data.</p>';
    return;
  }

  fetch(`php/get_sightings_by_bird.php?bird=${encodeURIComponent(bird)}&timerange=${timeRange}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        container.innerHTML = '<p>No sightings found for this bird and time range.</p>';
        return;
      }

      const table = document.createElement('table');
      table.classList.add('min-w-full', 'divide-y', 'divide-gray-200');

      table.innerHTML = `
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
          </tr>
        </thead>
      `;

      const tbody = document.createElement('tbody');
      tbody.classList.add('bg-white', 'divide-y', 'divide-gray-200');

      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${row.timestamp}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(row.confidence).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      container.innerHTML = ''; // Clear old content
      container.appendChild(table);
    })
    .catch(err => {
      console.error('Error fetching bird sightings:', err);
      container.innerHTML = '<p>Failed to load bird data.</p>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const birdSelect = document.getElementById('birdSelect');
  const timeRangeSelect = document.getElementById('timeRange');
  const dataExplorer = document.getElementById('dataExplorerContent');

  if (birdSelect && timeRangeSelect && dataExplorer) {
    function updateDataExplorer() {
      const selectedBird = birdSelect.value;
      const selectedTime = timeRangeSelect.value;

      if (selectedBird) {
        fetchSightingsByBird(selectedBird, selectedTime);
      } else {
        // If no bird selected, fallback to time range summary table
        fetchSightingsByTimeRange(selectedTime, fetchSightingsByTimeRange.currentSort);
      }
    }

    birdSelect.addEventListener('change', updateDataExplorer);
    timeRangeSelect.addEventListener('change', updateDataExplorer);

    // Set default sort for summary table
    fetchSightingsByTimeRange.currentSort = { key: 'sightings_count', asc: false };

    // Initial load: show summary or bird data depending on bird selection
    updateDataExplorer();
  }
});

