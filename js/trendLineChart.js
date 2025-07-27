// File: /dashboard/js/trendLineChart.js

export async function renderSpeciesTrendChart(speciesCode) {
  if (!speciesCode) {
    console.warn("renderSpeciesTrendChart: no speciesCode provided");
    return;
  }

  try {
    const res = await fetch(`/dashboard/php/get_species_timeseries.php?species_code=${speciesCode}`);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("renderSpeciesTrendChart: no data returned");
      return;
    }

    const labels = data.map(entry => entry.date);
    const s1 = data.map(entry => Number(entry.S1 ?? 0));
    const s2 = data.map(entry => Number(entry.S2 ?? 0));

    // Dynamically calculate max value across both series
    const maxY = Math.max(...s1, ...s2);
    const suggestedMax = Math.ceil(maxY * 1.1); // Add 10% headroom

    const ctx = document.getElementById("speciesTrendChart");
    if (!ctx) return;

    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Station S1",
            data: s1,
            borderColor: "#1f2937", // Tailwind gray-800
            backgroundColor: "rgba(31, 41, 55, 0.1)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.25,
          },
          {
            label: "Station S2",
            data: s2,
            borderColor: "#3b82f6", // Tailwind blue-500
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.25,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: "Date" },
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              callback: function(value, index) {
                // Show one label per week to avoid clutter
                return index % 7 === 0 ? this.getLabelForValue(value) : '';
              }
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax,
            title: { display: true, text: "Detections per Day" },
            ticks: {
              precision: 0,
              callback: (value) => value.toLocaleString()
            }
          }
        },
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}`;
              }
            }
          }
        }
      }
    });

  } catch (err) {
    console.error("renderSpeciesTrendChart error:", err);
  }
}

