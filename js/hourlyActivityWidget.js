// File: js/hourlyActivityWidget.js

export async function renderHourlyWidget(speciesCode) {
  if (!speciesCode) return;

  const res = await fetch(`/dashboard/php/get_hourly_distribution.php?species_code=${speciesCode}`);
  if (!res.ok) return;

  const {
    hourly_counts,
    total_detections,
    average_confidence,
    max_confidence
  } = await res.json();

  const widget = document.getElementById("hourlyWidget");
  if (!widget) return;

  // Normalize keys to 0–23
  const counts = {};
  for (let i = 0; i < 24; i++) {
    const key = String(i);
    counts[i] = hourly_counts[key] || hourly_counts[key.padStart(2, "0")] || 0;
  }

  const max = Math.max(...Object.values(counts));
  const container = document.createElement("div");
  container.className = "space-y-[2px]";

  for (let i = 0; i < 24; i++) {
    const row = document.createElement("div");
    row.className = "flex items-center space-x-2";

    const label = document.createElement("div");
    label.textContent = String(i).padStart(2, "0");
    label.className = "w-6 text-right text-[10px] text-gray-600";

    const bar = document.createElement("div");
    const relWidth = max ? Math.round((counts[i] / max) * 100) : 0;
    bar.className = `h-3 bg-gray-700 rounded`;
    bar.style.width = `${relWidth}%`;

    row.appendChild(label);
    row.appendChild(bar);
    container.appendChild(row);
  }

  // Summary footer
  const footer = document.createElement("p");
  footer.className = "mt-4 text-[10px] text-gray-600 text-center";
  footer.textContent = `Based on ${total_detections} detections — average confidence: ${average_confidence}, max: ${max_confidence}`;

  widget.innerHTML = "";
  widget.appendChild(container);
  widget.appendChild(footer);
}

