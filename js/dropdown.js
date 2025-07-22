// dashboard/js/dropdown.js

document.addEventListener('DOMContentLoaded', () => {
  const birdSelect = document.getElementById('birdSelect');

  fetch('/dashboard/php/species_list.php')
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        data.forEach(species => {
          const option = document.createElement('option');
          option.value = species;
          option.textContent = species;
          birdSelect.appendChild(option);
        });
      } else {
        console.error('Unexpected response:', data);
      }
    })
    .catch(error => console.error('Error fetching species list:', error));
});

