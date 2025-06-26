document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleSpeciesList');
  const listContainer = document.getElementById('speciesListContainer');
  const listElement = document.getElementById('speciesList');
  const confSlider = document.getElementById('confSlider');
  const confValue = document.getElementById('confValue');

  if (!toggleButton || !listContainer || !listElement || !confSlider || !confValue) {
    console.error('Toggle list: Required elements not found.');
    return;
  }

  let listVisible = false;

  toggleButton.addEventListener('click', () => {
    listVisible = !listVisible;
    toggleButton.textContent = listVisible ? 'Hide List ▲' : 'Show List ▼';

    listContainer.classList.toggle('max-h-0', !listVisible);
    listContainer.classList.toggle('opacity-0', !listVisible);
    listContainer.classList.toggle('max-h-[600px]', listVisible); // More room
    listContainer.classList.toggle('overflow-y-auto', listVisible); // Scroll if needed
    listContainer.classList.toggle('opacity-100', listVisible);
  });

  const updateSpeciesList = (confidence) => {
    fetch(`php/get_species_by_confidence.php?threshold=${confidence}`)
      .then(res => res.json())
      .then(data => {
        listElement.innerHTML = '';
        data.sort().forEach(name => {
          const li = document.createElement('li');
          li.textContent = name;
          listElement.appendChild(li);
        });
        document.getElementById('statSpecies').textContent = data.length;
      })
      .catch(err => {
        console.error('Error fetching species list:', err);
      });
  };

  // Initial population
  updateSpeciesList(parseFloat(confSlider.value));

  // Slider updates
  confSlider.addEventListener('input', () => {
    const val = parseFloat(confSlider.value);
    confValue.textContent = val.toFixed(2);
    updateSpeciesList(val);
  });
});

