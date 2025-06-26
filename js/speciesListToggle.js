document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleSpeciesList');
  const listContainer = document.getElementById('speciesListContainer');
  const listElement = document.getElementById('speciesList');

  if (!toggleButton || !listContainer || !listElement) {
    console.error('Toggle list: Required elements not found.');
    return;
  }

  console.log('Species list toggle script loaded');

  let listVisible = false;

  toggleButton.addEventListener('click', () => {
    listVisible = !listVisible;
    toggleButton.textContent = listVisible ? 'Hide List ▲' : 'Show List ▼';

    listContainer.classList.toggle('max-h-0', !listVisible);
    listContainer.classList.toggle('opacity-0', !listVisible);
    listContainer.classList.toggle('max-h-96', listVisible);
    listContainer.classList.toggle('opacity-100', listVisible);
  });

  // Sample species for testing
  const species = [
    'American Robin', 'Blue Jay', 'Chipping Sparrow', 'Common Grackle',
    'Eastern Phoebe', 'Eastern Towhee', 'Gray Catbird', 'House Finch',
    'Mourning Dove', 'Red-eyed Vireo', 'Song Sparrow', 'Tufted Titmouse',
    'White-breasted Nuthatch', 'Wood Thrush'
  ];

  listElement.innerHTML = '';
  species.sort().forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    listElement.appendChild(li);
  });
});
