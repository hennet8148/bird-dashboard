// File: /birds/js/highlightCalendarDays.js

/**
 * Fetches and highlights calendar days for a given species.
 * @param {string} speciesCode - The code of the species to highlight.
 */
export async function highlightCalendarDays(speciesCode) {
  if (!speciesCode) {
    console.warn("highlightCalendarDays: no speciesCode provided");
    return;
  }

  try {
    // ✅ Correct path on the live server
    const res = await fetch(
      `/birds/php/get_highlight_days.php?species_code=${speciesCode}`
    );
    if (!res.ok) {
      throw new Error(`get_highlight_days.php returned HTTP ${res.status}`);
    }

    const json = await res.json();
    console.log("🐦 Highlight API response:", json);

    // If PHP returns { species_code, result }, use .result; otherwise use payload directly
    const data = json.result ?? json;

    // Flip each matching day cell to black/white
    for (const [month, days] of Object.entries(data)) {
      if (!Array.isArray(days)) continue;
      for (const day of days) {
        const id = `day-${month.toLowerCase()}-${String(day).padStart(2, "0")}`;
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove("hover:bg-gray-200");
          el.classList.add("bg-black", "text-white");
        }
      }
    }
  } catch (err) {
    console.error("highlightCalendarDays error:", err);
  }
}

