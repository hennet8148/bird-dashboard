document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleSpeciesList');
  const listContainer = document.getElementById('speciesListContainer');
  const listElement = document.getElementById('speciesList');

  let listVisible = false;

  // Sample species list — you can replace this later with dynamic content
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

  // Populate species list
  listElement.innerHTML = '';
  species.sort().forEach(bird => {
    const li = document.createElement('li');
    li.textContent = bird;
    listElement.appendChild(li);
  });

  // Toggle behavior
  toggleButton.addEventListener('click', () => {
