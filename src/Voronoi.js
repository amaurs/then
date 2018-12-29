import React, { Component } from 'react';
import * as d3 from 'd3';
import robot from './assets/our-lady.jpg';
import { getCentroidsNew, getDifference, getRandomInt, getBrightness, getBrightnessFromXY, getColor, getCentroids} from './util';
import {Delaunay} from "d3-delaunay";

const xStep = 10,
      yStep = 10;

let numPoints = 0;

export default class Voronoi extends Component {

  constructor(props) {
    super(props);
    console.log(this.props.imageData);
    
    this.state = {
                  time: 0
                 };
  }

  componentDidMount() {
    
    let sites = [];

    let total = Math.floor((this.props.imageWidth / xStep) * (this.props.imageHeight / yStep));
    console.log("total:" + total)

    this.updateDimensions(this.props.imageWidth, this.props.imageHeight);

    let xScale = d3.scaleLinear()
              .domain([0, this.props.imageWidth])
              .range([0, this.props.width]);
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

    
    

    //sites.map(function(d, i){console.log(i);})
    //let diagram = d3.voronoi().polygons(sites);
    
    const delaunayNew = Delaunay.from(sites);
    const voronoiNew = delaunayNew.voronoi([0, 0, this.props.imageWidth, this.props.imageHeight]);
    const diagramNew = voronoiNew.cellPolygons();
    let sitesNew = getCentroidsNew(diagramNew);

    let imageData = this.props.imageData;

    
    this.setState({sites:sitesNew});
   
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
    const voronoiNew = delaunayNew.voronoi([0, 0, this.state.imageWidth, this.state.imageHeight]);
    const diagramNew = voronoiNew.cellPolygons();
    let sitesNew = getCentroidsNew(diagramNew);

    //let voronoi = d3.voronoi().extent([[0,0],[this.state.imageWidth, this.state.imageHeight]]);
    //let diagram = voronoi.polygons(this.state.sites);
    //let sites = getCentroids(diagram);

    let sitesOld = this.state.sites;

    //debugger;

    let diff = getDifference(sitesOld, sitesNew);

    this.setState({sites:sitesNew});

    let xScale = d3.scaleLinear()
              .domain([0, this.props.imageWidth])
              .range([0, this.props.width]);
    let yScale = d3.scaleLinear()
              .domain([0, this.props.imageHeight])
              .range([0, this.props.height]);

    let imageData = this.props.imageData;



    d3.select(this.svg)
      .selectAll('circle')
      .data(this.state.sites)
      .transition()
      .duration(100)
      .attr("cx", function(d) { return xScale(+d[0]);})
      .attr("cy", function(d) { return yScale(+d[1]);})
      .style("fill", function(d) { return  getColor(imageData, Math.floor(+d[0]), Math.floor(+d[1]));})
      .style("stroke", function(d) { return  getColor(imageData, Math.floor(+d[0]), Math.floor(+d[1]));});
  
    console.log(diff)
    if(this.state.time > 10) {
      clearInterval(this.timerID);
    }
  }

  updateDimensions(w, h){
    let dims = this.svg.getBoundingClientRect();
    let finalWidth = (w / h) * dims.height;
    this.setState({width : finalWidth, 
                   height : dims.height,
                   imageWidth: w,
                   imageHeight: h});
  }

  render() {
    return <svg ref={ svg => this.svg = svg } />;
  }
}