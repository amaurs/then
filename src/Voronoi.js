import React, { Component } from 'react';
import * as d3 from 'd3';
import { BLUE, YELLOW, RED, BLACK, getCentroids, getRandomInt, getBrightness, closest, download } from './util';
import { Delaunay } from "d3-delaunay";
import "./Voronoi.css";

const xStep = 7,
      yStep = 7;

const colorMap = {
    "red": RED,
    "yellow": YELLOW,
    "blue": BLUE,
    "black": BLACK,
}

function getRadius(d) {
    return  3 + 3 * getBrightness(d.r, d.g, d.b);
}


export default class Voronoi extends Component {

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      time: 0,
      sites: null,
      steps: 5,
    };
  }

  componentDidMount() {
    let imageData = this.props.imageData;
    let imageWidth = this.props.imageWidth;
    let imageHeight = this.props.imageHeight;
    let width = this.props.width;
    let height = this.props.height;
    let sites = [];
    let total = Math.floor((imageWidth / xStep) * (imageHeight / yStep));

    /** I use the rejection algorithm to get points with the most brightness. **/
    let numPoints = 0;
    while(numPoints < total){
      let index = getRandomInt(0, imageWidth * imageHeight);
      let site = imageData[index]
      let brightness = getBrightness(site.r, 
                                     site.g, 
                                     site.b);
      if (Math.random() >= brightness ) {
        sites.push(site);
        numPoints++;
      }
    }
    let sitesNew = this.sitesUpdate(sites, imageData, imageWidth, imageHeight);

    let i = 0;
    while(i < 15){
        sitesNew = this.sitesUpdate(sitesNew, imageData, imageWidth, imageHeight);
        i++;
    }



    this.setState({sites:sitesNew});


    


    this.cities = d3.select(this.svg)
                    .attr("viewBox", "0 0 " + imageWidth + " " + imageHeight)
                    .append("g")
                    .attr("class", "sites")
                    .selectAll("circle")
                    .data(sitesNew)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) { return +d.x })
                    .attr("cy", function(d) { return +d.y })
                    .attr("r", getRadius)
                    .style("fill", function(d) { return  d3.rgb(+d.r, +d.g, +d.b) })
                    .style("stroke-width", "0");

    let custom = d3.select(document.createElement('custom'))

    let selection = custom
                    .selectAll('custom.circle')
                    .data(sitesNew)
                    .enter()
                    .append("custom.circle")
                    .attr('x', function(d) { return (+d.x / imageWidth) * width })
                    .attr('y', function(d) { return (+d.y / imageHeight) * height })
                    .attr('r', getRadius)
                    .attr('fillStyle', function(d) { return  d3.rgb(+d.r, +d.g, +d.b) });

    let context = this.canvasRef.current.getContext('2d');
    context.save();
    context.clearRect(0, 0, this.width, this.height);
    
    selection.each(function(d, i) {
        let node = d3.select(this);
        context.beginPath();
        context.fillStyle = node.attr('fillStyle');
        context.arc(node.attr('x'), node.attr('y'), node.attr('r'), 0, 2 * Math.PI);
        context.fill();
    });





    //this.timerID = setInterval(() => this.tick(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    this.cities = d3.select(this.svg)
                    .append("g")
                    .attr("class", "sites")
                    .selectAll("circle")
                    .data([])
                    .remove();
    
  }

  sitesUpdate(sites, imageData, width, height) {
    const delaunay = Delaunay.from(sites, 
                                      function(d) { return d.x },
                                      function(d) { return d.y });
    const voronoi = delaunay.voronoi([0, 0, width, height]);
    const diagram = voronoi.cellPolygons();
    let newSites = getCentroids(diagram).map(function(centroid) {
        let closestIndex = Math.floor(centroid[1]) * width + Math.floor(centroid[0]);
        let closestPixel = imageData[closestIndex];
        return {
                x: centroid[0],
                y: centroid[1],
                r: closestPixel.r,
                g: closestPixel.g,
                b: closestPixel.b
        };
    });

    return newSites;
  }

  imageNotFound(e) {
    alert('That image is found and loaded');
  }

  tick(){
    let imageWidth = this.props.imageWidth;
    let imageHeight = this.props.imageHeight;
    let imageData = this.props.imageData;
    let time = this.state.time;
    let sitesNew = this.sitesUpdate(this.state.sites, imageData, imageWidth, imageHeight);

    
    this.setState({sites:sitesNew, time: time + 1});
    
    this.update(sitesNew);  


    if(this.state.time > 15) {
      clearInterval(this.timerID);
      this.setState({sites:sitesNew});
    }

  }

  draw(){

  }

  update(sites) {
    

    d3.select(this.svg)
      .selectAll('circle')
      .data(sites)
      .transition()
      .duration(100)
      .attr("cx", function(d) { return +d.x })
      .attr("cy", function(d) { return +d.y })
      .attr("r", function(d) { return d.radius? +d.radius : getRadius(d) })
      .style("fill", function(d) {
        let color = d3.rgb(d.r, d.g, d.b);
        return color; })
      .style("stroke-width", "0");
  }

  render() {
    return  <div>
             <canvas width={this.props.width + "px"} height={this.props.height + "px"} className="VoronoiCanvas" ref={this.canvasRef}></canvas>
             <svg ref={ svg => this.svg = svg } />;
            </div>
  }
}