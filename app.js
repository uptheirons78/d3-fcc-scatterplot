const endpoint = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const width = 600;
const height = 400;
const margin = {top:20, left:20, bottom:20, right:20};

d3.json(endpoint, function(err, d) {
    if(err) {
        console.log(`There is an ERROR with data: ${err}`);
    } else {
        var data = d.data; //array of data to use
        //min & max of data
        var xExtent = d3.extent(data, d => new Date( d[0] ));
        var yExtent = d3.extent(data, d => d[1]);
        //scales
        var xScale = d3.scaleTime()
                        .domain(xExtent)
                        .range([0, width]);
        var yScale = d3.scaleLinear()
                        .domain(yExtent)
                        .range([height, 0]);
        //svg
        var svg = d3.select('body')
                        .append('svg')
                            .attr('width', width) 
                            .attr('height', height); 
        //rectangles
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
                .attr('x', d => xScale(new Date(d[0])))
                .attr('y', d => yScale(d[1]))
                .attr('width', width / data.length)
                .attr('height', d => height - yScale(d[1]))
                .attr('fill', 'blue')
                .attr('stroke', '#fff');

    }
});