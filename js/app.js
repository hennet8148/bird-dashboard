function fetchSightingsByTimeRange(timeRange) {
  fetch(`php/get_sightings_by_timerange.php?timerange=${timeRange}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('dataExplorerContent');
      container.innerHTML = ''; // Clear previous

      if (!data.length) {
        container.textContent = 'No sightings found for this time range.';
        return;
      }

      const table = document.createElement('table');
      table.classList.add('min-w-full', 'divide-y', 'divide-gray-200');

      // Table header
      table.innerHTML = `
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sightings</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Confidence</th>
          </tr>
        </thead>
      `;

      const tbody = document.createElement('tbody');
      tbody.classList.add('bg-white', 'divide-y', 'divide-gray-200');

      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${row.species_common_name}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${row.sightings_count}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(row.avg_confidence).toFixed(2)}</td>
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

    // Load default time range data on page load
    fetchSightingsByTimeRange(timeRangeSelect.value);
  }
});

