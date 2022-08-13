const COUNTIES = 'https://databucket.pages.dev/json/us.json';
const EDUCATION =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
let width = 800;
let height = 500;

const formatPercent = d3.format('.1%');

// Display the title
d3.select('#my_dataviz')
  .append('h1')
  .attr('id', 'title')
  .text('U.S. Daily Cigarette Smoking Rate, 1996-2012');
d3.select('#my_dataviz')
  .append('h2')
  .attr('id', 'description')
  .text(
    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
  );
// Display the slider & year
d3.select('#my_dataviz')
  .append('div')
  .attr('id', 'container')
  .append('h2')
  .attr('class', 'year');
d3.select('#container').append('div').attr('class', 'slider');

// Mount the svg container in my_dataviz
var svg = d3
  .select('#my_dataviz')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g');

tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

queue().defer(d3.json, COUNTIES).defer(d3.json, EDUCATION).await(ready);

var legendNumbers = ['', '10%', '', '30%', '', '50%', '', '70%'];

function ready(error, us, edu) {
  console.log(edu, us)
  var counties = topojson.feature(us, us.objects.counties);

  let min = 0;
  let max = 0;

  // Convert String data to Integer
  var educationByCounty = d3
    .nest()
    .key(function (d) {
      if (d.bachelorsOrHigher > max || max === 0) {
        max = d.bachelorsOrHigher;
      }
      if (d.bachelorsOrHigher < min || min === 0) {
        min = d.bachelorsOrHigher;
      }
      return d.fips;
    })
    .map(edu);

  counties.features.forEach(function (county) {
    if (educationByCounty[+county.id]) {
      county.properties.data = educationByCounty[+county.id];
    }
  });

  var color = d3.scale
    .threshold()
    .domain(d3.range(min, max, (max - min) / 8))
    .range(d3.schemeGreens[9]);

  var projection = d3.geo.albersUsa().translate([width / 2, height / 2]);

  var path = d3.geo.path().projection(projection);

  var countyAreas = svg
    .selectAll('.county')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    .style('fill', function (d) {
      return d.properties.data
        ? color(d.properties.data[0].bachelorsOrHigher)
        : color(0);
    })
    .on('mouseover', function (d) {
      tooltip.transition().duration(250).style('opacity', 1).attr('data-education', d.properties.data ? d.properties.data[0].bachelorsOrHigher : 0);
      tooltip
        .html(
          '<p>' +
            d.properties.data[0].area_name +
            ', ' +
            d.properties.data[0].state +
            ': <strong>' +
            formatPercent(d.properties.data[0].bachelorsOrHigher / 100) +
            '</strong></p>'
        )
        .style('left', d3.event.pageX + 15 + 'px')
        .style('top', d3.event.pageY - 28 + 'px');
    })
    .on('mouseout', function (d) {
      tooltip.transition().duration(250).style('opacity', 0);
    });

  countyAreas
    .attr('data-fips', function (d) {
      return d.id;
    })
    .attr('data-education', function (d) {
      if(d.properties.data && d.id === d.properties.data[0].fips){
        return d.properties.data[0].bachelorsOrHigher;
      }
      return 0;
    });

  svg
    .append('path')
    .datum(
      topojson.mesh(us, us.objects.states, function (a, b) {
        return a !== b;
      })
    )
    .attr('class', 'states')
    .attr('d', path);

  var legend = svg.append('g').attr('id', 'legend');

  var legendRange = legend
    .selectAll('.legendRange')
    .data(d3.range(8))
    .enter()
    .append('g')
    .attr('class', 'legendRange')
    .attr('transform', function (d, i) {
      return 'translate(' + i * 31 + ',20)';
    });

  legendRange
    .append('rect')
    .attr('x', width - 250)
    .attr('y', -3.5)
    .attr('width', 30)
    .attr('height', 10)
    .attr('class', 'rect')
    .style('fill', function (d, i) {
      return d3.schemeGreens[9][i];
    });

  legendRange
    .append('text')
    .attr('x', width - 250)
    .attr('y', -7)
    .style('text-anchor', 'middle')
    .text(function (d, i) {
      return legendNumbers[i];
    });
}
