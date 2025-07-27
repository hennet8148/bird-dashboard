// File: js/hourlyActivityWidget.js

export async function renderHourlyWidget(speciesCode) {
  if (!speciesCode) return;

  try {
    const res = await fetch(`/dashboard/php/get_hourly_distribution.php?species_code=${speciesCode}`);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const { hourly_counts, total_detections, average_confidence, max_confidence } = await res.json();

    // Prepare labels (00–23) and corresponding counts
    const labels = [];
    const counts = [];
    for (let i = 0; i < 24; i++) {
      const hour = String(i).padStart(2, "0");
      labels.push(hour);
      counts.push(hourly_counts[hour] || hourly_counts[String(i)] || 0);
    }

    // Render Chart.js bar chart
    const ctx = document.getElementById("hourlyWidget").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Detections",
          data: counts,
          backgroundColor: "#3b82f6",  // Tailwind blue-500
          borderRadius: 4,
          barPercentage: 0.6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: "Hour (00–23)" },
            ticks: { autoSkip: false }
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: "Detections" },
            ticks: {
              precision: 0,
              callback: v => v.toLocaleString()
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.parsed.y} detections`
            }
          }
        }
      }
    });

    // Append summary footer
    const summaryEl = document.getElementById("hourlyWidgetSummary");
    if (summaryEl) {
      summaryEl.textContent = 
        `Based on ${total_detections.toLocaleString()} detections — average confidence: ${average_confidence}, max: ${max_confidence}`;
    }

  } catch (err) {
    console.error("renderHourlyWidget error:", err);
  }
}

