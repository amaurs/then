import React, { Component } from 'react';
import * as d3 from 'd3';
import { getCentroids, getRandomInt, getBrightness, closest, download} from './util';
import { Delaunay } from "d3-delaunay";
import "./Voronoi.css";

const xStep = 12,
      yStep = 12;

export default class Voronoi extends Component {

  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  componentDidMount() {
    let imageData = this.props.imageData;
    let imageWidth = this.props.imageWidth;
    let sites = [];
    let total = Math.floor((imageWidth / xStep) * (this.props.imageHeight / yStep));

    /** I use the rejection algorithm to get points with the most brightness. **/
    let numPoints = 0;
    while(numPoints < total){
      let index = getRandomInt(0, imageWidth * this.props.imageHeight);
      let site = imageData[index]
      let brightness = getBrightness(site.r, 
                                     site.g, 
                                     site.b);
      if (Math.random() >= brightness ) {
        sites.push(site);
        numPoints++;
      }
    }
    let sitesNew = this.sitesUpdate(sites, imageData, imageWidth, this.props.imageHeight);

    this.setState({sites:sitesNew});
    this.cities = d3.select(this.svg)
                    .attr("viewBox", "0 0 " + imageWidth + " " + this.props.imageHeight)
                    .append("g")
                    .attr("class", "sites")
                    .selectAll("circle")
                    .data(sitesNew)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) { return +d.x })
                    .attr("cy", function(d) { return +d.y })
                    .attr("r", function(d) { return 2 * (1 + getBrightness(d.r, d.g, d.b)) ;})
                    .style("fill", function(d) { return  d3.rgb(d.r, d.g, d.b) })
                    .style("stroke", function(d) { return  d3.rgb(d.r, d.g, d.b) });

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
    let imageData = this.props.imageData;
    let time = this.state.time;
    let sitesNew = this.sitesUpdate(this.state.sites, imageData, imageWidth, this.props.imageHeight)

    d3.select(this.svg)
      .selectAll('circle')
      .data(sitesNew)
      .transition()
      .duration(100)
      .attr("cx", function(d) { return +d.x })
      .attr("cy", function(d) { return +d.y })
      .style("fill", function(d) { return  d3.rgb(d.r, d.g, d.b) })
      .style("stroke", function(d) { return  d3.rgb(d.r, d.g, d.b) });
    this.setState({sites:sitesNew, time: time + 1});

    if(this.state.time > 15) {
      clearInterval(this.timerID);
      //this.risogrify();
    }
  }

  risogrify() {
      console.log("final pass to get colors");
      let coloredSites = this.state.sites.slice();

      let tree = d3.quadtree()
        .x(function(d) { return d.x })
        .y(function(d) { return d.y }).addAll(coloredSites);

      
      let final = [];

      coloredSites.forEach(function(site) {
        let treeCopy = tree.copy();
        let oldColor = [site.r, site.g, site.b]
        let newColor = closest(site.r, site.g, site.b);
        let error = [oldColor[0] - newColor[0],
                     oldColor[1] - newColor[1],
                     oldColor[2] - newColor[2]]
        final.push({
            x: site.x,
            y: site.y,
            r: newColor[0],
            g: newColor[1],
            b: newColor[2]
        });
        let current = site;
        [7.0/16, 5.0/16, 3.0/16, 1.0/16].forEach(function(d) {
            if(typeof current !== "undefined") {
                treeCopy.remove(current);
                let found = treeCopy.find(site[0], site[1]);
                if(typeof found !== "undefined") {
                    found.r = Math.round(found.r + error[0] * d)
                    found.g = Math.round(found.g + error[1] * d)
                    found.b = Math.round(found.b + error[2] * d)
                } 
            }
        });
        tree.remove(site);
      });
    console.log(tree.size());
    this.print(final.filter(function(site) { return site.r === 255 && site.g === 0 && site.b === 0}), "red")
    this.print(final.filter(function(site) { return site.r === 255 && site.g === 255 && site.b === 0}), "yellow")
    this.print(final.filter(function(site) { return site.r === 0 && site.g === 0 && site.b === 255}), "blue")
    this.print(final.filter(function(site) { return site.r === 0 && site.g === 0 && site.b === 0}), "black")
    
  }

  print(printSites, suffix) {
    let _svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    d3.select(_svg)
      .append("g")
      .attr("class", "sites")
      .selectAll("circle")
      .data(printSites)
      .enter()
      .append("circle")
      .attr("cx", function(d) { return +d.x })
      .attr("cy", function(d) { return +d.y })
      .attr("r", function(d) { return 2 * (1 + getBrightness(d.r, d.g, d.b)) ;})
      .style("fill", function(d) { return  d3.rgb(d.r, d.g, d.b) })
      .style("stroke", function(d) { return  d3.rgb(d.r, d.g, d.b) });

    let serializer = new XMLSerializer();
    let name = "our-lady-" + suffix;
    let source = serializer.serializeToString(_svg);
    download(name + ".svg", source);
  }

  render() {
    return <svg ref={ svg => this.svg = svg } />;
  }
}