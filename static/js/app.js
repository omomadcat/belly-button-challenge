// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var resultArray = metadata.filter(item => item.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    })
  });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let selectedSample = samples.find(sampleData => sampleData.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = selectedSample.otu_ids;
    let otuLabels = selectedSample.otu_labels;
    let sampleValues = selectedSample.sample_values;

    // Create a dropdown menu
    const dropdown = d3.select("#dropdown")
      .append("select")
      .selectAll("option")
      .data(samples.map(s => s.id))
      .enter()
      .append("option")
      .text(d => d)
      .attr("value", d => d);

    // Function to update the chart based on selected individual
    function updateChart(selectedData) {
        const top10OTUs = selectedData.otu_ids.slice(0, 10);
        const top10Values = selectedData.sample_values.slice(0, 10);
        const top10Labels = selectedData.otu_labels.slice(0, 10);

        top10OTUs.reverse();
        top10Values.reverse();
        top10Labels.reverse();

        // Create data for the horizontal bar chart
        const traceBar = {
          x: top10Values,
          y: top10OTUs.map(id => `OTU ${id}`),
          text: top10Labels,
          type: "bar",
          orientation: "h"
        };

        const layoutBar = {
          title: "Top 10 Bacteria Cultures Found",
          xaxis: {title: "Number of Bacteria"},
          yaxis: {title: "OTU IDs"}
        };
        
        //Plot the bar chart
        Plotly.newPlot("bar", [traceBar], layoutBar);
    }
    // Initialize with the first individual's data
    updateChart(selectedSample);

    // Build a Bubble Chart
    const traceBubble = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: `markers`,
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: `Earth`
      }
    };

    const layoutBubble = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'},
      autosize: true
    };

    // Render the Bubble Chart
    Plotly.newPlot(`bubble`, [traceBubble], layoutBubble);

  });
};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select(`#selDataset`);

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    var firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();