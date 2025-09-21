// dashboard/js/stats.js

// Get the selected station (if you ever add a selector)
export function getSelectedStation() {
  const stationSelect = document.getElementById('stationSelect');
  return stationSelect ? stationSelect.value : 'All';
}

/**
 * Fetch and render the "Unique Species to Date" card.
 * @param {number} conf   Confidence threshold (0.00–1.00)
 * @param {string} station Station ID, e.g. 'S1' or 'All'
 */
export async function fetchUniqueSpecies(conf, station = getSelectedStation()) {
  const statSpecies = document.getElementById('statSpecies');
  const listEl      = document.getElementById('speciesList');
  const valueLabel  = document.getElementById('confValue');

  try {
    const params = new URLSearchParams({ conf: conf.toFixed(2), station });
    const res    = await fetch(`/dashboard/php/get_unique_species.php?${params}`);
    const data   = await res.json();
    console.log(`[DEBUG] fetchUniqueSpecies(conf=${conf}) →`, data);

    // Update the big number
    if (statSpecies) {
      statSpecies.textContent =
        data.unique_species_count != null
          ? new Intl.NumberFormat().format(data.unique_species_count)
          : '—';
    }

    // Update the slider label
    if (valueLabel) {
      valueLabel.textContent = conf.toFixed(2);
    }

    // Populate the list
    if (listEl) {
      listEl.innerHTML = '';
      (data.species_list || []).forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        listEl.appendChild(li);
      });
    }
  } catch (err) {
    console.error('fetchUniqueSpecies error', err);
    if (statSpecies) statSpecies.textContent = '—';
  }
}

// Simple debounce helper
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// On page load, kick off the first fetch at the default slider value
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('confSlider');
  if (!slider) return;

  const initialConf = parseFloat(slider.value) || 0.5;
  fetchUniqueSpecies(initialConf);

  // Debounced re-fetch when slider moves
  const debouncedFetch = debounce((conf) => fetchUniqueSpecies(conf), 300);

  slider.addEventListener('input', () => {
    const conf = parseFloat(slider.value);
    debouncedFetch(conf);
  });
});

