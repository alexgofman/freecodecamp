// temp data url
let URL_temperatureData = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

let month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

let colors = [
  "#5e4fa2",
  "#3288bd",
  "#66c2a5",
  "#abdda4",
  "#e6f598",
  "#ffffbf",
  "#fee08b",
  "#fdae61",
  "#f46d43",
  "#d53e4f",
  "#9e0142"
];

let buckets = colors.length;

let margin = {
  top: 5,
  right: 0,
  bottom: 90,
  left: 100
};

let width = 1200 - margin.left - margin.right;
let height = 550 - margin.top - margin.bottom;
let legendElementWidth = 35;

let axisYLabelX = -65;
let axisYLabelY = height / 2;

let axisXLabelX = width / 2;
let axisXLabelY = height + 45;

d3.json(URL_temperatureData, (error, data) => {
  if (error) throw error;

  let baseTemp = data.baseTemperature;
  let temperatureData = data.monthlyVariance;

  let yearData = temperatureData.map((obj) => {
    return obj.year;
  });
  yearData = yearData.filter((v, i) => {
    return yearData.indexOf(v) == i;
  });

  let varianceData = temperatureData.map((obj) => {
    return obj.variance;
  });

  let lowVariance = d3.min(varianceData);
  let highVariance = d3.max(varianceData);

  let lowYear = d3.min(yearData);
  let highYear = d3.max(yearData);

  let minDate = new Date(lowYear, 0);
  let maxDate = new Date(highYear, 0);

  let gridWidth = width / yearData.length;
  let gridHeight = height / month.length;

  let colorScale = d3.scale.quantile()
    .domain([lowVariance + baseTemp, highVariance + baseTemp])
    .range(colors);

  let svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let div = d3.select("#chart").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)

  let monthLabels = svg.selectAll(".monthLabel")
    .data(month)
    .enter()
    .append("text")
    .text((d) {
      return d;
    })
    .attr("x", 0)
    .attr("y", (d, i) => {
      return i * gridHeight;
    })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridHeight / 1.5 + ")")
    .attr("class", "monthLabel scales axis axis-months");

  let xScale = d3.time.scale()
    .domain([minDate, maxDate])
    .range([0, width]);

  let xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(d3.time.years, 10);

  svg.append("g")
    .attr("class", "axis axis-years")
    .attr("transform", "translate(0," + (height + 1) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("transform", "translate(" + axisYLabelX + ", " + axisYLabelY + ")")
    .append("text")
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('class', 'axislabel')
    .text('Months');

  svg.append('g')
    attr('transform', 'translate(' + axisXLabelX + ', ' + )
}))
