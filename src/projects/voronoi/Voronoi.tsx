import React, { useRef, useState, useEffect } from 'react';
import robot from '../../assets/our-lady.jpg';
import { getXYfromIndex, getRandomInt, getBrightness, getCentroids } from '../../util.js';
import './Voronoi.css'
import * as d3 from 'd3';
import { Delaunay } from "d3-delaunay";
import { useTimeout } from '../../Hooks.js';
import Loader from '../../Presentation.js';

import "./Voronoi.css"

import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}

interface City {
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
}

interface Cities {
    totalData: Array<City>;
    imageWidth: number; 
    imageHeight: number;
    sites: Array<City>;
}

const Voronoi = (props: Props) => {

    let canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    let [cities, setCities] = useState<Cities| undefined>(undefined);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);
    const [presenting, setPresenting] = useState(props.delay>0);


    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        
        let cancel = false;
        
        if (props.width > 0 && props.height > 0) {

            const onLoad = (event: Event) => {
                if (!cancel) {
                    const image = event.currentTarget as HTMLImageElement;
                    const canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const context: CanvasRenderingContext2D = canvas.getContext(
                        "2d"
                    )!;
                    context.drawImage(image, 0, 0);
                    let imageData = context.getImageData(0, 0, image.width, image.height);
                    let totalData: Array<City> = [];
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
                    const total = 5000;
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
            }
            
    
            let image = new Image();
            image.src = robot;
            image.onload = onLoad;
        }

        return () => {cancel = true};

    }, [props.width, props.height]);

    useEffect(() => {
        if (cities !== undefined && !presenting) {
            const getRadius = (d: City) => {
                return  2 + 1 * getBrightness(d.r, d.g, d.b);
            }

            const sitesUpdate = (sites: Array<City>, imageData: Array<City>, width: number, height: number): Array<City> => {
                const delaunay = Delaunay.from(sites, 
                                                  function(d) { return d.x },
                                                  function(d) { return d.y });
                const voronoi = delaunay.voronoi([0, 0, width, height]);
                const diagram = voronoi.cellPolygons();
                let newSites: Array<City> = getCentroids(diagram).map(function(centroid, index) {
                    let closestIndex = Math.floor(centroid[1]) * width + Math.floor(centroid[0]);
                    let closestPixel = imageData[closestIndex];

                    const newCity: City = {
                            x: centroid[0],
                            y: centroid[1],
                            r: closestPixel.r,
                            g: closestPixel.g,
                            b: closestPixel.b
                    }
                    return newCity;
                });
                return newSites;
            }

            let updates = 0;  
            let timeoutId: any;
            let citiesCopy = JSON.parse(JSON.stringify(cities));

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function() {
                    const context: CanvasRenderingContext2D = canvas.current.getContext(
                        "2d"
                    )!;
                    let canvasWidth = canvas.current.width;
                    let canvasHeight = canvas.current.height;
                    context.clearRect(0, 0, canvasWidth, canvasHeight);

                    citiesCopy.sites.forEach(function(d: City){
                        context.beginPath();
                        context.fillStyle = "" + d3.rgb(+d.r, +d.g, +d.b);
                        let x = (+d.x / citiesCopy.imageWidth) * canvasWidth;
                        let y = (+d.y / citiesCopy.imageHeight) * canvasHeight;
                        let r = getRadius(d) * canvasWidth / 800;
                        context.arc(x, y, r, 0, 2 * Math.PI);
                        context.fill();
                    });
                    if (updates < 10) {
                        citiesCopy.sites = sitesUpdate(citiesCopy.sites, citiesCopy.totalData, citiesCopy.imageWidth, citiesCopy.imageHeight);
                        updates += 1;
                        frameId = requestAnimationFrame(animate);
                    }
                }, 1000 / 10);
            }
            let frameId: number | null = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId!);
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId);
                frameId = null;
            };
        }
    }, [cities, presenting]);


    let isVertical = props.height / props.width < 1;

    let style = {};

    if (presenting) {
        return <Loader title={props.title}/>
    } else {
        return (
            <canvas className="Voronoi"
                    style={{ ...props.style, ...style }}
                    width={canvasWidth + "px"} 
                    height={canvasHeight + "px"} 
                    ref={canvas} />
        );
    }
}

export default Voronoi;
