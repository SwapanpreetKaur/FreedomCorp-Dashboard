DonutChart = function(_parentElement){
	this.parentElement = _parentElement;

	this.initVis();
}

DonutChart.prototype.initVis = function(){

	var vis = this;
	vis.margin = { left:40, right:100, top:40, bottom:10 };
	vis.outerWidth = 350;
	vis.outerHeight = 140;
	vis.innerWidth = vis.outerWidth - vis.margin.left - vis.margin.right;
	vis.innerHeight = vis.outerHeight - vis.margin.top - vis.margin.bottom;

	vis.radius = Math.min(vis.innerWidth,vis.innerHeight) / 2;

	vis.svg = d3.select(vis.parentElement)
		        .append('svg')
		        .attr('width',vis.outerWidth)
		        .attr('height',vis.outerHeight);

	vis.g = vis.svg.append('g')
	           .attr('transform','translate(' + (vis.margin.left + (vis.innerWidth / 2) - 50) + ', ' + (vis.margin.top + (vis.innerHeight / 2)) + ')');

	vis.pie = d3.pie()
	            .padAngle(0.03)
	            .value(function(d){ return d.count; })
	            .sort(null);

	// Arc generator
	vis.arc = d3.arc()
	            .innerRadius(vis.radius - 15)
	            .outerRadius(vis.radius);

	vis.g.append('text')
	   .attr('class','title')
	   .attr('y',-60)
	   .attr('x',-90)
	   .attr('font-size','12px')
	   .attr('text-anchor','start')
	   .text('Company size')

	vis.color = d3.scaleOrdinal(d3.schemeOrRd[0,3]);

	vis.addLegend();
	vis.wrangleData();
}

// nest according to company-size
// sum up the each company-size values
DonutChart.prototype.wrangleData = function(){
	var vis = this;

	sizeNest = d3.nest()
                 .key(function(d){ return d.company_size })
                 .entries(calls)

	vis.dataFiltered = sizeNest.map(function(size){
		return {
			value: size.key,
			count: size.values.length
		}
	})

vis.updateVis();
}

DonutChart.prototype.updateVis = function(){
	var vis = this;
    
    // Pass data to pie(), gives pie layout
	vis.path = vis.g.selectAll('path')
	              .data(vis.pie(vis.dataFiltered));

    // Enter arcs for first time 
    // d is atrribute which is tweening
	vis.path.enter().append('path')
	   .attr('class','enter arc')
	   .attr('fill',function(d){ return vis.color(d.data.value); })
	   .transition()
	   .duration(700)
	   .attrTween('d',arcTween);
    
    // Update arcs on screen
	vis.path.attr('class','update arc')
	   .transition()
	   .duration(700)
	   .attrTween('d',arcTween);
    
    // arctween method used for transitions
    function arcTween(d){
    	var i = d3.interpolate(this._current, d);
		this._current = i(0);
		return function(t) { return vis.arc(i(t)); };
    }
}

DonutChart.prototype.addLegend = function(){

	var vis = this;

	var legendG = vis.g.append('g')
	                 .attr('transform','translate(' + 150 + ', ' + -30 + ')')

	var legendArray = ['small','medium','large'];

	legendArray.forEach(function(company_size,i){
		var legendRow = legendG.append('g')
                               .attr('transform','translate(0,' + (i * 20) + ')');

	legendRow.append('rect')
	         .attr('class','legendRect')
	         .attr('width',10)
	         .attr('height',10)
	         .attr('fill',function(d) { return vis.color(company_size); });

	legendRow.append('text')
			 .attr('class','legendText')
			 .attr('x',-10)
			 .attr('y',10)
			 .attr('text-anchor','end') 
			 .text(company_size);  
	})
}