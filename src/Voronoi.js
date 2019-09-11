import React, { Component } from 'react';
import * as d3 from 'd3';
import { BLUE, YELLOW, RED, BLACK, getCentroids, getRandomInt, getBrightness, closest, download } from './util';
import { Delaunay } from "d3-delaunay";
import "./Voronoi.css";



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
    this.tick = this.tick.bind(this);
    this.state = {
        ticks: 0,
    };
    this.ticker = setInterval(() => this.tick(), 100);
  }

  componentDidUpdate() {
    let imageWidth = this.props.imageWidth;
    let imageHeight = this.props.imageHeight;
    let width = this.props.width;
    let height = this.props.height;

    let custom = d3.select(document.createElement('custom'))



    console.log(this.props.sites[0])

    let selection = custom
                    .selectAll('custom.circle')
                    .data(this.props.sites)
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
  }

  componentDidMount() {

    let imageWidth = this.props.imageWidth;
    let imageHeight = this.props.imageHeight;
    let width = this.props.width;
    let height = this.props.height;

    let custom = d3.select(document.createElement('custom'))



    console.log(this.props.sites[0])

    let selection = custom
                    .selectAll('custom.circle')
                    .data(this.props.sites)
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

    
  }

    tick() {
      

      let newTicks = this.state.ticks + 1;
      console.log("say hello " + this.state.ticks)
      this.setState({ticks: newTicks});


      
      this.props.doUpdateBadName();

      if (this.state.ticks > 15) {
          clearInterval(this.ticker);

      }
    }

  componentShouldUpdate() {
    return true
  }

  /**

  componentWillUnmount() {

    clearInterval(this.timerID);
    this.cities = d3.select(this.svg)
                    .append("g")
                    .attr("class", "sites")
                    .selectAll("circle")
                    .data([])
                    .remove();
    
  }
  **/


  /**
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
  **/

  draw(){

  }
  /**
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
  **/
  render() {
    return  <div>
             <canvas width={this.props.width + "px"} height={this.props.height + "px"} className="VoronoiCanvas" ref={this.canvasRef}></canvas>
            </div>
  }
}