// Helper to create sortable table headers
function createSortableHeader(text, key, currentSort, setSort) {
  const th = document.createElement('th');
  th.classList.add('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider', 'cursor-pointer');
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

function fetchSightingsByTimeRange(timeRange, sort) {
  fetch(`php/get_sightings_by_timerange.php?timerange=${timeRange}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('dataExplorerContent');
      container.innerHTML = '';

      if (!data.length) {
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
      const setSort = (newSort) => {
        fetchSightingsByTimeRange.currentSort = newSort;
        fetchSightingsByTimeRange(timeRange, newSort);
      };

      trHead.appendChi

