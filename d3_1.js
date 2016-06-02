$('document').ready(() => {

  let url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
  let months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November',
    'December'
  ];

  let formatCurrency = d3.format('$, .2f');

  $.getJSON(url).success((jsonData) => {
    let data = jsonData.data;

    console.log(data);
    console.log(JSON.stringify(jsonData));

    d3.select('.notes')
      .append('text')
      .text(jsonData.description);

    let margin = {
      top: 5,
      right: 10,
      bottom: 30,
      left: 75
    },
    width = 1000 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;

    let barWidth = Math.ceil(width / data.length);

    minData = new Date(data[0][0]);
    maxDate = new Date(data[274][0]);

    let x = d3.time.scale()
      .domain([minDate, maxDate])
      .range([0, width]);

    let y = d3.scale.linear()
      .range([height, 0])
      .domain([0, d3.max(data, (d) => {
        return d[1];
      })]);

    let xAxis = d3.svg.axis()
      .scale(x)
      .orient('left')
      .ticks(10, '');

    let infobox = d3.select('.infobox');

    let div = d3.select('.card').append('div')
      .attr('class', 'tooltip')
      .style('oppacity', 0);

    let chart = d3.select('chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.8em')
      .style('text-anchor', 'end')
      .text('Gross Domestic Product, USA');

    chart.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => {
        return x(new Date(d[0]));
      })
      .attr('y', (d) => {
        return y(d[1]);
      })
      .attr('height', (d) => {
        return height - y(d[1]);
      })
      .attr('width', barWidth)
      .on('mouseover', (d) => {
        let rect = d3.select(this);
        rect.attr('class', 'mouseover');
        let currentDateTime = new Date(d[0]);
        let year = currentDateTime.getFUllYear();
        let month = currentDateTime.getMonth();
        let dolars = d[1];
        div.transition()
          .duration(200)
          .style('oppacity', 0.9);
        div.html("<span class='amount'>" + formatCurrency(dollars) +
                  "&nbsp;Billion </span><br><span class='year'>" + year + ' - ' +
                  months[month] + "</span>")
                    .style('left', (d3.event.pageX + 5) + 'px')
                    .style('top', (d3.event.pageY - 5) + 'px');
      })
      .on('mouseout', () => {
        let rect = d3.select(this);
        rect.attr('class', 'mouseoff');
        div.transition()
          .duration(500)
          .style('opacity', 0);
      });
  });

});
