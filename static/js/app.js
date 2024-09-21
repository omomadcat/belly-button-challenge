// Build the metadata panel
function buildMetadata(sample) {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata for the selected sample
    const metadata = data.metadata;
    const result = metadata.find(item => item.id == sample);

    // Select the panel with id `#sample-metadata` and clear any existing content
    const panel = d3.select("#sample-metadata").html("");

    // Append new tags for each key-value pair in the metadata
    Object.entries(result).forEach(([key, value]) => {
      panel.append("p").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the sample data for the selected sample
    const samples = data.samples;
    const selectedSample = samples.find(sampleData => sampleData.id == sample);

    // Get the OTU data
    const otuIds = selectedSample.otu_ids;
    const otuLabels = selectedSample.otu_labels;
    const sampleValues = selectedSample.sample_values;

    // Create the bar chart (Top 10 OTUs)
    const top10OTUs = otuIds.slice(0, 10).reverse();
    const top10Values = sampleValues.slice(0, 10).reverse();
    const top10Labels = otuLabels.slice(0, 10).reverse();

    const traceBar = {
      x: top10Values,
      y: top10OTUs.map(id => `OTU ${id}`),
      text: top10Labels,
      type: "bar",
      orientation: "h"
    };

    const layoutBar = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      yaxis: { title: "OTU IDs" },
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", [traceBar], layoutBar);

    // Create the bubble chart
    const traceBubble = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    };

    const layoutBubble = {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      margin: { t: 30 }
    };

    Plotly.newPlot("bubble", [traceBubble], layoutBubble);
  });
}

// Function to initialize the dashboard
function init() {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    const names = data.names;

    // Populate the dropdown menu
    const dropdown = d3.select("#selDataset");
    names.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Build initial plots and metadata panel using the first sample
    const firstSample = names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for updating charts and metadata when a new sample is selected
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
