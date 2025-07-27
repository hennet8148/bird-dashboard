// File: /dashboard/js/trendLineChart.js

export async function renderSpeciesTrendChart(speciesCode) {
  if (!speciesCode) {
    console.warn("renderSpeciesTrendChart: no speciesCode provided");
    return;
  }

  try {
    const res = await fetch(
      `/dashboard/php/get_species_timeseries.php?species_code=${speciesCode}`
    );
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("renderSpeciesTrendChart: no data returned");
      return;
    }

    // Prepare arrays
    const labels = data.map((entry) => entry.date);
    const s1 = data.map((entry) => Number(entry.S1 ?? 0));
    const s2 = data.map((entry) => Number(entry.S2 ?? 0));

    // Compute total per day if you want them stacked proportionally,
    // but for true stacked bar, you can leave each series separate.
    // Compute dynamic Y-axis max:
    const dailyTotals = s1.map((val, i) => val + s2[i]);
    const maxTotal = Math.max(...dailyTotals);
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxTotal)));
    const stepCount = 5;
    const stepSize = Math.ceil((maxTotal / stepCount) / magnitude) * magnitude;
    const suggestedMax = Math.ceil(maxTotal / stepSize) * stepSize;

    const ctx = document.getElementById("speciesTrendChart");
    if (!ctx) return;

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Station S2",
            data: s2,
            backgroundColor: "#3b82f6", // Tailwind blue-500
            stack: "stations",
          },
          {
            label: "Station S1",
            data: s1,
            backgroundColor: "#1f2937", // Tailwind gray-800
            stack: "stations",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: "Date" },
            stacked: true,
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              callback: function (value, index) {
                // show one tick per week
                return index % 7 === 0 ? this.getLabelForValue(value) : "";
              },
            },
          },
          y: {
            title: { display: true, text: "Detections per Day" },
            stacked: true,
            beginAtZero: true,
            suggestedMax,
            ticks: {
              stepSize,
              callback: (val) => val.toLocaleString(),
            },
          },
        },
        plugins: {
          legend: { position: "top" },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.parsed.y}`;
              },
            },
          },
        },
      },
    });
  } catch (err) {
    console.error("renderSpeciesTrendChart error:", err);
  }
}

