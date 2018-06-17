StackedAreaChart = function(_parentElement){
  this.parentElement = _parentElement;

  this.initVis();
}

StackedAreaChart.prototype.initVis = function(){

  var vis = this;

  vis.outerHeight = 370;
  vis.outerWidth = 800;
  vis.margin = { left:80, right:100, top:50, bottom:40 };
  vis.innerHeight = vis.outerHeight - vis.margin.top - vis.margin.bottom;
  vis.innerWidth = vis.outerWidth - vis.margin.left - vis.margin.right;

  vis.svg = d3.select(vis.parentElement)
              .append('svg')
              .attr('width',vis.outerWidth)
              .attr('height',vis.outerHeight);

  vis.g = vis.svg.append('g')
             .attr('transform','translate(' + vis.margin.left +  ', ' + vis.margin.top + ')');

  vis.color = d3.scaleOrdinal(d3.schemePuOr[0,4]);

  vis.x = d3.scaleTime().range([0,vis.innerWidth]);
  vis.y = d3.scaleLinear().range([vis.innerHeight,0]);

  vis.yAxisCall = d3.axisLeft();

  vis.xAxisCall = d3.axisBottom()
                    .ticks(4);

  vis.xAxis = vis.g.append('g')
                 .attr('class','x axis')
                 .attr('transform','translate(0,' + vis.innerHeight +')');

  vis.yAxis = vis.g.append('g')
                 .attr('class','y axis');
  
  // Passing keys method to stack
  vis.stack = d3.stack()
                .keys(['west','south','northeast','midwest']);

  // Path generator for area variable
  vis.area = d3.area()
               .x(function(d) { return vis.x(parseTime(d.data.date)); })
               .y0(function(d) { return vis.y(d[0]); })
               .y1(function(d) { return vis.y(d[1]); });

  // Add transitions
  vis.t = function(d) { return d3.transition().duration(1000); }

  vis.addLegend();
  vis.wrangleData();
}

// Nest data according to date 
// Sum values separately for each team 
StackedAreaChart.prototype.wrangleData = function(){

  var vis = this;

  vis.variable = $('#var-select').val();

  dateNest = d3.nest()
               .key(function(d){ return formatTime(d.date); })
               .entries(calls)

  vis.dataFiltered = dateNest.map(function(d){
    return d.values.reduce(function(accu,curr){
      accu.date = d.key
      accu[curr.team] = accu[curr.team] + curr[vis.variable]
      return accu;
    },{
      'northeast':0,
      'midwest':0,
      'south':0,
      'west':0
    })
  })

  vis.updateVis();
}

StackedAreaChart.prototype.updateVis = function(){

  var vis = this;

  vis.maxDateVal = d3.max(vis.dataFiltered, function(d){
    var vals = d3.keys(d).map(function(key){ return key !== 'date' ? d[key] : 0 });
                 return d3.sum(vals);
    });

  vis.x.domain(d3.extent(vis.dataFiltered, function(d){  return parseTime(d.date); }));
  vis.y.domain([0, vis.maxDateVal]);

  vis.xAxisCall.scale(vis.x);
  vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
  vis.yAxisCall.scale(vis.y);
  vis.yAxis.transition(vis.t()).call(vis.yAxisCall);


  // Stacked data in layer form 
  // Append group elements for each layer
  // Append path for each group
  // Attach path by using area generator
  vis.layer = vis.g.selectAll('.teams')
                 .data(vis.stack(vis.dataFiltered));
   
  vis.layer.enter().append('g')
     .attr('class', function(d){ return 'teams ' + d.key })
     .append('path')
     .attr('class','area')
     .attr('d',vis.area)
     .style('fill',function(d){ return vis.color(d.key) })
     .style("fill-opacity", 0.6)

  // Update path for each item
  vis.layer.select('.area')
     .attr('d',vis.area)
}

StackedAreaChart.prototype.addLegend = function(){

  var vis = this;

  var legendG = vis.g.append('g')
                     .attr('transform','translate(' + (20) + ', ' + (-25) + ')');


  var legendArray = ['northeast','west','south','midwest'];

  legendArray.forEach(function(team,i){
  var legendCol = legendG.append('g')
                         .attr('transform','translate(' + (i * 150) + ', ' + 0 + ')')
      
  legendCol.append('rect')
           .attr('class','legendRect')
           .attr('width',10)
           .attr('height',10)
           .attr('fill',function(d) { return vis.color(team); })
     

  legendCol.append('text')
           .attr('class','legendText')
           .attr('x',20)
           .attr('y',10)
           .attr('text-anchor','start')
           .text(team);  
  })
}
