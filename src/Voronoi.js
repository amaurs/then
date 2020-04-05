import React, { useRef, useState, useEffect } from 'react';
import robot from './assets/our-lady.jpg';
import { getXYfromIndex, getRandomInt, getBrightness, getCentroids } from './util.js';
import './Voronoi.css'
import * as d3 from 'd3';
import { Delaunay } from "d3-delaunay";

import { useTimeout } from './Hooks.js';
import Loader from './Presentation.js';


/**
let imageRatio = this.state.imageHeight / this.state.imageWidth;
let ratio = this.state.height / this.state.width;
let canvasHeight = this.state.height;
let canvasWidth = this.state.width;
if(ratio < 1) {
    canvasWidth = canvasHeight * (1 / imageRatio);
} else {
    canvasHeight = canvasWidth * imageRatio;
}
voronoi = <Voronoi imageData={this.state.totalData}
                   width={this.state.width}
                   height={this.state.height}
                   imageWidth ={this.state.imageWidth}
                   imageHeight={this.state.imageHeight}
                   sites={this.state.sites}
                   updateCities={this.updateCities}
                   canvasWidth={canvasWidth}
                   canvasHeight={canvasHeight}
                   updates={this.state.voronoiUpdates}
          />
**/

const Voronoi = (props) => {

    let mount = useRef();

    let [updates, setUpdates] = useState(0);

    let [cities, setCities] = useState(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);

    let [presenting, setPresenting] = useState(true);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {

            



        if (props.width > 0 && props.height > 0) {


            const onLoad = (event) => {
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

                let imageAspectRatio = image.width / image.height;
                let windowAspectRatio = props.width / props.height;
                let box
                if (windowAspectRatio < 1) {
        
                    box = [imageAspectRatio * props.height, props.height];
                } else {
                    box = [props.width, props.width / imageAspectRatio];
            
                }
    
                setCities({totalData: totalData,
                           imageWidth: image.width,
                           imageHeight: image.height,
                           sites: sites});
                setCanvasWidth(box[0]);
                setCanvasHeight(box[1]);
            }
    
    
            let image = new Image();
            image.src = robot;
            image.onload = onLoad;


        }

    }, [props.width, props.height]);

    useEffect(() => {

        if (!presenting) {
            const getRadius = (d) => {
                return  2 + 1 * getBrightness(d.r, d.g, d.b);
            }

            const draw = () => {
                let context = mount.current.getContext('2d');
                let canvasWidth = mount.current.width;
                let canvasHeight = mount.current.height;
                context.clearRect(0, 0, canvasWidth, canvasHeight);
                cities.sites.forEach(function(d){
                    context.beginPath();
                    context.fillStyle = d3.rgb(+d.r, +d.g, +d.b);
                    let x = (+d.x / cities.imageWidth) * canvasWidth;
                    let y = (+d.y / cities.imageHeight) * canvasHeight;
                    let r = getRadius(d) * canvasWidth / 800;
                    context.arc(x, y, r, 0, 2 * Math.PI);
                    context.fill();
                });
            }

            if (cities !== null) {
                draw();
                if (updates < 10) {
                    setUpdates(updates + 1);
                }
            }
        }

    }, [cities, presenting]);



    useEffect(() => {


        const sitesUpdate = (sites, imageData, width, height) => {
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
        if (cities !== null) {
            setCities({totalData: cities.totalData,
                   imageWidth: cities.imageWidth,
                   imageHeight: cities.imageHeight,
                   sites: sitesUpdate(cities.sites, cities.totalData, cities.imageWidth, cities.imageHeight)});
        }

    }, [updates]);


    let isVertical = props.height / props.width < 1;

    if (presenting) {
        return <Loader title={props.title}/>
    } else {
        return (<canvas className="Voronoi"
                    width={canvasWidth + "px"} 
                    height={canvasHeight + "px"} 
                    ref={mount} 
                />);
    }
}

export default Voronoi;
