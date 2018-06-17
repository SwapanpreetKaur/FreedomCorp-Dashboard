BarChart = function(_parentElement,_variable,_title){

    this.parentElement = _parentElement;
    this.variable = _variable;
    this.title = _title;

    this.initVis();
}

BarChart.prototype.initVis = function(){

  var vis = this;

    vis.margin = { left:60, right:50, top:30, bottom:30 };
    vis.outerHeight = 130;
    vis.outerWidth = 350;
    vis.innerHeight = vis.outerHeight - vis.margin.top - vis.margin.bottom;
    vis.innerWidth = vis.outerWidth - vis.margin.left - vis.margin.right;

    vis.svg = d3.select(vis.parentElement)
                .append('svg')
                .attr('width',vis.outerWidth)
                .attr('height',vis.outerHeight);

    vis.g = vis.svg.append('g').attr('transform','translate(' + vis.margin.left + ', ' + vis.margin.top + ')');

    vis.color = d3.scaleOrdinal(d3.schemeRdBu[4,9]);

    vis.xScale = d3.scaleBand()
                   .domain(['electronics','furniture','appliances','materials'])
                   .range([0,vis.innerWidth])
                   .padding(0.5);

    vis.yScale = d3.scaleLinear().range([vis.innerHeight,0]);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    vis.xAxisCall = d3.axisBottom()
                      .tickFormat(function(d){ return "" + capitalizeFirstLetter(d); })

    vis.yAxisCall = d3.axisLeft()
                      .ticks(4)

    vis.xAxis = vis.g.append('g')
                   .attr('class','x axis')
                   .attr('transform','translate(0,' + vis.innerHeight +')');

    vis.yAxis = vis.g.append('g')
                   .attr('class','y axis');

    vis.g.append('text')
       .attr('class', 'title')
       .attr('y', -20)
       .attr('x', -50)
       .attr('font-size', '12px')
       .attr('text-anchor', 'start')
       .text(vis.title);

    vis.t = function(d){ return d3.transition().duration(1000); }

    vis.wrangleData();
}

// Nest data according to category
// Calculate average sum of all categories according to units-sold etc
BarChart.prototype.wrangleData = function(){

  var vis = this;
  vis.categoryNested = d3.nest()
                         .key(function(d){ return d.category; })
                         .entries(calls)

  vis.dataFiltered = vis.categoryNested.map(function(category){
      return {
        category : category.key,
        size : (category.values.reduce(function(accu,curr){
          return accu + curr[vis.variable];
        },0) / category.values.length)
      } 
    })
    
    vis.updateVis();
   
}

BarChart.prototype.updateVis = function(){

  var vis = this;

  vis.yScale.domain([0,d3.max(vis.dataFiltered,function(d){ return d.size; })]);

    vis.xAxisCall.scale(vis.xScale);
    vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.yScale);
    vis.yAxis.transition(vis.t()).call(vis.yAxisCall);

    vis.rects = vis.g.selectAll('rect').data(vis.dataFiltered,function(d){ return d.category; })

    // Enter bars 
    vis.rects.enter().append('rect')
             .attr('class','enter')
             .attr('y',function(d){ return vis.yScale(d.size); })
             .attr('height',function(d){ return (vis.innerHeight - vis.yScale(d.size)); })
             .attr('x',function(d){ return vis.xScale(d.category); })
             .attr('width',vis.xScale.bandwidth)
             .attr("fill",function(d){ return vis.color(d.category); })

    // Update bars, add transitions
    vis.rects.attr('class','update')
             .transition(vis.t())
             .attr('y',function(d){ return vis.yScale(d.size); })
             .attr('height',function(d){ return (vis.innerHeight - vis.yScale(d.size)); })
             .attr('x',function(d){ return vis.xScale(d.category); })
             .attr('width',vis.xScale.bandwidth)
             .attr("fill",function(d){ return vis.color(d.category); })

    // Exit bars
    vis.rects.exit()
       .transition(vis.t())
       .attr('class','exit')
       .attr('height',0)
       .attr('y',vis.innerHeight)
       .style('fill-opacity',0.3)
       .remove();
}
