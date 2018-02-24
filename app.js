const endpoint = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const width = 1000;
const height = 500;
const padding = 50;

//fetch data from the endpoint with d3.json()
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
                        .range([padding, width - padding]);
        var yScale = d3.scaleLinear()
                        .domain(yExtent)
                        .range([height - padding, padding]);
        
        //create axes                
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        //create the tooltip
        var tooltip = d3.select('body')
                        .append('div')
                        .classed('tooltip', true);
        
        //svg
        var svg = d3.select('body')
                        .append('svg')
                            .attr('width', width) 
                            .attr('height', height); 
        //append x axis
        svg.append('g')
            .attr('transform', `translate(0, ${height - padding})`)
            .call(xAxis);
        
        // text label for the x axis
        svg.append("text")             
            .attr("x", width/2)
            .attr("y", height - padding / 4)
            .style("text-anchor", "middle")
            .text("Date");
        //append y axis    
        svg.append('g')
            .attr('transform', `translate(${padding}, 0)`)
            .call(yAxis);    
        // text label for the y axis
        svg.append("text")  
            .attr("transform", "rotate(-90)")           
            .attr("y", padding + 20)
            .attr("x", 0 - (height/2))
            .style("text-anchor", "middle")
            .text("Gross Domestic Product, USA");
        //rectangles
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
                .attr('x', d => xScale(new Date(d[0])))
                .attr('y', d => yScale(d[1]))
                .attr('width', width / data.length)
                .attr('height', d => height - padding - yScale(d[1]))
                .attr('fill', 'lightgreen')
                //add the tooltip to the graph on mousemove over a rect
                .on('mousemove', addTooltip)
                .on('touchmove', addTooltip)
                .on('mouseout', removeTooltip)
                .on('touchend', removeTooltip);
        //title
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", (padding))
        .attr("fill", 'green')
        .attr("text-anchor", "middle")  
        .style("font-size", "32px") 
        .style("font-weight", "bold") 
        .style("text-decoration", "underline")  
        .text("Gross Domestic Product");
        
        //helpers
        function addTooltip(d) {
            tooltip
                .style('opacity', 1)
                .style('left', d3.event.x - 100 + 'px')
                .style('top', d3.event.y - 60 + 'px')
                .html(`
                    <p class="money">${d[1].toLocaleString('en-IN', { style: 'currency', currency: 'USD' })} Billions</p>
                    <p class="time">${moment(d[0]).format('YYYY - MMMM')}</p>
                `);    
        }
        function removeTooltip() {
            tooltip
                .style('opacity', 0);
        }
    }
});