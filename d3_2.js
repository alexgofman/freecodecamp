
// adding data
let alps = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";


let formatCount = d3.format(",.0f"),
  formatTime = d3.time.format("%H:%M"),
  formatMinutes = (d) => {
    let t = new Date(2012, 0, 1, 0, d);
    t.setSeconds(t.getSeconds() + d);
    return formatTime(t);
  };

let tip = d3.tip()
  .attr('class', 'd3-tip')
  .html((d) => {
    let tooltipHTML = "<span class = 'name'>" + d.Name + "</span><br/>" + d.Year + "<br/>" + d.Nationality;
    if (d.doping !== "") {
      tooltipHTML += "<br/>" + d.Doping;
    } else {
      tooltipHTML += "<br/>No doping allegations";
    }
    return tooltipHTML;
  });

let fastestTime = 2210;

// Prep the data for D3
alps.forEach((finish) => {
  // turn finishing time into seconds behind winner
  finish.behind = finish.Seconds - fastestTime;

  // add data legend
  if (finish.Doping != "") {
    finish.legend = "Doping Allegations";
  } else {
    finish.legend = "No Doping Allegation";
  }

  console.log(finish.legend);
})

// D3 starts here
let margin = {
  top: 80,
  right: 140,
  bottom: 60,
  left: 60
},
width = 800 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

let yScale = d3.scale.linear()
  .domain([1, 36])
  .range([0, height]);

let xScale = d3.scale.linear()
  .domain([60 * 3.5, 0])
  .range([0, width]);

let yAxis = d3.svg.axis()
  .scale(xScale)
  .ticks(6)
  .orient("bottom")
  .tickFormat(formatMinutes);

// Create SVG element
let svg = d3.select("#container").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let ascents = svg.selectAll("circle")
  .data(alps)
  .enter()
  .append("cx", (d) => {
    return xScale(d.behind);
  })
  .attr("cy", (d) => {
    return xScale(d.behind);
  })
  .attr("cy", (d) => {
    return yScale(d.Place);
  })
  .attr("r", 5)
  .attr("fill", (d) => {
    if (d.Doping == "") {
      return "#333";
    }
    return d.legend;
  })
  .on("mouseover", (d) => {
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);

    tooltip.html(createToolTip(d))
      .style("left", (width/2) + "px")
      .style("top", (280) + "px");
  })
  .on("mouseout", (d) => {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });

// add the tooltip area to the webpage
let tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// text labels
svg.selectAll("text")
  .data(alps)
  .enter()
  .append("text")
  .text((d) => {
    return d.Name;
  })
  .attr("x", (d) => {
    return xScale(d.behind);
  })
  .attr("y", (d) => {
    return yScale(d.Place);
  })
  .attr("transform", "translate(15,+4)");

// create xAxis
svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)

.append("text")
  .attr("x", 300)
  .attr("y", 35)
  .attr("dy", ".35em")
  .style("text-anchor", "middle")
  .text("Minutes Behind Fastest Time");

// create yAxis

svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0, 0)")

.call(yAxis)

.append("text")
  .attr("x", 0)
  .attr("y", -35)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .text("Ranking");

// Add title & subtitle to SVG element
// Could also be done in HTML
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", -margin.top/2)
  .attr("text-anchor", "middle")
  .attr("class", "title")
  .text("Doping in Professional Bicycle Racing");

svg.append("text")
  .attr("x", (width / 2))
  .attr("y", -margin.top/2 + 35)
  .attr("text-anchor", "middle")
  .attr("class", "subtitle")
  .text("35 Fastest times up Alpe d'Huez");

svg.append("text")
  .attr("x", (width / 2))
  .attr("y", -margin.top/2 + 55)
  .attr("text-anchor", "middle")
  .attr("class", "asterix")
  .text("Normalized to 13.8km distance");

// legend
// circles with fill
// gray circle
svg.append("circle")
  .attr("cx", (d) => {
    return xScale(10);
  })
  .attr("cy", (d) => {
    return yScale(20);
  })
  .attr("r", 5)
  .attr("fill", "#333");

svg.append("text")
  .attr("x", (d) => {
    return xScale(7);
  })
  .attr("y", (d) => {
    return yScale(20)+4;
  })
  .attr("text-anchor", "left")
  .attr("class", "legend")
  .text("No doping allegations");

// red circle
svg.append("circle")
  .attr("cx", (d) => {
    return xScale(10);
  })
  .attr("cy", (d) => {
    return yScale(23);
  })
  .attr("r", 5)
  .attr("fill", "#f44");

  svg.append("text")
    .attr("x", function(d) {
      return xScale(7);
    })
    .attr("y", function(d) {
      return yScale(23)+4;
    })
    .attr("text-anchor", "left")
    .attr("class", "legend")
    .text("Riders with doping allegations");

  function friendlySeconds(seconds) {
    return parseInt(seconds / 60) + ":" + seconds % 60;
  }

  function createToolTip(d) {
    var tooltipHTML = "<span class = 'name'>" + d.Name + ": " + d.Nationality + "</span>";
    tooltipHTML += "<br/>Year: " + d.Year + ", Time: " + friendlySeconds(d.Seconds) + "<br/>";
    if (d.doping !== "") {
      tooltipHTML += "<br/>" + d.Doping;
    } else {
      tooltipHTML += "<br/>No Doping Allegation";
    }
    return tooltipHTML;
  }
