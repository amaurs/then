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

const TIME = 1000;
export default class Voronoi extends Component {

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.tick = this.tick.bind(this);
    this.state = {
        ticks: 0,
    };
    this.ticker = setInterval(() => this.tick(), TIME);
  }

  componentDidUpdate() {
    this.draw();
  }

  componentDidMount() {
    this.draw();
  }

  draw() {
    console.log(this.props.sites.length)

    let imageWidth = this.props.imageWidth;
    let imageHeight = this.props.imageHeight;
    let width = this.props.width;
    let height = this.props.height;
    let context = this.canvasRef.current.getContext('2d');
    context.clearRect(0, 0, width, height);
    this.props.sites.forEach(function(d){
        context.beginPath();
        context.fillStyle = d3.rgb(+d.r, +d.g, +d.b);
        let x = (+d.x / imageWidth) * width;
        let y = (+d.y / imageHeight) * height;
        let r = getRadius(d);
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.fill();
    })
  }

  tick() {
      let newTicks = this.state.ticks + 1;
      console.log("say hello " + this.state.ticks)
      this.setState({ticks: newTicks});
      
      this.props.doUpdateBadName(TIME);

      if (this.state.ticks > 5) {
          clearInterval(this.ticker);

      }
   }

  componentWillUnmount() {
    clearInterval(this.timerID);    
  }

  render() {
    return  <div>
             <canvas width={this.props.width + "px"} height={this.props.height + "px"} className="VoronoiCanvas" ref={this.canvasRef}></canvas>
            </div>
  }
}