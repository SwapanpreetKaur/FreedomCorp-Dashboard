TimeLine = function(_parentElement,_variable){
    this.parentElement = _parentElement;
    this.variable = _variable;
    
    this.initVis();
}

TimeLine.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 0, right: 100, bottom: 20, left: 80};
    vis.outerWidth = 800;
    vis.outerHeight = 100;
    vis.innerWidth = vis.outerWidth - vis.margin.left - vis.margin.right;
    vis.innerHeight = vis.outerHeight - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select(vis.parentElement).append('svg')
    		        .attr('width',outerWidth)
    		        .attr('height',outerHeight)

    vis.t = function(d) { return d3.transition().duration(1000); }

    vis.g = vis.svg.append('g')
               .attr('transform','translate(' + vis.margin.left + ',' + vis.margin.top + ')');

    vis.x = d3.scaleTime().range([0, vis.innerWidth]);

    vis.y = d3.scaleLinear().range([vis.innerHeight, 0]);

    vis.xAxisCall = d3.axisBottom()
                      .ticks(4);

    vis.xAxis = vis.g.append('g')
      			       .attr('class','x axis')
      			       .attr('transform','translate(0,' + vis.innerHeight +')');

    // Add area path for first time
    vis.areaPath = vis.g.append('path')
                      .attr('fill','#ccc');

    // Intiliaze brush component or brush generator
    vis.brush = d3.brushX()
			            .handleSize(10)
			            .extent([[0, 0],[vis.innerWidth, vis.innerHeight]])
                  .on('brush end', brushed)

    // Append brush component with g element or calling brush
    vis.brushComponent = vis.g.append('g')
                            .attr('class', 'brush')
                            .call(vis.brush);

    vis.wrangleData();
}

// Nest data according to date ,give key value pairs
// data values are sum separately for each date using reduce function
TimeLine.prototype.wrangleData = function(){
    var vis = this;

    dateNest = d3.nest()
                 .key(function(d){ return formatTime(d.date); })
                 .entries(calls)

    vis.dataFiltered = dateNest.map(function(d){
    	return {
    		date: d.key,
    		sum: d.values.reduce(function(accu,curr)
    		{ return accu + curr[vis.variable];
    		},0)
    	}
    })

    vis.updateVis();
}

TimeLine.prototype.updateVis = function(){

    var vis = this;

    vis.x.domain(d3.extent(vis.dataFiltered,function(d){ {return parseTime(d.date); }}));
    vis.y.domain([0,d3.max(vis.dataFiltered,function(d){return d.sum })])

    vis.xAxisCall.scale(vis.x)
    vis.xAxis.transition(vis.t()).call(vis.xAxisCall)

    // Redrawing area path
    vis.area0 = d3.area()
                  .x((d) => { return vis.x(parseTime(d.date)); })
                  .y0(vis.innerHeight)
                  .y1(vis.innerHeight);

    vis.area = d3.area()
                 .x(function(d){ return vis.x(parseTime(d.date)); })
                 .y0(vis.innerHeight)
                 .y1(function(d){ return vis.y(d.sum); })

    vis.areaPath
       .data([vis.dataFiltered])
       .attr('d',vis.area);

}

