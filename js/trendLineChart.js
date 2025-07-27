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
    const s1 = data.map(entry => entry.S1 ?? 0);
    const s2 = data.map(entry => entry.S2 ?? 0);

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
              maxTicksLimit: 12,
              autoSkip: true,
            }
          },
          y: {
            type: 'logarithmic',
            min: 1,
            title: { display: true, text: "Detections per Day (Log Scale)" },
            ticks: {
              callback: function(value) {
                return Number(value).toLocaleString(); // format: 1, 10, 100, 1000
              }
            }
          }
        },
        plugins: {
          legend: { display: true },
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

