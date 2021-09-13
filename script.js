const height = 500,
width = 800,
padding = {
  top: 200,
  bottom: 100,
  left: 75,
  right: 75 };


const MOVIE_DATA = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

const svg = d3.select('#dataviz').
append('svg').
attr('height', height + padding.top + padding.bottom).
attr('width', width + padding.left + padding.right).
append('g').
attr('transform', `translate(${padding.left},${padding.top})`);

const tooltip = d3.select('#dataviz').
append('div').
attr('id', 'tooltip').
style('opacity', 0).
style('position', 'absolute').
style('background-color', 'white').
style('padding', '8px').
style('border-radius', '3px').
style('border', '1px solid grey');

d3.json(MOVIE_DATA).
then(data => {

  const categories = data.children.map(d => d.name);
  const colorScale = d3.scaleOrdinal(d3.schemeSet2).
  domain(categories);

  const hierarchy = d3.hierarchy(data).
  sum(d => d.value).
  sort((a, b) => b.value - a.value);

  const treemap = d3.treemap().
  size([width, height]).
  padding(1)(
  hierarchy);

  // console.log(d3.min(treemap.leaves().map(d=>d.data.value)))

  const tile = svg.selectAll('g').
  data(treemap.leaves()).
  enter().
  append('g').
  attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')');

  tile.append('rect').
  attr('class', 'tile').
  attr('data-name', d => d.data.name).
  attr('data-category', d => d.data.category).
  attr('data-value', d => d.data.value)
  // .attr('x',d=>d.x0)
  // .attr('y',d=>d.y0)
  .attr('width', d => d.x1 - d.x0).
  attr('height', d => d.y1 - d.y0).
  style('fill', d => colorScale(d.data.category)).
  on('mousemove', (e, d) => {
    tooltip.transition().
    duration(50).
    style('opacity', .9).
    style('left', e.pageX + 20 + 'px').
    style('top', e.pageY - 40 + 'px').
    attr('data-value', d.data.value);
    tooltip.html("Category: " + d.data.category + '<br>' + d.data.name + '<br>$' + d3.format(',')(d.data.value));
  }).
  on('mouseleave', () => {
    tooltip.transition().
    duration(100).
    style('opacity', 0);
  });

  tile.append('text').
  attr('class', 'tile-text').
  selectAll('tspan').
  data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g)).
  enter().
  append('tspan').
  style('font-size', '12px').
  attr('x', 4).
  attr('y', function (d, i) {
    return 13 + i * 11;
  }).
  text(function (d) {
    return d;
  });

  //d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value))
  svg.append('text').
  attr('id', 'title').
  text('Top Movies')
  // .attr('text-anchor','middle')
  .attr('x', 0).
  attr('y', -padding.top / 2).
  style('font-size', '28px');

  svg.append('text').
  attr('id', 'description').
  text('Highest Grossing 95 Movies Grouped by Category')
  // .attr('text-anchor','middle')
  .attr('x', 0).
  attr('y', -padding.top / 4);

  const legend = svg.append('g').
  attr('id', 'legend');
  legend.selectAll('legend-color').
  data(categories).
  enter().
  append('rect').
  attr('class', 'legend-item').
  attr('x', width / 2).
  attr('y', (d, i) => -padding.top + 40 + i * 20).
  attr('width', 10).
  attr('height', 10).
  style('fill', d => colorScale(d));
  // console.log(colorScale(data.children.map(d=>d.name)))
  legend.selectAll('legend-key').
  data(categories).
  enter().
  append('text').
  attr('x', width / 2 + 20).
  attr('y', (d, i) => -padding.top + 50 + i * 20).
  text(d => d).
  attr('font-size', "15px");

});