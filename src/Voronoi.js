import React, { Component } from 'react';
import * as d3 from 'd3';
import robot from './assets/our-lady.jpg';
import { getDifference, getRandomInt, getBrightness, getBrightnessFromXY, getColor, getCentroids} from './util';


const xStep = 5,
      yStep = 5;

let numPoints = 0;

export default class Voronoi extends Component {

  constructor(props) {
    super(props);
    let container = 
    this.state = {sites: [],
                  imageData: [],
                  width: 0,
                  height: 0,
                  imageWidth:0,
                  imageHeight:0,
                  time: 0};
  }

  componentDidMount() {
    const image = new Image();
    image.src = robot;
    image.onload = this.loadImage.bind(this);
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

  loadImage(e){
    const image = e.path[0];
    let canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    let imageData = context.getImageData(0, 0, image.width, image.height);
    let sites = [];



    let total = Math.floor((imageData.width / xStep) * (imageData.height / yStep));

    console.log("total:" + total)

    this.updateDimensions(image.width, image.height);

    let xScale = d3.scaleLinear()
              .domain([0, this.state.imageWidth])
              .range([0, this.state.width]);
    let yScale = d3.scaleLinear()
              .domain([0, this.state.imageHeight])
              .range([0, this.state.height]);


    /** I use the rejection algorithm to get points with the most brightness. **/


    while(numPoints < total){
      let x = getRandomInt(0, imageData.width);
      let y = getRandomInt(0, imageData.height);
      let i = (y * imageData.width + x) << 2;
      let brightness = getBrightness(imageData.data[i + 0], 
                                     imageData.data[i + 1], 
                                     imageData.data[i + 2]);
      if (Math.random() >= brightness ) {
        sites.push([x, y]);
        numPoints++;
      }
    }
    
    this.setState({sites:sites, imageData:imageData});

    //sites.map(function(d, i){console.log(i);})
    let diagram = d3.voronoi().polygons(sites);
    
    //let cells = diagram.polygons();

    this.cities = d3.select(this.svg)
                    .append("g")
                    .attr("class", "sites")
                    .selectAll("circle")
                    .data(this.state.sites)
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

  tick(){
    let time = this.state.time;
    this.setState({time: time + 1});
    console.log("time: " + this.state.time);

    let voronoi = d3.voronoi().extent([[0,0],[this.state.imageWidth, this.state.imageHeight]]);
    let diagram = voronoi.polygons(this.state.sites);

    let sites = getCentroids(diagram);

    let diff = getDifference(this.state.sites, sites);

    this.setState({sites:sites});

    let xScale = d3.scaleLinear()
              .domain([0, this.state.imageWidth])
              .range([0, this.state.width]);
    let yScale = d3.scaleLinear()
              .domain([0, this.state.imageHeight])
              .range([0, this.state.height]);

    let imageData = this.state.imageData;


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
    if(diff < 1000) {
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