// Build a bar chart
//
// This file creates static elements and variables, and defines drawing
// functions

/* *************************** Settings ***************************** */

// Track the occupational code and occupation as string variables
var code = 'code';
var occupation = 'occupation';
var allData;

// Margin: how much space to put in the SVG for axes/titles
var margin = {
    left: 100,
    bottom: 500,
    top: 50,
    right: 50
};

// Height and width of the total area
var height = 800;
var width = 1000;

// Height/width of the drawing area for data symbols
var drawHeight = height - margin.bottom - margin.top;
var drawWidth = width - margin.left - margin.right;

/* *************************** Static elements ***************************** */
// Select SVG to work with, setting width and height (the vis <div> is defined
// in the index.html file)
var svg = d3.select('#vis')
    .append('svg')
    .attr('height', height)
    .attr('width', width);

// Append a 'g' element in which to place the rects, shifted down and right
// from the top left corner
//
// The SVG <g> element is used to group SVG shapes together. Once grouped you
// can transform the whole group of shapes as if it was a single shape.
var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('height', drawHeight)
    .attr('width', drawWidth);

// Append an xaxis label to your SVG, specifying the 'transform' attribute to
// position it (don't call the axis function yet)
//
// Axis labels aren't built-in to D3's axis component, but you can add labels
// yourself simply by adding an SVG text element.
var xAxisLabel = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
    .attr('class', 'axis')


// Append an xaxis label to your SVG, specifying the 'transform' attribute to
// position it (don't call the axis function yet)
//
// Axis labels aren't built-in to D3's axis component, but you can add labels
// yourself simply by adding an SVG text element.
var yAxisLabel = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

// Append text to label the x axis (don't specify the text yet)
var xAxisText = svg.append('text')
    .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 40) + ')')
    .attr('class', 'title')
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

// Append text to label the y axis (don't specify the text yet)
var yAxisText = svg.append('text')
    .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + drawHeight / 2) + ') rotate(-90)')
    .attr('class', 'title');

// Define xAxis using d3.axisBottom(). Scale will be set in the setAxes function.
//
// D3 provides four methods, with their names indicating their alignment,
// for creating an axis generator: d3.axisTop, d3.axisRight, d3.axisBottom,
// and d3.axisLeft. A top aligned axis is horizontal and has ticks drawn above
// the axis. A bottom aligned axis is horizontal and has ticks drawn below the
// axis. A left aligned axis is vertical and has ticks aligned to the left of
// the axis. A right aligned axis is vertical and has ticks aligned to
// the right of the axis.
//
// An axis takes a scale function. The scale function is necessary to
// determine what values in the scale correspond to which pixels in the element
// that the chart is drawn in. The scale can either be passed to the axis when
// creating it or through its scale method.
var xAxis = d3.axisBottom();

// Define yAxis using d3.axisLeft(). Scale will be set in the setAxes function.
//
// In order to know what values exist at points along an axis, ticks are used.
// These are rendered using a line and a text value.

// The length of the lines drawn for each tick can be controlled. The ticks at
// the beginning and end of an axis are outer ticks, while all other ticks are
// inner ticks. Inner and outer ticks can be specified to have different
// lengths by using the tickSizeInner and tickSizeOuter methods. If you want
// both to have the same size, you can just use the tickSize method.
//
// https://www.pshrmn.com/tutorials/d3/axes/
var yAxis = d3.axisLeft()
    .tickFormat(d3.format(".0%"));

// Define an xScale with d3.scaleBand. Domain/rage will be set in the
// setScales function.
//
// When creating bar charts scaleBand helps to determine the geometry of
// the bars, taking into account padding between each bar. The domain is
// specified as an array of values (one value for each band) and the range as
// the minimum and maximum extents of the bands (e.g. the total
// width of the bar chart).
//
// In this example the domains in the xscale will be the occupations.
//
// In effect scaleBand will split the range into N bands (where n is the
// number of values in the domain array) and compute the positions and widths
// of the bands taking into account any specified padding.
var xScale = d3.scaleBand();

// Define a yScale with d3.scaleLinear. Domain/rage will be set in the
// setScales function.
//
// A linear scale constructs a new continuous scale with the unit domain [0, 1],
// the unit range [0, 1], the default interpolator and clamping disabled.
// Linear scales are a good default choice for continuous quantitative data
// because they preserve proportional differences.
var yScale = d3.scaleLinear();

/* *************************** Set scales ***************************** */

// Write a function for setting scales.
var setScales = function(data) {
    // Get the unique values of occupation for the domain of your x scale
    var occupation = data.map(function(d) {
        return d.occupation;
    });

    // When you first start out draw­ing some­thing using D3, you need to think
    // about 2 main things.
    // 1. The size of your dataset.
    // 2. The dimen­sions of the browser/svg on which you want to ren­der
    // your data.
    //
    // The for­mer is what is known as the domain and the lat­ter asso­ci­ated
    // with range.
    //
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
    .duration(1500).call(xAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

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
    var barsEnter = bars.enter().append('rect')
        .attr('x', function(d) {
            return xScale(d.occupation);
        })
        .attr('y', function(d) {
            return drawHeight;
        })
        .attr('height', 0)
        .attr('class', 'bar')
        .style("fill", "red")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr('width', xScale.bandwidth())
        .merge(bars)
        .transition()
        .duration(300)
        .delay(function(d, i) {
            return i * 50;
        })
        .attr('y', function(d) {
            return yScale(d.probability);
        })
        .attr('height', function(d) {
            return drawHeight - yScale(d.probability);
        });

        // Use the .enter() method to get your entering elements, and assign initial positions
        bars.merge(barsEnter)
            .attr('x', function(d) {
                return xScale(d.occupation);
            })
            .attr('y', function(d) {
                return drawHeight;
            })
            .attr('height', 0)
            .attr('class', 'bar')
            .style("fill", "red")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr('width', xScale.bandwidth())
            .merge(bars)
            .transition()
            .duration(300)
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
