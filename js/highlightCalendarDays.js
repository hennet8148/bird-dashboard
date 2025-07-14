// File: /birds/js/highlightCalendarDays.js

/**
 * Fetches and highlights calendar days for a given species,
 * and renders a debug overlay showing the raw JSON response.
 * @param {string} speciesCode - The code of the species to highlight.
 */
export async function highlightCalendarDays(speciesCode) {
  if (!speciesCode) {
    console.warn("highlightCalendarDays: no speciesCode provided");
    return;
  }

  try {
    // 🔧 Correct absolute path to the live PHP endpoint
    const res = await fetch(`/birds/php/get_highlight_days.php?species_code=${speciesCode}`);
    if (!res.ok) {
      throw new Error(`get_highlight_days.php returned HTTP ${res.status}`);
    }

    const json = await res.json();
    console.log("🐦 Highlight API response:", json);

    // —————— Debug Overlay ——————
    const pre = document.createElement("pre");
    Object.assign(pre.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      right: "0",
      maxHeight: "30%",
      overflowY: "auto",
      background: "rgba(0,0,0,0.8)",
      color: "#0f0",
      padding: "0.5rem",
      fontSize: "12px",
      zIndex: "9999",
      margin: 0,
      whiteSpace: "pre-wrap"
    });
    pre.textContent = JSON.stringify(json, null, 2);
    document.body.appendChild(pre);
    // —————————————————————————————————

    // If your PHP returns { species_code, result }, use .result; otherwise use the payload directly
    const data = json.result ?? json;

    // Loop months → days, flip matching cells to black/white
    for (const [month, days] of Object.entries(data)) {
      if (!Array.isArray(days)) continue;
      for (const day of days) {
        const id = `day-${month.toLowerCase()}-${String(day).padStart(2, '0')}`;
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

