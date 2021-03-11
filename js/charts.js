function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("http://localhost:8000/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("http://localhost:8000/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("http://localhost:8000/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allSamples = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var subjectSample = allSamples.filter(arr => arr["id"] === sample);
    
    console.log(subjectSample);
    
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = subjectSample[0];
    console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    console.log(sampleValues);
    console.log(otuIds);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.sort(function(a, b){return a-b}).slice(-10,-1).reverse();
    console.log(yticks);
    
    

    

    // 8. Create the trace for the bar chart. 
    var barData = [{x: sampleValues, y: yticks, type: "bar", orientation: 'h', hoverinfo: otuLabels}];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Belly Button Horizontal Bar Chart",
      yaxis : {yticks},
      bargap: 0.1
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: yticks,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIds,
        // opacity: [1, 0.8, 0.6, 0.4],
        size: sampleValues
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "BellyButton Bubble Chart",
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    var allMetadata = data.metadata;
    var allMetadataObj = Object.values(allMetadata);
    var allMetadataSet = "id";
    var subjectMetadata = allMetadata.filter(obj => obj[allMetadataSet] === +sample);
    var firstMetadata = subjectMetadata[0];
    var washFreq = subjectMetadata[0].wfreq;
    var washFreqNum = parseFloat(washFreq);
    // console.log(allMetadataObj);
    // console.log(allMetadataSet);
    console.log(subjectMetadata);
    console.log(washFreq);
    console.log(allMetadata);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "lightgray" },
            { range: [2, 4], color: "gray" },
            { range: [4, 6], color: "blue" },
            { range: [6, 8], color: "cyan" },
            { range: [6, 8], color: "darkblue" }
          ]
        }
      }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);


  });
}

