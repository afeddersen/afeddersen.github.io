// Build a scatter plot
// This file creates static elements and variables, and defines drawing functions

/* *************************** Settings ***************************** */

// Track the sex (male, female) and drinking type (any, binge) in variables
var code = 'code';
var occupation = 'occupation';
var allData;

// Margin: how much space to put in the SVG for axes/titles
var margin = {
    left: 100,
    bottom: 100,
    top: 50,
    right: 50
};

// Height and width of the total area
var height = 600;
var width = 1000;

// Height/width of the drawing area for data symbols
var drawHeight = height - margin.bottom - margin.top;
var drawWidth = width - margin.left - margin.right;

/* *************************** Static elements ***************************** */
// Select SVG to work with, setting width and height (the vis <div> is defined in the index.html file)
var svg = d3.select('#vis')
    .append('svg')
    .attr('height', height)
    .attr('width', width);

// Append a 'g' element in which to place the rects, shifted down and right from the top left corner
var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('height', drawHeight)
    .attr('width', drawWidth);

// Append an xaxis label to your SVG, specifying the 'transform' attribute to position it (don't call the axis function yet)
var xAxisLabel = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
    .attr('class', 'axis')


// Append a yaxis label to your SVG, specifying the 'transform' attribute to position it (don't call the axis function yet)
var yAxisLabel = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

// Append text to label the x axis (don't specify the text yet)
var xAxisText = svg.append('text')
    .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 40) + ')')
    .attr('class', 'title');

// Append text to label the y axis (don't specify the text yet)
var yAxisText = svg.append('text')
    .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + drawHeight / 2) + ') rotate(-90)')
    .attr('class', 'title');

// Define xAxis using d3.axisBottom(). Scale will be set in the setAxes function.
var xAxis = d3.axisBottom();

// Define yAxis using d3.axisLeft(). Scale will be set in the setAxes function.
var yAxis = d3.axisLeft()
    .tickFormat(d3.format(".0%"));

// Define an xScale with d3.scaleBand. Domain/rage will be set in the setScales function.
var xScale = d3.scaleBand();

// Define a yScale with d3.scaleLinear. Domain/rage will be set in the setScales function.
var yScale = d3.scaleLinear();

/* *************************** Set scales ***************************** */

// Write a function for setting scales.
var setScales = function(data) {
    // Get the unique values of states for the domain of your x scale
    var occupation = data.map(function(d) {
        return d.occupation;
    });

    // Set the domain/range of your xScale
    xScale.range([0, drawWidth])
        .padding(0.1)
        .domain(occupation);

    // Get min/max values of the percent data (for your yScale domain)
    var yMin = d3.min(data, function(d) {
        return +d.probability;
    });

    var yMax = d3.max(data, function(d) {
        return +d.probability;
    });

    // Set the domain/range of your yScale
    yScale.range([drawHeight, 0])
        .domain([0, yMax]);
};

/* *************************** Set axes ***************************** */

// Function for setting axes
var setAxes = function() {
    // Set the scale of your xAxis object
    xAxis.scale(xScale);

    // Set the scale of your yAxis object
    yAxis.scale(yScale);

    // Render (call) your xAxis in your xAxisLabel
    xAxisLabel.transition()
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start")
    .duration(1500).call(xAxis);

    // Render (call) your yAxis in your yAxisLabel
    yAxisLabel.transition().duration(1500).call(yAxis);

    // Update xAxisText and yAxisText labels
    xAxisText.text('Occupation')
    yAxisText.text('Probability of automation (' + code + ')');
};

// Add tip
var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
    return d.occupation;
});
g.call(tip);

/* *************************** Function to filter data ***************************** */

// Write a function to filter down the data to the current sex and type
var filterData = function() {
    var currentData = allData.filter(function(d) {
        return d.code == code
    }).sort(function(a, b) {
        if (a.occupation < b.occupation) return -1;
        if (a.occupation > b.occupation) return 1;
        return 0;
    });
    return currentData;
};

/* *************************** Draw function ***************************** */
// Function to draw data
// Store the data-join in a function: make sure to set the scales and update the axes in your function.
var draw = function(data) {
    // Set scales
    setScales(data);

    // Set axes
    setAxes();

    // Select all rects and bind data
    var bars = g.selectAll('rect').data(data);

    // Use the .enter() method to get your entering elements, and assign initial positions
    bars.enter().append('rect')
        .attr('x', function(d) {
            return xScale(d.occupation);
        })
        .attr('y', function(d) {
            return drawHeight;
        })
        .attr('height', 0)
        .attr('class', 'bar')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr('width', xScale.bandwidth())
        .merge(bars)
        .transition()
        .duration(500)
        .delay(function(d, i) {
            return i * 50;
        })
        .attr('y', function(d) {
            return yScale(d.probability);
        })
        .attr('height', function(d) {
            return drawHeight - yScale(d.probability);
        });

    // Use the .exit() and .remove() methods to remove elements that are no longer in the data
    bars.exit().remove();
};
