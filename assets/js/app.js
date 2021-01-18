var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
    };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {

    // Create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
    
return xLinearScale;

}

// Function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {

    // Create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
        d3.max(healthData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);
    
return yLinearScale;

}

// Function used for updating xAxis var upon click on  x-axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// Function used for updating yAxis var upon click on y-axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
  
    return yAxis;
}

// Function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// Function used for updating circles group with a transition to new circles
function renderText(circleText, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    
    circleText.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circleText;
}

// Function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleText) {
    var xLabel;

    if (chosenXAxis === "poverty") {
        xLabel = "In Poverty (%):";
    }
    else if (chosenXAxis === "age") {
        xLabel = "Age (Median):";
    }
    else {
        xLabel = "Household Income (Median):";
    }

    var yLabel;

    if (chosenYAxis === "healthcare") {
        yLabel = "Lacks Healthcare (%):";
    }
    else if (chosenYAxis === "smokes") {
        yLabel = "Smokes (%):";
    }
    else {
        yLabel = "Obese (%):";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([70, 70])
        .html(function(d) {
                
            return (`${d.abbr}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
        });
    
    // Circles tooltip in chart
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    // .on(mouseout) event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // Text tooltip in chart
    circleText.call(toolTip);

    circleText.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    // .on(mouseout) event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    return circlesGroup;
}

// Text tooltip in chart

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;

    // parse data
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare =+data.healthcare;
        data.smokes =+data.smokes;
        data.obesity =+data.obesity;
    });

    // Create xLinearScale and yLinearScale function
    var xLinearScale = xScale(healthData, chosenXAxis);
    var yLinearScale = yScale(healthData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append the x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append the y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Append initial circles
    var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "red")
        .attr("opacity", ".5");

    // Create a group for the text in circles
    var circleText = chartGroup.selectAll(".stateText")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]*.98))
        .attr("font-size", "10px")
        .style("font-weight", "bold");

    // Create group for three x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");
    
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

    // Create group for three y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 250)
        .attr("y", -465)
        .attr("dy", "1em")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("axis-text", true)
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 250)
        .attr("y", -485)
        .attr("dy", "1em")
        .attr("value", "smokes") // value to grab for event listener
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Smokes (%)");
  
    var obesityLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")  
        .attr("x", 250)
        .attr("y", -505)
        .attr("dy", "1em")
        .attr("value", "obesity") // value to grab for event listener
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Obesity (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleText);    

    // X axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            
            // Get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                
                // Replace chosenXAxis with value
                chosenXAxis = value;

                // Updates x scale for new data
                xLinearScale = xScale(healthData, chosenXAxis);

                // Update x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);

                // Update circles with new values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // Update text with new values
                circleText = renderText(circleText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // Update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleText);

                // Changes classes to change bold text for x axis
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
    });

    // Y axis labels event listener
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            
            // Get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
                
                // Replace chosenXAxis with value
                chosenYAxis = value;

                // Updates x scale for new data
                yLinearScale = yScale(healthData, chosenYAxis);

                // Update x axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // Update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // Update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

            // Changes classes to change bold text for y axis
            if (chosenYAxis === "healthcare") {
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === "smokes"){
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
});
}).catch(function(error) {
    console.log(error);
  });
