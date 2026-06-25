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

    const year1Start = new Date("2025-06-24T00:00:00");
    const year1End   = new Date("2026-06-23T23:59:59");

    const year2Start = new Date("2026-06-24T00:00:00");
    const year2End   = new Date("2027-06-23T23:59:59");

    const year1Data = filterByDateRange(data, year1Start, year1End);
    const year2Data = filterByDateRange(data, year2Start, year2End);

    const sharedScale = calculateScale([...year1Data, ...year2Data]);

    renderChart(
      "speciesTrendChartYear1",
      year1Data,
      year1Start,
      year1End,
      sharedScale
    );

    renderChart(
      "speciesTrendChartYear2",
      year2Data,
      year2Start,
      year2End,
      sharedScale
    );

  } catch (err) {
    console.error("renderSpeciesTrendCharts:", err);
  }
}

function filterByDateRange(data, startDate, endDate) {
  return data.filter(row => {
    const d = new Date(row.date + "T12:00:00");
    return d >= startDate && d <= endDate;
  });
}

function totalForRow(row) {
  return (
    Number(row.S1 ?? 0) +
    Number(row.S2 ?? 0) +
    Number(row.S3 ?? 0)
  );
}

function calculateScale(data) {
  const totals = data.map(totalForRow);
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

  return {
    suggestedMax,
    stepSize
  };
}

function renderChart(canvasId, filtered, startDate, endDate, scale) {

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
          suggestedMax: scale.suggestedMax,
          stacked: true,

          title: {
            display: true,
            text: "Detections per Day"
          },

          ticks: {
            stepSize: scale.stepSize
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
