document.addEventListener("DOMContentLoaded", () => {
  const speciesCode = window.speciesCode || null;

  if (!speciesCode) {
    console.warn("No species code found.");
    return;
  }

  fetch(`/dashboard/php/get_highlight_days.php?species_code=${speciesCode}`)
    .then(res => res.json())
    .then(data => {
      console.log("🐦 Highlight API Response:", data);

      // Ensure we have an object to work with
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        console.error("Highlight API response not in expected format.");
        return;
      }

      Object.entries(data).forEach(([month, dayList]) => {
        if (!Array.isArray(dayList)) return;
        dayList.forEach(day => {
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

