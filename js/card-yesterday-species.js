// card-yesterday-species.js
console.log("🟢 card-yesterday-species.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const countEl   = document.getElementById("statYesterday");
  const listEl    = document.getElementById("speciesListYesterday");
  const toggleBtn = document.getElementById("toggleSpeciesListYesterday");
  const listWrap  = document.getElementById("speciesListContainerYesterday");
  const slider    = document.getElementById("confSliderYesterday");
  const sliderVal = document.getElementById("confValueYesterday");
  const stationSelect = document.getElementById("stationSelect");

  if (!countEl || !slider) return;

  async function fetchYesterdaySpecies(conf = 0.5, station = "") {
    try {
      const params = new URLSearchParams({ conf: conf.toFixed(2), station });
      const res = await fetch(`/dashboard/php/get_yesterday_species.php?${params}`);
      const data = await res.json();
      console.log("[DEBUG] Yesterday species response →", data);

      // Update count
      if (data && data.count !== undefined) {
        countEl.textContent = new Intl.NumberFormat().format(data.count);
      } else {
        countEl.textContent = "—";
      }

      // Update list
      if (listEl) {
        listEl.innerHTML = "";
        (data.species_list || []).forEach(name => {
          const li = document.createElement("li");
          li.textContent = name;
          listEl.appendChild(li);
        });
      }

      // Update slider label
      if (sliderVal) sliderVal.textContent = conf.toFixed(2);

    } catch (err) {
      console.error("❌ Error fetching yesterday species:", err);
      countEl.textContent = "—";
      if (listEl) listEl.innerHTML = "";
    }
  }

  // 🔹 Toggle list show/hide
  if (toggleBtn && listWrap) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = listWrap.classList.contains("max-h-0");
      if (isOpen) {
        listWrap.classList.remove("max-h-0", "opacity-0");
        listWrap.classList.add("max-h-96", "opacity-100");
        toggleBtn.textContent = "Hide List ▲";
      } else {
        listWrap.classList.remove("max-h-96", "opacity-100");
        listWrap.classList.add("max-h-0", "opacity-0");
        toggleBtn.textContent = "Show List ▼";
      }
    });
  }

  // 🔹 Initial load
  fetchYesterdaySpecies(parseFloat(slider.value) || 0.5);

  // 🔹 React to slider changes
  slider.addEventListener("input", () => {
    const conf = parseFloat(slider.value);
    fetchYesterdaySpecies(conf, stationSelect?.value || "");
  });

  // 🔹 React to station changes
  if (stationSelect) {
    stationSelect.addEventListener("change", () => {
      const conf = parseFloat(slider.value) || 0.5;
      fetchYesterdaySpecies(conf, stationSelect.value);
    });
  }
});

