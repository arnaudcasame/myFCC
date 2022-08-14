const DATA = [
  {
    title: 'Movie Sales',
    description: 'Top 100 Highest Grossing Movies Grouped By Genre',
    url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json',
  },
  {
    title: 'Video Game Sales',
    description: 'Top 100 Most Sold Video Games Grouped by Platform',
    url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json',
  },
  {
    title: 'Kickstarter Pledges',
    description:
      'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category',
    url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json',
  },
];
const colors = [
  '#79adcc',
  '#ffc09f',
  '#ffee93',
  '#fcf5c7',
  '#adf7b6',
  '#69779b',
  '#9692af',
  '#acdbdf',
  '#d7eaea',
  '#ffccd7',
  '#d7a5e9',
  '#9feae7',
  '#bfeeee',
  '#e5fcff',
  '#ffe0bd',
  '#ffe070',
  '#ff595e',
  '#ffca3a',
  '#8ac926',
  '#1982c4',
  '#ffff9f',
];

const treeContainer = d3.select('#my_dataviz');

const onchange = (e) => {
  document.getElementById('svg').innerHTML = '';
  document.getElementById('legend').innerHTML = '';
  drawTree(e.target[e.target.selectedIndex].dataset.url);
  description.text(e.target[e.target.selectedIndex].dataset.description);
};

const title = treeContainer
  .append('select')
  .attr('id', 'title')
  .attr('class', 'select')
  .on('change', onchange);

const options = title
  .selectAll('option')
  .data(DATA)
  .enter()
  .append('option')
  .attr('data-url', (d) => d.url)
  .attr('data-description', (d) => d.description)
  .text((d) => d.title);

const description = treeContainer
  .append('h3')
  .attr('id', 'description')
  .text(DATA[0].description);

const svg = d3
    .select('#my_dataviz')
    .append('svg')
    .attr('id', 'svg')
    .attr('width', 800)
    .attr('height', 600)
    .style('font-size', '12px'),
  width = +svg.attr('width'),
  height = +svg.attr('height');

const legend = d3
  .select('#my_dataviz')
  .append('svg')
  .attr('id', 'legend')
  .attr('width', 800)
  .attr('height', 150)
  .style('font-size', '13px');

drawTree(DATA[0].url);

const tooltip = treeContainer
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('visibility', 'hidden');

const dodge = (color) => d3.interpolateRgb(color, '#fff')(0.1);

const color = d3
  .scaleOrdinal()
  .range(
    colors.map(dodge)
  );

function drawTree(url) {
  d3.json(url)
    .then((data) => {
      const root = d3
        .hierarchy(data)
        .eachBefore(
          (d) =>
            (d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name)
        )
        .sum((d) => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value);

      d3.treemap().size([width, height]).paddingInner(1)(root);

      const box = svg
        .selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('class', 'group')
        .attr('transform', (d) => 'translate(' + d.x0 + ',' + d.y0 + ')');

      box
        .append('rect')
        .attr('id', (d) => d.data.id)
        .attr('class', 'tile')
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('data-name', (d) => d.data.name)
        .attr('data-category', (d) => d.data.category)
        .attr('data-value', (d) => d.data.value)
        .attr('fill', (d) => color(d.data.category));

      box
        .on('mousemove', (e, d) => {
          tooltip.style('visibility', 'visible');
          tooltip
            .html(
              `<ul>
            <li>Name:  ${d.data.name} </li>
            <li>Category: ${d.data.category}</li>
            <li>Value: ${d.data.value}</li>
            </ul>`
            )
            .attr('data-value', d.data.value)
            .style('left', e.pageX + 10 + 'px')
            .style('top', e.pageY - 28 + 'px');
        })
        .on('mouseout', () => tooltip.style('visibility', 'hidden'));

      box
        .append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter()
        .append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 13 + i * 10)
        .text((d) => d);

      const categories = root.leaves().map((nodes) => nodes.data.category);

      const legendWidth = +legend.attr('width');

      const LEGEND_RECT_SIZE = 15;
      const LEGEND_H_SPACING = 150;
      const LEGEND_V_SPACING = 20;
      const LEGEND_TEXT_X_OFFSET = 3;
      const LEGEND_TEXT_Y_OFFSET = -2;

      const numOfColumns = Math.floor(legendWidth / LEGEND_H_SPACING);

      const legendItem = legend
        .append('g')
        .attr('transform', 'translate(60, 10)')
        .selectAll('g')
        .data(new Set(categories))
        .enter()
        .append('g')
        .attr(
          'transform',
          (d, i) =>
            `translate( ${(i % numOfColumns) * LEGEND_H_SPACING},
          ${
            Math.floor(i / numOfColumns) * LEGEND_RECT_SIZE +
            LEGEND_V_SPACING * Math.floor(i / numOfColumns)
          })`
        );

      legendItem
        .append('rect')
        .attr('width', LEGEND_RECT_SIZE)
        .attr('height', LEGEND_RECT_SIZE)
        .attr('class', 'legend-item')
        .attr('fill', (d) => color(d));

      legendItem
        .append('text')
        .attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
        .attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
        .text(function (d) {
          return d;
        });
    })
    .catch((err) => console.log(err));
}
