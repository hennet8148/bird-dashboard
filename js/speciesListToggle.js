document.addEventListener('DOMContentLoaded', () => {
  // Yesterday elements (working reference)
  const toggleButtonYesterday = document.getElementById('toggleSpeciesListYesterday');
  const listContainerYesterday = document.getElementById('speciesListContainerYesterday');
  const listElementYesterday = document.getElementById('speciesListYesterday');
  const confSliderYesterday = document.getElementById('confSliderYesterday');
  const confValueYesterday = document.getElementById('confValueYesterday');
  const statYesterday = document.getElementById('statYesterday');

  // All-time elements
  const toggleButton = document.getElementById('toggleSpeciesList');
  const listContainer = document.getElementById('speciesListContainer');
  const listElement = document.getElementById('speciesList');
  const confSlider = document.getElementById('confSlider');
  const confValue = document.getElementById('confValue');
  const statSpecies = document.getElementById('statSpecies');

  // Safety check
  if (!toggleButton || !listContainer || !listElement || !confSlider || !confValue || !statSpecies ||
      !toggleButtonYesterday || !listContainerYesterday || !listElementYesterday || !confSliderYesterday || !confValueYesterday || !statYesterday) {
    console.error('Toggle list: Required elements not found.');
    return;
  }

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
        statSpecies.textContent = data.length;
      })
      .catch(err => {
        console.error('Error fetching species list:', err);
      });
  };

  const updateYesterdaySpeciesList = (confidence) => {
    fetch(`php/get_species_yesterday.php?threshold=${confidence}`)
      .then(res => res.json())
      .then(data => {
        listElementYesterday.innerHTML = '';
        data.sort().forEach(name => {
          const li = document.createElement('li');
          li.textContent = name;
          listElementYesterday.appendChild(li);
        });
        statYesterday.textContent = data.length;
      })
      .catch(err => {
        console.error('Error fetching yesterday species list:', err);
      });
  };

  // Restore confidence values from localStorage or default to 0.5
  const savedConf = localStorage.getItem('confSlider');
  const initialConf = savedConf !== null && !isNaN(parseFloat(savedConf)) ? parseFloat(savedConf) : 0.5;
  confSlider.value = initialConf;
  confValue.textContent = initialConf.toFixed(2);

  const savedConfYesterday = localStorage.getItem('confSliderYesterday');
  const initialConfYesterday = savedConfYesterday !== null && !isNaN(parseFloat(savedConfYesterday)) ? parseFloat(savedConfYesterday) : 0.5;
  confSliderYesterday.value = initialConfYesterday;
  confValueYesterday.textContent = initialConfYesterday.toFixed(2);

  // Fetch lists and set counts early — before other scripts overwrite
  updateSpeciesList(initialConf);
  updateYesterdaySpeciesList(initialConfYesterday);

  // Toggle list visibility
  let listVisible = false;
  let listVisibleYesterday = false;

  toggleButton.addEventListener('click', () => {
    listVisible = !listVisible;
    toggleButton.textContent = listVisible ? 'Hide List ▲' : 'Show List ▼';
    listContainer.classList.toggle('max-h-0', !listVisible);
    listContainer.classList.toggle('opacity-0', !listVisible);
    listContainer.classList.toggle('max-h-[600px]', listVisible);
    listContainer.classList.toggle('overflow-y-auto', listVisible);
    listContainer.classList.toggle('opacity-100', listVisible);
  });

  toggleButtonYesterday.addEventListener('click', () => {
    listVisibleYesterday = !listVisibleYesterday;
    toggleButtonYesterday.textContent = listVisibleYesterday ? 'Hide List ▲' : 'Show List ▼';
    listContainerYesterday.classList.toggle('max-h-0', !listVisibleYesterday);
    listContainerYesterday.classList.toggle('opacity-0', !listVisibleYesterday);
    listContainerYesterday.classList.toggle('max-h-[600px]', listVisibleYesterday);
    listContainerYesterday.classList.toggle('overflow-y-auto', listVisibleYesterday);
    listContainerYesterday.classList.toggle('opacity-100', listVisibleYesterday);
  });

  // Slider change listeners
  confSlider.addEventListener('input', () => {
    const val = parseFloat(confSlider.value);
    confValue.textContent = val.toFixed(2);
    localStorage.setItem('confSlider', val);
    updateSpeciesList(val);
  });

  confSliderYesterday.addEventListener('input', () => {
    const val = parseFloat(confSliderYesterday.value);
    confValueYesterday.textContent = val.toFixed(2);
    localStorage.setItem('confSliderYesterday', val);
    updateYesterdaySpeciesList(val);
  });
});

