const data = [
  {
    player: "Pedri",
    axes: [
      { axis: "Duel %", value: 94.1 },
      { axis: "Defensive Actions", value: 37.0 },
      { axis: "Progressive Carries", value: 97.5 },
      { axis: "Forward Passes", value: 95.7 },
      { axis: "Forward Pass Accuracy", value: 52.0 },
      { axis: "Key Passes", value: 95.0 },
      { axis: "Progressive Passes", value: 90.7 }
    ]
  },
  {
    player: "Frenkie de Jong",
    axes: [
      { axis: "Duel %", value: 98.9 },
      { axis: "Defensive Actions", value: 36.3 },
      { axis: "Progressive Carries", value: 97.9 },
      { axis: "Forward Passes", value: 97.7 },
      { axis: "Forward Pass Accuracy", value: 100.0 },
      { axis: "Key Passes", value: 61.4 },
      { axis: "Progressive Passes", value: 85.9 }
    ]
  }
];

const width = 600;
const height = 600;
const margin = 60;
const radius = Math.min(width, height) / 2 - margin;
const levels = 5; // grid circles
const maxValue = 100;

const svg = d3.select("#radarChart")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2},${height / 2})`);

const angleSlice = (2 * Math.PI) / data[0].axes.length;

// Draw circular grid
for (let level = 0; level <= levels; level++) {
  const r = (radius / levels) * level;
  svg.append("circle")
    .attr("r", r)
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-dasharray", "2,2");
}

// Draw axis lines
data[0].axes.forEach((d, i) => {
  const angle = angleSlice * i - Math.PI / 2;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  svg.append("line")
    .attr("x1", 0).attr("y1", 0)
    .attr("x2", x).attr("y2", y)
    .attr("stroke", "#aaa");

  svg.append("text")
    .attr("x", x * 1.1)
    .attr("y", y * 1.1)
    .attr("text-anchor", "middle")
    .attr("class", "axisLabel")
    .text(d.axis);
});

// Radar area generator
function radarPath(axes) {
  return d3.lineRadial()
    .radius(d => (d.value / maxValue) * radius)
    .angle((d, i) => i * angleSlice)
    .curve(d3.curveLinearClosed)(axes);
}

// Color palette
const color = d3.scaleOrdinal()
  .domain(data.map(d => d.player))
  .range(["#1f77b4", "#ff7f0e"]);

// Draw radar paths
data.forEach(player => {
  svg.append("path")
    .datum(player.axes)
    .attr("fill", color(player.player))
    .attr("fill-opacity", 0.3)
    .attr("stroke", color(player.player))
    .attr("stroke-width", 2)
    .attr("d", radarPath);
});

// Add legend
const legend = svg.selectAll(".legend")
  .data(data)
  .enter().append("g")
  .attr("transform", (d, i) => `translate(-40, ${i * 20 - height / 2 + 20})`);

legend.append("rect")
  .attr("x", radius - 10)
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", d => color(d.player));

legend.append("text")
  .attr("x", radius + 5)
  .attr("y", 9)
  .text(d => d.player)
  .attr("fill", "#333")
  .attr("font-size", "12px");
