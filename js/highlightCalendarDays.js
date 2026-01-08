// File: /dashboard/js/highlightCalendarDays.js

/**
 * Fetches and highlights calendar days for a given species + year.
 * Expects DOM ids like: day-YYYY-month-dd (e.g., day-2025-january-06)
 *
 * @param {string} speciesCode
 * @param {{ year?: number }} opts
 */
export async function highlightCalendarDays(speciesCode, opts = {}) {
  if (!speciesCode) {
    console.warn("highlightCalendarDays: no speciesCode provided");
    return;
  }

  const year = Number.isFinite(opts.year) ? opts.year : 2025;

  try {
    const res = await fetch(
      `/dashboard/php/get_highlight_days.php?species_code=${encodeURIComponent(
        speciesCode
      )}&year=${encodeURIComponent(year)}`
    );

    if (!res.ok) {
      throw new Error(`get_highlight_days.php returned HTTP ${res.status}`);
    }

    const json = await res.json();
    console.log(`🐦 Highlight API response (${year}):`, json);

    const data = json.result ?? json;

    for (const [month, days] of Object.entries(data)) {
      if (!Array.isArray(days)) continue;

      for (const day of days) {
        const id = `day-${year}-${month.toLowerCase()}-${String(day).padStart(2, "0")}`;
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

