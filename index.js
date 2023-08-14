// initial setup
const w = 600;
const h = 600;

const [margin_top, margin_left, margin_bottom, margin_right] = [20, 80, 80, 20]

const plotWidth = w - margin_left - margin_right;
const plotHeight = h - margin_top - margin_bottom;

const svg = d3.select('.container')
              .append('svg')
              .attr('width', w)
              .attr('height', h);
const plot = svg.append('g')
                .attr('width', plotWidth)
                .attr('height', plotHeight)
                .attr('transform', `translate(${margin_left}, ${margin_top})`);
                
const xGroup = plot.append('g')
                    .attr('transform', `translate(0, ${plotHeight})`);
const yGroup = plot.append('g');

const y = d3.scaleLinear()
            .range([plotHeight, 0]);

const x = d3.scaleBand()
            .range([0, plotWidth])             
            .paddingInner(0.2)
            .paddingOuter(0.2);
// axis
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
                .ticks(4)
                .tickFormat(d => {
                    return d < 2 ? d + ' Order': d + ' Orders';
                });

const t = d3.transition().duration(500);

const update = (data) => {
    // scale
    y.domain([0, d3.max(data, d => d.orders)]);
    x.domain(data.map(d => d.name));

    // join
    const rects = plot.selectAll('rect')
                    .data(data);

    // remove exit selection
    rects.exit().remove();

    // update the current selection               
    rects.attr('width', x.bandwidth)
        .attr('x', d => x(d.name))
        // .transition().duration(500)
        //     .attr('height', d => plotHeight - y(d.orders))
        //     .attr('y', d => y(d.orders))

    // append the enter selection
    rects.enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', 0)
        .attr('x', d => x(d.name))
        .attr('y', plotHeight)
        .attr('fill', 'blue')
        .merge(rects)
        .transition(t)
            .attr('height', d => plotHeight - y(d.orders))
            .attr('y', d => y(d.orders))
    
    plot.selectAll('rect')
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)

    // call the axis
    xGroup.call(xAxis);
    yGroup.call(yAxis);

    // format axis
    xGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end');

}
d3.json('house_price.json').then(data =>{
    console.log({data})
    update(data);
})

const handleMouseOver = (e, d) => {
    d3.select(e.target)
      .transition().duration(500)
        .attr('fill', 'darkblue')
}

const handleMouseOut = (e, d) => {
    d3.select(e.target)
      .transition().duration(500)
        .attr('fill', 'blue')
}

  