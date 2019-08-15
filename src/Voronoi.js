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

const colorArray = [BLUE, YELLOW, RED, BLACK];


function getRadius(d) {
    return  2 + 1.5 * getBrightness(d.r, d.g, d.b);
}


export default class Voronoi extends Component {

  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      sites: null,
      steps: 5,
      colors: ["red", "yellow", "blue", "black"]
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
                    .attr("r", getRadius)
                    .style("fill", function(d) { return  d3.rgb(d.r, d.g, d.b) })
                    .style("stroke-width", "0");

    this.timerID = setInterval(() => this.tick(), 100);
  }

  onButtonClick(type) {
    console.log(type);
    let colorsCopy = this.state.colors.slice();
    if(colorsCopy.indexOf(type) < 0) {
        colorsCopy.push(type);
    } else {
        colorsCopy.splice( colorsCopy.indexOf(type), 1 );
    }
    let final = this.risogrify(this.state.sites.slice(), colorsCopy);
    this.setState({colors: colorsCopy, final: final});
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

  handleExport() {
    
    let final = this.state.final.slice();

    let name = this.state.colors.reduce(function(a, b) { return a + "-" + b}, "");


    this.print(final.filter(function(site) { return !(site.r === 255 && site.g === 255 && site.b === 255) }), "all");

    //this.print(final.filter(function(site) { return site.r === 255 && site.g === 0 && site.b === 0}), "red")
    //this.print(final.filter(function(site) { return site.r === 255 && site.g === 255 && site.b === 0}), "yellow")
    //this.print(final.filter(function(site) { return site.r === 0 && site.g === 0 && site.b === 255}), "blue")
    //this.print(final.filter(function(site) { return site.r === 0 && site.g === 0 && site.b === 0}), "black")
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

    
    this.setState({sites:sitesNew, time: time + 1});

    this.update(sitesNew);  

    if(this.state.time > 15) {
      clearInterval(this.timerID);
      let final = this.risogrify(this.state.sites.slice(), this.state.colors);
      this.setState({sites:sitesNew, final: final});
    }
  }

  update(sites, alpha=false) {
    d3.select(this.svg)
      .selectAll('circle')
      .data(sites)
      .transition()
      .duration(100)
      .attr("cx", function(d) { return +d.x })
      .attr("cy", function(d) { return +d.y })
      .attr("r", function(d) { return d.radius? +d.radius : getRadius(d) })
      .style("fill", function(d) {
        let color = d3.rgb(d.r, d.g, d.b)
        if(alpha) {
            color.opacity = d.a;
        }
        return color; })
      .style("stroke", function(d) {
        let color = d3.rgb(d.r, d.g, d.b)
        if(alpha) {
            color.opacity = d.a;
        }
        return d3.rgb(255, 255, 255); })
      .style("stroke-width", "0");
  }

  print(printSites, suffix) {
    let _svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    let alpha = true;

    let size = printSites.length;

    d3.select(_svg)
        .attr("width", this.props.imageWidth)
        .attr("height", this.props.imageHeight);


    d3.select(_svg)
      .append("g")
      .attr("class", "sites")
      .selectAll("circle")
      .data(printSites)
      .enter()
      .append("circle")
      .attr("cx", function(d) { return +d.x })
      .attr("cy", function(d) { return +d.y })
      .attr("r", function(d) { return +d.radius })
      .style("fill", function(d) {
        let color = d3.rgb(d.r, d.g, d.b);
        return color; })
      .style("stroke-width", "0")
      .style("opacity", function(d){ return d.a });

    console.log("about to print")

    let serializer = new XMLSerializer();
    let name = "our-lady-" + suffix + "-" + size;

    let ohter = this.svg;

    let source = serializer.serializeToString(_svg);
    download(name + ".svg", source);
  }

  risogrify(coloredSites, colors) {
      console.log("final pass to get colors");
      //let coloredSites = this.state.sites.slice();

      let tree = d3.quadtree()
        .x(function(d) { return d.x })
        .y(function(d) { return d.y }).addAll(coloredSites);

      
      let final = [];
      console.log(colors)
      let colorsNow = colors.map(function(color) {
        return colorMap[color];
      });



      coloredSites.forEach(function(site) {
        let treeCopy = tree.copy();
        let oldColor = [site.r, site.g, site.b]
        let newColor = closest(colorsNow, site.r, site.g, site.b);
        let error = [site.r - newColor.flat_r,
                     site.g - newColor.flat_g,
                     site.b - newColor.flat_b]
        final.push({
            x: site.x,
            y: site.y,
            r: newColor.alpha_r,
            g: newColor.alpha_g,
            b: newColor.alpha_b,
            a: newColor.alpha_a,
            radius: getRadius(site)
        });
        let current = site;
        [ 7.0 / 16, 5.0 / 16, 3.0 / 16, 1.0 / 16 ].forEach(function(d) {
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
    this.update(final, true);

    return final;
  }



  render() {
    console.log(this.state.colors);
    return <div>
            <svg ref={ svg => this.svg = svg } />
            <div className="controls">
                <button className={(this.state.colors.indexOf("red") < 0 ? "" : "red")} onClick={() => this.onButtonClick("red")}>Red</button>
                <button className={(this.state.colors.indexOf("yellow") < 0 ? "" : "yellow")} onClick={() => this.onButtonClick("yellow")}>Yellow</button>
                <button className={(this.state.colors.indexOf("blue") < 0 ? "" : "blue")} onClick={() => this.onButtonClick("blue")}>Blue</button>
                <button className={(this.state.colors.indexOf("black") < 0 ? "" : "black")} onClick={() => this.onButtonClick("black")}>Black</button>
                <button onClick={() => this.handleExport()}>Export all</button>
            </div>
           </div>;
  }
}