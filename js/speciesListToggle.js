
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleSpeciesList');
  const listContainer = document.getElementById('speciesListContainer');

  if (toggleButton && listContainer) {
    toggleButton.addEventListener('click', () => {
      const isOpen = listContainer.classList.toggle('max-h-0');
      listContainer.classList.toggle('max-h-96');
      listContainer.classList.toggle('opacity-0');
      listContainer.classList.toggle('opacity-100');

      toggleButton.textContent = isOpen ? "Show List ▼" : "Hide List ▲";
    });
  }
});

