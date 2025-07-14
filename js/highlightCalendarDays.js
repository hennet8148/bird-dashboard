// /birds/js/highlightCalendarDays.js

/**
 * Fetches and highlights calendar days for a given species.
 * @param {string} speciesCode - The code of the species to highlight.
 */
export async function highlightCalendarDays(speciesCode) {
  if (!speciesCode) {
    console.warn("No species code provided to highlightCalendarDays");
    return;
  }

  try {
    const res = await fetch(`/birds/php/get_highlight_days.php?species_code=${speciesCode}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("🐦 Highlight API response:", data);

    // data.result holds the month→days map; fall back to data itself if needed
    const daysByMonth = data.result || data;
    for (const [month, dayList] of Object.entries(daysByMonth)) {
      if (!Array.isArray(dayList)) continue;
      for (const d of dayList) {
        const id = `day-${month.toLowerCase()}-${String(d).padStart(2, '0')}`;
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove("hover:bg-gray-200");
          el.classList.add("bg-black", "text-white");
        }
      }
    }
  } catch (err) {
    console.error("Error fetching highlight days:", err);
  }
}

