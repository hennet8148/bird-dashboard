// card-yesterday-species.js
console.log("🟢 card-yesterday-species.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("statYesterday");
  if (!el) return;

  async function fetchYesterdaySpecies(conf = 0.5, station = "") {
    try {
      const params = new URLSearchParams({ conf: conf.toFixed(2), station });
      const res = await fetch(`/dashboard/php/get_yesterday_species.php?${params}`);
      const data = await res.json();
      console.log("[DEBUG] Yesterday species response →", data);

      if (data && data.count !== undefined) {
        el.textContent = new Intl.NumberFormat().format(data.count);
      } else {
        el.textContent = "—";
      }
    } catch (err) {
      console.error("❌ Error fetching yesterday species:", err);
      el.textContent = "—";
    }
  }

  // initial load
  fetchYesterdaySpecies(0.5);

  // optional: update when station changes
  const stationSelect = document.getElementById("stationSelect");
  if (stationSelect) {
    stationSelect.addEventListener("change", () => {
      fetchYesterdaySpecies(0.5, stationSelect.value);
    });
  }
});

