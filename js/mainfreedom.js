// Build a data dashboard to keep tabs on different sales teams. 
// A stacked area chart on the main graph, with a brush below.
// A donut chart show different category comapany size.
// Three bar charts shows average units-sold,revenue,duration.

var parseTime = d3.timeParse('%d/%m/%Y');
var formatTime = d3.timeFormat('%d/%m/%Y');

d3.json('calls.json').then(function(data){

	data.map(function(d){
		d.call_revenue = +d.call_revenue;
		d.units_sold = +d.units_sold;
		d.call_duration = +d.call_duration;
		d.date = parseTime(d.date)
		return d;
	})

	allCalls = data;
    calls = data;

    stackedArea = new StackedAreaChart('#stacked-area')
	timeline = new TimeLine('#timeline','call_revenue')
	donutChart = new DonutChart('#company-size')
    unitsBar = new BarChart('#units-sold','units_sold','Average units_sold')
    revenueBar = new BarChart('#revenue','call_revenue','Average revenue')
    durationBar = new BarChart('#duration','call_duration','Average duration')

})

$('#var-select').on('change',function(){
		stackedArea.wrangleData();
	})

function brushed(){

	var selection = d3.event.selection || timeline.x.range();
	var newValues = selection.map(timeline.x.invert)

	$('#dateLabel1').text(formatTime(newValues[0]))
	$('#dateLabel2').text(formatTime(newValues[1]))

	calls = allCalls.filter(function(d){
        return ((d.date >= newValues[0]) && (d.date <= newValues[1]))
    })

	stackedArea.wrangleData();
    donutChart.wrangleData();
    unitsBar.wrangleData();
    revenueBar.wrangleData();
    durationBar.wrangleData();

}