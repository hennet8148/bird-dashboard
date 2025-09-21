// dashboard/js/speciesListToggle.js
console.log("🟢 speciesListToggle.js loaded");

(function initSpeciesListToggle(){
  // Prevent double-binding if the script gets executed twice
  if (window.__SPECIES_LIST_TOGGLE_INIT__) return;
  window.__SPECIES_LIST_TOGGLE_INIT__ = true;

  document.addEventListener('DOMContentLoaded', () => {
    const toggleButton  = document.getElementById('toggleSpeciesList');
    const listContainer = document.getElementById('speciesListContainer');
    const listElement   = document.getElementById('speciesList');
    const confSlider    = document.getElementById('confSlider');
    const confValue     = document.getElementById('confValue');

    if (!(toggleButton && listContainer && listElement && confSlider && confValue)) {
      console.error("❌ speciesListToggle.js: required elements not found");
      return;
    }

    // Remove any inline maxHeight left by older code (inline wins over classes)
    listContainer.style.maxHeight = "";

    // Toggle show/hide
    const openClasses  = ['max-h-96','opacity-100'];
    const closedClasses= ['max-h-0','opacity-0'];

    toggleButton.addEventListener('click', (e) => {
      e.preventDefault();

      const isClosed = listContainer.classList.contains('max-h-0');

      // normalize first
      closedClasses.forEach(c => listContainer.classList.remove(c));
      openClasses.forEach(c  => listContainer.classList.remove(c));

      if (isClosed) {
        listContainer.classList.add(...openClasses);
        toggleButton.textContent = 'Hide List ▲';
      } else {
        listContainer.classList.add(...closedClasses);
        toggleButton.textContent = 'Show List ▼';
      }

      console.log("✅ Toggle applied, classes:", listContainer.className);
    });

    // Update label + fetch new species on slider change
    confSlider.addEventListener('change', () => {
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
          console.log(`✅ Species list updated @ conf=${threshold}`);
        })
        .catch(err => console.error('❌ Error fetching species list:', err));
    });
  });
})();

