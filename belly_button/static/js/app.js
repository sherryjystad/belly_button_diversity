function buildMetadata(sample_data) {
  d3.json(`/metadata/${sample_data}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });

    // BONUS: Build the Gauge Chart
    //buildGauge(data.WFREQ);
  });
}

function buildCharts(sample_response) {
  //var bubble//chart_url = `/samples/${sample_response}`      
  //var piechart_url = `/samples/${sample_response}`

 // @TODO: Build a Bubble Chart using the sample data
  d3.json(`/samples/${sample_response}`).then(function (sample_response){
    renderBubbleChart(sample_response);
  });
  
  // @TODO: Build a Pie Chart
  console.log("in pie chart")
  d3.json(`/samples/${sample_response}`).then(function (sample_response){
    renderPieChart(sample_response);
  });
}

function renderPieChart(responseDict) {
  var data = [{
    values: responseDict.sample_values.slice(0,10),
    labels: responseDict.otu_ids.slice(0,10),
    hovertext: responseDict.otu_labels.slice(0,10),
    type: 'pie'
  }];
  var layout = {
      title: '% of Samples Observed',
      margin: { t: 0, l: 0 }
  };

  Plotly.newPlot('pie', data, layout);
}

function renderBubbleChart(responseDict) {
  //console.log("This is the response Dict: ",responseDict)
  let xBubble = responseDict.otu_ids
  let yBubble = responseDict.sample_values
  let bubbleLabels = responseDict.otu_labels
  let bubbleMarker = responseDict.sample_values
  let bubbleColors = responseDict.otu_ids
  let data = {
    x: xBubble,
    y: yBubble,
    mode:"markers",
    marker:{ size:bubbleMarker, color:bubbleColors},
    text: bubbleLabels
  }
  bubbleData = [data];

  let layout = {
    title: 'Belly Button sample', 
    xaxis: {title: "Otu ID"},
    yaxis: {title: "Sample Value"},
    width: 1100,
    height: 500,
    hovermode: 'closest',
  };

  Plotly.newPlot('bubble', bubbleData, layout)
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
