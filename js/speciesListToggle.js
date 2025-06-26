document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleSpeciesList');
  const listContainer = document.getElementById('speciesListContainer');
  const listElement = document.getElementById('speciesList');

  let listVisible = false;

  toggleButton.addEventListener('click', () => {
    listVisible = !listVisible;
    toggleButton.textContent = listVisible ? 'Hide List ▲' : 'Show List ▼';

    listContainer.classList.toggle('max-h-0', !listVisible);
    listContainer.classList.toggle('opacity-0', !listVisible);
    listContainer.classList.toggle('max-h-96', listVisible);
    listContainer.classList.toggle('opacity-100', listVisible);
  });

  // Sample species data (replace with live fetch or shared array if needed)
  const species = [
    'American Robin',
    'Black-capped Chickadee',
    'Northern Cardinal',
    'Blue Jay',
    'Song Sparrow',
    'Common Grackle',
    'Downy Woodpecker',
    'White-breasted Nuthatch',
    'Eastern Towhee',
    'Red-eyed Vireo',
    'Tufted Titmouse',
    'Mourning Dove',
    'Chipping Sparrow',
    'Baltimore Oriole',
    'House Finch',
    'Eastern Phoebe',
    'Wood Thrush',
    'Gray Catbird',
    'American Goldfinch'
  ];

  // Populate the list
  listElement.innerHTML = '';
  species.sort().forEach(bird => {
    const li = document.createElement('li');
    li.textContent = bird;
    listElement.appendChild(li);
  });
});

