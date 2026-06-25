// File: /dashboard/js/trendLineChart.js

export async function renderSpeciesTrendCharts(speciesCode) {
  if (!speciesCode) return;

  try {
    const res = await fetch(
      `/dashboard/php/get_species_timeseries.php?species_code=${speciesCode}`
    );

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return;

    renderChart(
      "speciesTrendChartYear1",
      data,
      new Date("2025-06-24T00:00:00"),
      new Date("2026-06-23T23:59:59")
    );

    renderChart(
      "speciesTrendChartYear2",
      data,
      new Date("2026-06-24T00:00:00"),
      new Date("2027-06-23T23:59:59")
    );

  } catch (err) {
    console.error("renderSpeciesTrendCharts:", err);
  }
}

function renderChart(canvasId, data, startDate, endDate) {

  const filtered = data.filter(row => {
    const d = new Date(row.date + "T12:00:00");
    return d >= startDate && d <= endDate;
  });

  const s1Points = filtered.map(e => ({
    x: new Date(e.date + "T12:00:00"),
    y: Number(e.S1 ?? 0)
  }));

  const s2Points = filtered.map(e => ({
    x: new Date(e.date + "T12:00:00"),
    y: Number(e.S2 ?? 0)
  }));

  const s3Points = filtered.map(e => ({
    x: new Date(e.date + "T12:00:00"),
    y: Number(e.S3 ?? 0)
  }));

  const totals = filtered.map(e =>
    Number(e.S1 ?? 0) +
    Number(e.S2 ?? 0) +
    Number(e.S3 ?? 0)
  );

  const maxTotal = Math.max(...totals, 1);

  const magnitude = Math.pow(
    10,
    Math.floor(Math.log10(maxTotal))
  );

  const stepCount = 5;

  const stepSize =
    Math.ceil((maxTotal / stepCount) / magnitude) * magnitude;

  const suggestedMax =
    Math.ceil(maxTotal / stepSize) * stepSize;

  const ctx = document.getElementById(canvasId);

  if (!ctx) return;

  new Chart(ctx, {

    type: "bar",

    data: {

      datasets: [

        {
          label: "Station S3",
          data: s3Points,
          backgroundColor: "#ef4444",
          stack: "stations",
          barThickness: "flex",
          maxBarThickness: 4
        },

        {
          label: "Station S2",
          data: s2Points,
          backgroundColor: "#3b82f6",
          stack: "stations",
          barThickness: "flex",
          maxBarThickness: 4
        },

        {
          label: "Station S1",
          data: s1Points,
          backgroundColor: "#1f2937",
          stack: "stations",
          barThickness: "flex",
          maxBarThickness: 4
        }

      ]

    },

    options: {

      responsive: true,
      maintainAspectRatio: false,

      scales: {

        x: {

          type: "time",

          time: {
            unit: "day",
            tooltipFormat: "MMM d"
          },

          min: startDate,
          max: endDate,

          stacked: true,

          ticks: {
            source: "auto",
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0
          }

        },

        y: {

          beginAtZero: true,
          suggestedMax,
          stacked: true,

          title: {
            display: true,
            text: "Detections per Day"
          },

          ticks: {
            stepSize
          }

        }

      },

      plugins: {

        legend: {
          position: "top"
        },

        tooltip: {

          mode: "index",
          intersect: false,

          callbacks: {

            label: ctx =>
              `${ctx.dataset.label}: ${ctx.parsed.y}`

          }

        }

      }

    }

  });

}
