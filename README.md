# javascript-plotly

The data is taken from [Belly Button Biodiversity dataset](http://robdunnlab.com/projects/belly-button-biodiversity/), which catalogs the microbes that colonize human navels.

The data is saved as `data/samples.json` and loaded with D3.

There are 4 elements which update when a new Subject ID is chosen from the select picklist.  

    1. The bar chart captures the top 10 microbes found in the subjects bellybutton.
    2. The gauge is a measure of how frequently the subject washes their bellybutton.
    3. The Demographics Info 'Table' contains metadata about each subject.
    4. The bubble chart displays all the microbes found in each subject's bellybutton.  There is no 3rd dimension of data shown by the bubble chart, the bubble size is redundant to the y axis.

