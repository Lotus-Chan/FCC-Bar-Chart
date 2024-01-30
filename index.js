const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

document.addEventListener("DOMContentLoaded", () => {
  // Loads content from the url
  const req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.send();
  req.onload = () => {
    let json = JSON.parse(req.responseText);
    let jsonDatesYearsOnly = json.data.map((dates) => dates[0].slice(0, 4));

    const w = 900;
    const h = 500;
    const padding = { top: 20, bottom: 40, left: 50, right: 20 };

    const xScale = d3
      .scaleTime()
      .domain([
        new Date(d3.min(jsonDatesYearsOnly)),
        d3.max(json.data, (d) => new Date(d[0])),
      ])
      .range([padding.left, w - padding.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(json.data, (d) => d[1])])
      .range([h - padding.bottom, padding.bottom]);

    // Creates the tooltip when hovered
    const tooltip = d3
      .select("#container")
      .data(json.data)
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

    // Creates the mouse event functions
    const mouseover = (event, d) => {
      const [x, y] = d3.pointer(event);
      tooltip
        .style("opacity", 0.8)
        .style("left", x + 10 + "px")
        .style("top", y + 10 + "px")
        .html("Date: " + d[0] + "<br>Value: $" + d[1] + "B")
        .attr("data-date", d[0]);
    };

    const mouseleave = () => {
      tooltip.style("opacity", 0);
    };

    // Constructs the svg container
    const svg = d3
      .select("#container")
      .append("svg")
      .attr("id", "bar-chart")
      .attr("width", w)
      .attr("height", h)
      .append("g");

    // Adds the X axis
    svg
      .append("g")
      .attr("transform", "translate(0," + (h - padding.bottom) + ")")
      .attr("id", "x-axis")
      .call(d3.axisBottom(xScale));

    // Adds the Y axis
    svg
      .append("g")
      .attr("transform", "translate(" + padding.left + ",0)")
      .attr("id", "y-axis")
      .call(d3.axisLeft(yScale));

    // Adds labeling for Y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", padding.left)
      .attr("x", 0 - h / 2)
      .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .text("USD (Billions)");

    // Renders the data inside the svg
    svg
      .selectAll("mybar")
      .data(json.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => {
        return xScale(new Date(d[0]));
      })
      .attr("y", (d) => {
        return yScale(d[1]);
      })
      .attr("width", 3.25)
      .attr("height", (d) => {
        return h - padding.bottom - yScale(d[1]);
      })
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("fill", "#3488b0")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);
  };
});
