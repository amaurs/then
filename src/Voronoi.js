import React, { Component } from 'react';
import * as d3 from 'd3';
import { getBrightness } from './util';
import "./Voronoi.css";

function getRadius(d) {
    return  2 + 2 * getBrightness(d.r, d.g, d.b);
}

const TIME = 500;
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
    let context = this.canvasRef.current.getContext('2d');
    context.clearRect(0, 0, this.props.canvasWidth, this.props.canvasHeight);
    this.props.sites.forEach(function(d){
        context.beginPath();
        context.fillStyle = d3.rgb(+d.r, +d.g, +d.b);
        let x = (+d.x / this.props.imageWidth) * this.props.canvasWidth;
        let y = (+d.y / this.props.imageHeight) * this.props.canvasHeight;
        let r = getRadius(d) * this.props.canvasWidth / 800;
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.fill();
    }.bind(this))
  }

  tick() {
      let newTicks = this.state.ticks + 1;
      this.setState({ticks: newTicks});
      this.props.updateCities(TIME);
      if (this.state.ticks > 10) {
          clearInterval(this.ticker);

      }
   }

  componentWillUnmount() {
    clearInterval(this.timerID);    
  }

  render() {
    let isVertical = this.props.height / this.props.width < 1;
    return  <div>
             <canvas className={"VoronoiCanvas" + (isVertical?"":" vertical")} width={this.props.canvasWidth + "px"} height={this.props.canvasHeight + "px"} ref={this.canvasRef}></canvas>
            </div>
  }
}