const COUNTIES =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const EDUCATION =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const width = 800;
const height = 500;

var margin = { top: 0, right: 0, bottom: 0, left: 0 };

// The svg
var svg = d3
  .select('#my_dataviz')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Map and projection
// var path = d3.geoPath();
// var projection = d3
//   .geoMercator()
//   .scale(70)
//   .center([0, 20])
//   .translate([width / 2, height / 2]);

// Data and color scale
// var data = d3.map();
// var colorScale = d3
//   .scaleThreshold()
//   .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
//   .range(d3.schemeBlues[7]);
// Load external data and boot
d3.queue()
  .defer(
    d3.json,
    // 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
    COUNTIES
  )
  .defer(d3.json, EDUCATION)
  .await(ready);

function ready(error, topo, edu) {
  let states = null;
  let counties = null;
  if (topo.hasOwnProperty('type') && topo.type === 'Topology') {
    counties = topojson.feature(topo, topo.objects.counties);
    states = topojson.feature(topo, topo.objects.states, function (a, b) {
      return a !== b;
    });
    // console.log(edu);
  } else {
    console.log(topo);
  }

  var color = d3
    .scaleThreshold()
    .domain([10, 12.5, 15, 17.5, 20, 22.5, 25])
    .range([
      '#fff7bc',
      '#fee391',
      '#fec44f',
      '#fe9929',
      '#ec7014',
      '#cc4c02',
      '#993404',
      '#662506',
    ]);

  var projection = d3.geoAlbersUsa().translate([width / 2, height / 2]);

  console.log(d3.geoAlbersUsa);

  var path = d3.geoPath().projection(projection);
  let i = 0;

  // Draw the map
  svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .selectAll('.county')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    // draw each country
    .attr('d', d3.geoPath().projection(projection))
    // set the color of each country
    .attr('fill', function (d) {
      d.total = edu[i].bachelorsOrHigher || 0;
      i++;
      return color(d.total);
    });
  svg
    .select('g')
    .append('path')
    .datum(states)
    .attr('class', 'states')
    .attr('d', path);
}
