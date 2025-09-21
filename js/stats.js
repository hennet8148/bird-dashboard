// dashboard/js/stats.js

// Keep track of the newest request and cancel older ones
let inflightController = null;
let lastRequestId = 0;

// Selected station helper
export function getSelectedStation() {
  const stationSelect = document.getElementById('stationSelect');
  return stationSelect ? stationSelect.value : 'All';
}

/**
 * Fetch and render the "Unique Species to Date" card.
 * Uses AbortController so only the latest request updates the UI.
 */
export async function fetchUniqueSpecies(conf, station = getSelectedStation()) {
  const statSpecies = document.getElementById('statSpecies');
  const listEl      = document.getElementById('speciesList');
  const valueLabel  = document.getElementById('confValue');

  // Keep label in sync with the requested value
  if (valueLabel && Number.isFinite(conf)) valueLabel.textContent = conf.toFixed(2);

  // Cancel any previous fetch
  if (inflightController) inflightController.abort();
  inflightController = new AbortController();
  const signal = inflightController.signal;
  const reqId = ++lastRequestId;

  try {
    const params = new URLSearchParams({ conf: conf.toFixed(2), station });
    const res    = await fetch(`/dashboard/php/get_unique_species.php?${params}`, { signal });
    const data   = await res.json();

    // Ignore stale responses
    if (reqId !== lastRequestId) return;

    if (statSpecies) {
      const n = data?.unique_species_count;
      statSpecies.textContent = (n == null) ? '—' : new Intl.NumberFormat().format(n);
    }

    if (listEl) {
      listEl.innerHTML = '';
      (data?.species_list ?? []).forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        listEl.appendChild(li);
      });
    }
  } catch (err) {
    // Swallow aborts; log real errors
    if (err?.name !== 'AbortError') {
      console.error('fetchUniqueSpecies error', err);
      if (statSpecies) statSpecies.textContent = '—';
    }
  }
}

// Wire up slider: live label on input, single fetch on release
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('confSlider');
  if (!slider) return;

  const initialConf = parseFloat(slider.value) || 0.5;
  fetchUniqueSpecies(initialConf);

  // While dragging: update the numeric label only (no fetch)
  slider.addEventListener('input', () => {
    const valueLabel = document.getElementById('confValue');
    if (valueLabel) valueLabel.textContent = (parseFloat(slider.value) || 0).toFixed(2);
  });

  // When released: perform exactly one fetch (old one is aborted)
  slider.addEventListener('change', () => {
    const conf = parseFloat(slider.value) || 0.5;
    fetchUniqueSpecies(conf);
  });
});

