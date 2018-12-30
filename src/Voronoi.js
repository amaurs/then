import React, { Component } from 'react';
import * as d3 from 'd3';
import { getCentroidsNew, getRandomInt, getBrightness, getBrightnessFromXY, getColor, getNorm, closest} from './util';
import { Delaunay } from "d3-delaunay";
import { Quadtree } from "d3-quadtree";

const xStep = 4,
      yStep = 4;

export default class Voronoi extends Component {

  constructor(props) {
    super(props);
    console.log(this.props.imageData);
    //this.updateDimensions(this.props.imageWith, this.props.imageHeight);
    this.state = {
                  time: 0
                 };
  }

  componentDidMount() {
    let sites = [];
    let total = Math.floor((this.props.imageWidth / xStep) * (this.props.imageHeight / yStep));
    console.log("total:" + total)
    let dims = this.updateDimensions(this.props.imageWidth, this.props.imageHeight);
    let xScale = d3.scaleLinear()
              .domain([0, this.props.imageWidth])
              .range([0, dims.width]);
    let yScale = d3.scaleLinear()
              .domain([0, this.props.imageHeight])
              .range([0, this.props.height]);

    /** I use the rejection algorithm to get points with the most brightness. **/
    let numPoints = 0;

    while(numPoints < total){
      let x = getRandomInt(0, this.props.imageWidth);
      let y = getRandomInt(0, this.props.imageHeight);
      let i = (y * this.props.imageWidth + x) << 2;
      let brightness = getBrightness(this.props.imageData.data[i + 0], 
                                     this.props.imageData.data[i + 1], 
                                     this.props.imageData.data[i + 2]);
      if (Math.random() >= brightness ) {
        sites.push([x, y]);
        numPoints++;
      }
    }

    const delaunayNew = Delaunay.from(sites);
    const voronoiNew = delaunayNew.voronoi([0, 0, this.props.imageWidth, this.props.imageHeight]);
    const diagramNew = voronoiNew.cellPolygons();
    let sitesNew = getCentroidsNew(diagramNew);

    let imageData = this.props.imageData;

    
    this.setState({sites:sitesNew});
   
   /**
    this.cities = d3.select(this.svg)
                    .append("g")
                    .attr("class", "sites")
                    .selectAll("circle")
                    .data(sitesNew)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) { return xScale(d[0]);})
                    .attr("cy", function(d) { return yScale(d[1]);})
                    .attr("r", function(d) { return 2 * getBrightnessFromXY(imageData, +d[0], +d[1]) + 2;})
                    .attr('opacity', function(d) { return 1;})
                    .style("fill", function(d) { return  getColor(imageData, +d[0], +d[1]);})
                    .style("stroke", function(d) { return  getColor(imageData, +d[0], +d[1]);});
    
    **/
    this.timerID = setInterval(() => this.tick(), 100);
  }

  componentWillUnmount() {
    console.log("Voronoi will unmount.");
    clearInterval(this.timerID);
    this.cities = d3.select(this.svg)
                    .append("g")
                    .attr("class", "sites")
                    .selectAll("circle")
                    .data([])
                    .remove();
    
  }

  imageNotFound(e) {
    alert('That image is found and loaded');
  }

  tick(){
    //debugger;
    let time = this.state.time;
    this.setState({time: time + 1});
    console.log("time: " + this.state.time);

    const delaunayNew = new Delaunay.from(this.state.sites);
    const voronoiNew = delaunayNew.voronoi([0, 0, this.props.imageWidth, this.props.imageHeight]);
    const diagramNew = voronoiNew.cellPolygons();
    let sitesNew = getCentroidsNew(diagramNew);

    this.setState({sites:sitesNew});

    let dims = this.updateDimensions(this.props.imageWidth, this.props.imageHeight);

    let xScale = d3.scaleLinear()
              .domain([0, this.props.imageWidth])
              .range([0, dims.width]);
    let yScale = d3.scaleLinear()
              .domain([0, this.props.imageHeight])
              .range([0, dims.height]);

    let imageData = this.props.imageData;


    /**

    d3.select(this.svg)
      .selectAll('circle')
      .data(this.state.sites)
      .transition()
      .duration(100)
      .attr("cx", function(d) { return xScale(+d[0]);})
      .attr("cy", function(d) { return yScale(+d[1]);})
      .style("fill", function(d) { return  getColor(imageData, Math.floor(+d[0]), Math.floor(+d[1]));})
      .style("stroke", function(d) { return  getColor(imageData, Math.floor(+d[0]), Math.floor(+d[1]));});
  
    **/

    if(this.state.time > 10) {
      clearInterval(this.timerID);

      console.log("final pass to get colors");

      let sites = this.state.sites.slice();

      let coloredSites = sites.map(function(site) {
        let color = getColor(imageData, Math.floor(+site[0]), Math.floor(+site[1]));
        let newSite = site.slice();
        newSite.push(color.r);
        newSite.push(color.g);
        newSite.push(color.b);
        newSite.push(false);
        return newSite;
      });

      let tree = d3.quadtree().addAll(coloredSites);

      let final = []
      coloredSites.forEach(function(site) {

        let treeCopy = tree.copy();
        

        

        let oldColor = [site[2], site[3], site[4]]
        let newColor = closest(site[2], site[3], site[4]);

        let error = [oldColor[0] - newColor[0],
                     oldColor[1] - newColor[1],
                     oldColor[2] - newColor[2]]


        final.push([site[0], 
                    site[1], 
                    newColor[0], 
                    newColor[1],
                    newColor[2],
                    true]);


        let current = site;

        [7.0/16, 5.0/16, 3.0/16, 1.0/16].forEach(function(d) {

            if(typeof current !== "undefined") {
                treeCopy.remove(current);

                let found = treeCopy.find(site[0], site[1]);


                if(typeof found !== "undefined") {

                    found[2] = Math.round(found[2] + error[0] * d)
                    found[3] = Math.round(found[3] + error[1] * d)
                    found[4] = Math.round(found[4] + error[2] * d)
                    found[5] = true;

                    let newFound = treeCopy.find(site[0], site[1]);

                    //debugger
                } 
                
            }
            
        });


        let removed = tree.remove(site);
        

      });

      console.log(tree.size());
    
      this.cities = d3.select(this.svg)
                .append("g")
                .attr("class", "sites")
                .selectAll("circle")
                .data(final)
                .enter()
                .append("circle")
                .attr("cx", function(d) { return xScale(d[0]);})
                .attr("cy", function(d) { return yScale(d[1]);})
                .attr("r", "1")
                .attr('opacity', function(d) { return 1;})
                .style("fill", function(d) { return  d3.rgb(+d[2], +d[3], +d[4]) })
                .style("stroke", function(d) { return  d3.rgb(+d[2], +d[3], +d[4]) });


    }
  }

  updateDimensions(w, h){
    let dims = this.svg.getBoundingClientRect();
    let finalWidth = (w / h) * dims.height;
    return {width : finalWidth, 
                   height : dims.height};
  }

  render() {
    return <svg ref={ svg => this.svg = svg } />;
  }
}