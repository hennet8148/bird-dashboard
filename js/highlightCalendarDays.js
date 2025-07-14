document.addEventListener("DOMContentLoaded", () => {
  // You must pass the species_code to the page, either as a JS variable or via data attribute
  const speciesCode = window.speciesCode || null;

  if (!speciesCode) {
    console.warn("No species code found.");
    return;
  }

  fetch(`/dashboard/php/get_highlight_days.php?species_code=${speciesCode}`)
    .then(res => res.json())
    .then(data => {
      Object.entries(data).forEach(([month, days]) => {
        days.forEach(day => {
          const id = `day-${month.toLowerCase()}-${String(day).padStart(2, '0')}`;
          const el = document.getElementById(id);
          if (el) {
            el.classList.remove("hover:bg-gray-200");
            el.classList.add("bg-black", "text-white");
          }
        });
      });
    })
    .catch(err => console.error("Error fetching highlight days:", err));
});

