// Access the data
var dataset = d3.json("data/samples.json")

// Select the select toggle for subject ID
var selector = d3.select("select");
var metaTable = d3.select(".panel-body")
// d3.selectAll("#selDataset").on("change", optionChanged);

function AppendSelect(item) {
    Object.entries(item).forEach(([key, value]) => {
        var subjID = selector.append("option");
        subjID.text(value);
        subjID.attr("value", key);
    });
};

// Function to add metadata to the "Demographic Info" panel
function appendRow(mdata) {
    Object.entries(mdata).forEach(([key, value]) => {
        var item = metaTable.append("div");
        // Transform the keys to uppercase
        item.text(key.toUpperCase() + ': ' + value);
    });
};

console.log(dataset);

// Display the default plot
function init() {
    
    dataset.then(function(data) {
        // Grab values from the data json object to build the initial plot
        var subjectIDs = data.names
        var otu_ids = data.samples[0].otu_ids;
        var otu_labels = data.samples[0].otu_labels;
        var sample_values = data.samples[0].sample_values;
        var wfreq = data.metadata[0].wfreq;
        var metadata = data.metadata[0];

        appendRow(metadata);

        // Bar chart setup
        var trace1 = [{
            x: sample_values.slice(0, 10),
            y: otu_ids.slice(0,10).map(i => "OTU " + i),
            text: otu_labels.slice(0, 10),
            type: "bar",
            orientation: "h",
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'
            }]
        }];
        
        Plotly.newPlot("bar", trace1)
        
        // Bubble plot setup
        var trace2 = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                sizeref: 1.1,
                color: otu_ids,
                colorscale: 'Earth',
                size: sample_values
            }
        }];
          
        var layout2 = {
            showlegend: false,
            xaxis: {
                title: "OTU ID"
            }
        };
          
        Plotly.newPlot('bubble', trace2, layout2);

        // Gauge plot setup
        // Modified from https://codepen.io/plotly/pen/rxeZME
        // I don't really understand all the code here, but I was able to tweak it
        // Trig to calc meter point
        var degrees = 9 - wfreq,
            radius = .5;
        var radians = degrees * Math.PI / 9;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ 
            type: 'scatter',
            x: [0],
            y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'Scrubs /Week',
            text: wfreq,
            hoverinfo: 'text+name'},
            { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', 
                        '2-3', '1-2', '0-1', ''],
            textinfo: 'text',
            textposition:'inside',	  
            marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(50, 154, 22, .5)',
                                    'rgba(85, 185, 45, .5)', 'rgba(115, 200, 75, .5)',
                                    'rgba(170, 222, 95, .5)', 'rgba(210, 228, 135, .5)',
                                    'rgba(232, 226, 202, .5)', 'rgba(205, 195, 155, .5)', 
                                    'rgba(175, 175, 125, .5)', 'rgba(255, 255, 255, 0)']},
            labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', 
                        '2-3', '1-2', '0-1', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
        }];

        var layout = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
            xaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]}
        };

        Plotly.newPlot('gauge', data, layout, {showSendToCloud:true});

        AppendSelect(subjectIDs);

    })

};

// Update the restyled plot's values
function updatePlotlyBar(newdata) {
    Plotly.restyle("bar", newdata);
}

function updatePlotlyBubble(newdata) {
    Plotly.restyle("bubble", newdata);
    // Plotly.restyle("gauge", "values", [newdata]);
}

// Function called by DOM changes
function optionChanged() {

    // d3.event.preventDefault();

    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var subjectID = dropdownMenu.property("value");
    // console.log(subjectID)//.property("value"))
    // console.log(document.getElementById(subjectID))
    
    
    
    dataset.then(function(data) {

        // Initialize an empty array for the country's data
        // var data = [];
    
        var otu_ids = data.samples[subjectID].otu_ids;
        var otu_labels = data.samples[subjectID].otu_labels;
        var sample_values = data.samples[subjectID].sample_values;
        var wfreq = data.metadata[subjectID].wfreq;
        var metadata = data.metadata[subjectID];

        // Bar chart update setup
        var trace1 = {
            x: [sample_values.slice(0, 10)],
            y: [otu_ids.slice(0,10).map(i => "OTU " + i)],
            text: [otu_labels.slice(0, 10)],
        };

        updatePlotlyBar(trace1);

        // Bubble plot update setup
        var trace2 = {
            x: [otu_ids],
            y: [sample_values],
            text: [otu_labels],
            marker: {
                sizeref: 1.1,
                color: otu_ids,
                colorscale: 'Earth',
                size: sample_values
            }
        };
            
        updatePlotlyBubble(trace2);

    });
}



init();