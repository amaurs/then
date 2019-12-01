import React, { Component } from 'react';
import * as d3 from 'd3';

import { Delaunay } from "d3-delaunay";

import robot from './assets/our-lady.jpg';
import "./Voronoi.css";
import { getXYfromIndex, getRandomIntegerArray, getRandomInt, getBrightness, getCentroids } from './util.js';

function getRadius(d) {
    return  2 + 2 * getBrightness(d.r, d.g, d.b);
}

const TIME = 500;
const UPDATE_LIMIT = 10;
export default class Voronoi extends Component {

  constructor(state) {
    super(state);
    this.canvasRef = React.createRef();
    this.tick = this.tick.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.updateCities = this.updateCities.bind(this);
    this.state = {
        ticks: 0,
        voronoiUpdates: 0,
    };
    if(this.state.voronoiUpdates < UPDATE_LIMIT) {
        this.ticker = setInterval(() => this.tick(), TIME);    
    }
  }

  componentDidUpdate() {
    this.draw();

  }

  componentDidMount() {
    let image = new Image();
        image.src = robot;
        image.onload = this.onLoad;

    this.draw();
  }

  updateCities(duration) {
        let sitesNew = this.sitesUpdate(this.state.sites, this.state.totalData, this.state.imageWidth, this.state.imageHeight);
        const ease = d3.easeCubic;
        let timer = d3.timer((elapsed) => {
           const t = Math.min(1, ease(elapsed / duration));
           let notQuiteNew = sitesNew.map(function(point) {
                let trans = Object.assign({}, point);
                trans.x = trans.oldX * (1 - t) + trans.x * t;
                trans.y = trans.oldY * (1 - t) + trans.y * t;
                trans.r = trans.oldR * (1 - t) + trans.r * t;
                trans.g = trans.oldG * (1 - t) + trans.g * t;
                trans.b = trans.oldB * (1 - t) + trans.b * t;
                return trans;
           })
           this.setState({sites: notQuiteNew});
           if (t === 1) {
               timer.stop();
           }
        });
        let voronoiUpdates = this.state.voronoiUpdates + 1;
        this.setState({sites: sitesNew, voronoiUpdates: voronoiUpdates});
  }

  onLoad(event) {
    const image = event.target;
    let canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    let imageData = context.getImageData(0, 0, image.width, image.height);
    let totalData = [];
    for(let index = 0; index < image.width * image.height; index++) {
        let pixel = getXYfromIndex(index, image.width);
        totalData.push({
                         x: pixel[0],
                         y: pixel[1],
                         r: imageData.data[index * 4],
                         g: imageData.data[index * 4 + 1],
                         b: imageData.data[index * 4 + 2],
                       });
    }
    const total = 10000;
    let sites = [];
    /** I use the rejection algorithm to get points with the most brightness. **/
    let numPoints = 0;

    while(numPoints < total){
      let index = getRandomInt(0, image.width * image.height);
      let site = totalData[index]
      let brightness = getBrightness(site.r, 
                                     site.g, 
                                     site.b);
      if (Math.random() >= brightness ) {
        sites.push(site);
        numPoints++;
      }
    }
    
    let sitesNew = this.sitesUpdate(sites, totalData, image.width, image.height);
    this.setState({
                   totalData: totalData,
                   imageWidth: image.width,
                   imageHeight: image.height,
                   sites: sitesNew
                  });
  }

  sitesUpdate(sites, imageData, width, height) {
    const delaunay = Delaunay.from(sites, 
                                      function(d) { return d.x },
                                      function(d) { return d.y });
    const voronoi = delaunay.voronoi([0, 0, width, height]);
    const diagram = voronoi.cellPolygons();
    let newSites = getCentroids(diagram).map(function(centroid, index) {
        let closestIndex = Math.floor(centroid[1]) * width + Math.floor(centroid[0]);
        let closestPixel = imageData[closestIndex];
        return {
                oldX: sites[index].x,
                oldY: sites[index].y,
                x: centroid[0],
                y: centroid[1],
                r: closestPixel.r,
                g: closestPixel.g,
                b: closestPixel.b,

                oldR: sites[index].r,
                oldG: sites[index].g,
                oldB: sites[index].b
        };
    });

    return newSites;
  }

  draw() {
    let context = this.canvasRef.current.getContext('2d');
    context.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    this.state.sites.forEach(function(d){
        context.beginPath();
        context.fillStyle = d3.rgb(+d.r, +d.g, +d.b);
        let x = (+d.x / this.state.imageWidth) * this.state.canvasWidth;
        let y = (+d.y / this.state.imageHeight) * this.state.canvasHeight;
        let r = getRadius(d) * this.state.canvasWidth / 800;
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.fill();
    }.bind(this))
  }

  tick() {
      let newTicks = this.state.ticks + 1;
      this.setState({ticks: newTicks});
      this.state.updateCities(TIME);
      if (this.state.ticks > UPDATE_LIMIT) {
          clearInterval(this.ticker);

      }
   }

  componentWillUnmount() {
    clearInterval(this.timerID);
    clearInterval(this.ticker);  
  }

  render() {
    let isVertical = this.state.height / this.state.width < 1;
    return  <div>
             <canvas className={"VoronoiCanvas" + (isVertical?"":" vertical")} width={this.state.canvasWidth + "px"} height={this.state.canvasHeight + "px"} ref={this.canvasRef}></canvas>
            </div>
  }
}