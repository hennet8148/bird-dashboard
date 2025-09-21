// dashboard/js/speciesListToggle.js
console.log("🟢 speciesListToggle.js loaded");

document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ DOMContentLoaded fired in speciesListToggle.js");

  const toggleButton = document.getElementById('toggleSpeciesList');
  console.log("Found toggleButton:", toggleButton);

  if (!toggleButton) {
    console.error("❌ toggleSpeciesList not found");
    return;
  }

  toggleButton.addEventListener('click', () => {
    console.log("✅ speciesListToggle.js: button clicked");
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const toggleButton   = document.getElementById('toggleSpeciesList');
  const listContainer  = document.getElementById('speciesListContainer');
  const listElement    = document.getElementById('speciesList');
  const confSlider     = document.getElementById('confSlider');
  const confValue      = document.getElementById('confValue');

  if (!(toggleButton && listContainer && listElement && confSlider && confValue)) {
    console.error('Toggle list: Required elements not found.');
    return;
  }

  // ✅ Toggle show/hide using Tailwind classes
  toggleButton.addEventListener('click', () => {
    const isClosed = listContainer.classList.contains('max-h-0');
    if (isClosed) {
      listContainer.classList.remove('max-h-0', 'opacity-0');
      listContainer.classList.add('max-h-96', 'opacity-100');
      toggleButton.textContent = 'Hide List ▲';
    } else {
      listContainer.classList.remove('max-h-96', 'opacity-100');
      listContainer.classList.add('max-h-0', 'opacity-0');
      toggleButton.textContent = 'Show List ▼';
    }
  });

  // ✅ Update label + fetch new species on slider change
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
      })
      .catch(err => console.error('Error fetching species list:', err));
  });
});

