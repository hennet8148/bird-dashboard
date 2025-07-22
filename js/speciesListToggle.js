// dashboard/js/speciesListToggle.js

document.addEventListener('DOMContentLoaded', () => {
  // All‑time elements only
  const toggleButton   = document.getElementById('toggleSpeciesList');
  const listContainer  = document.getElementById('speciesListContainer');
  const listElement    = document.getElementById('speciesList');
  const confSlider     = document.getElementById('confSlider');
  const confValue      = document.getElementById('confValue');

  // Safety check: if any element is missing, abort
  if (!(toggleButton && listContainer && listElement && confSlider && confValue)) {
    console.error('Toggle list: Required elements not found.');
    return;
  }

  // Toggle show/hide of the species list
  toggleButton.addEventListener('click', () => {
    const isOpen = listContainer.style.maxHeight && listContainer.style.maxHeight !== '0px';
    listContainer.style.maxHeight = isOpen ? '0' : `${listElement.scrollHeight}px`;
    listContainer.style.opacity   = isOpen ? '0' : '1';
    toggleButton.textContent      = isOpen ? 'Show List ▼' : 'Hide List ▲';
  });

  // On slider change, re-fetch and update the list
  confSlider.addEventListener('input', () => {
    const threshold = parseFloat(confSlider.value).toFixed(2);
    confValue.textContent = threshold;

    fetch(`/dashboard/php/get_unique_species.php?conf=${threshold}`)
      .then(res => res.json())
      .then(data => {
        listElement.innerHTML = '';
        (data.species_list || []).forEach(name => {
          const li = document.createElement('li');
          li.textContent = name;
          listElement.appendChild(li);
        });
      })
      .catch(err => console.error('Error fetching species list:', err));
  });
});

