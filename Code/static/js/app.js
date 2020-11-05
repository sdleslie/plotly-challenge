const path = "./samples.json";

var datastore

d3.json(path).then(function(data) {
    datastore = data
    //console.log(data)
    populateSelectElement(d3.select("#selDataset"),data.names)
    samples=data.samples
    update()
});

function update() {
    var selected = d3.select("#selDataset").property("value");
    demopanel(selected);
    charts(selected);
}

function populateSelectElement (element, names) {
    names.forEach(name=>{
        element.append("option")
        .attr("value",name)
        .text(name)
    }
)}

function demopanel(selected) {  
    selecteddata = datastore.metadata.filter((row)=>{return row.id == selected});
    // console.log(selecteddata)
    demographics = d3.select("#sample-metadata")
    demographics.selectAll("p").remove()
    Object.entries(selecteddata[0]).forEach(
        (item) => {demographics.append("p").text(`${item[0]} - ${item[1]}`)}
    )
}

function charts(selected) {
    chartdata = samples.filter((row)=>{return row.id == selected})[0];
    sample_values = chartdata.sample_values;
    otu_ids = chartdata.otu_ids;
    otu_labels = chartdata.otu_labels;

    var trace1 = [{
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(item=>`OTU ${item}`).reverse(),
        type: "bar",
        orientation: "h"
      }];
    layout1 = {title: "Top 10 OTUs"};
      Plotly.newPlot("bar", trace1, layout1);
    
    var trace2 = [{
        x: otu_ids,
        y: sample_values,
        marker:{size:sample_values},
        mode: "markers"
        
      }];
    layout2 = {title: "Bad Bubble"};
      Plotly.newPlot("bubble", trace2, layout2);

      // console.log(chartdata)

 }

d3.select("#selDataset").on("click", function() {
    update()
})
