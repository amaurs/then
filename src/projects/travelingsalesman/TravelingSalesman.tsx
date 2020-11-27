import React, { useRef, useState, useEffect, useContext } from 'react';
import { useTimeout } from '../../Hooks.js';
import { getRandomIntegerArray } from '../../util.js';
import Loader from '../../Presentation.js';
import './TravelingSalesman.css';

import { ThemeContext } from '../../ThemeContext.js';

import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
    url: string;
}

const TravelingSalesman = (props:Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const theme = useContext(ThemeContext);
    const [cities, setCities] = useState({cities: [], hasFetched: true});
    const squareSampling = 100;
    const numberColors = 500;
    const [presenting, setPresenting] = useState(props.delay>0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        let cancel = false;
        const fetchCitiesSolution = async (url: string, numberColors: number, squareSampling: number) => {
            try {
                let payload = {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                };

                let cityPoints = getRandomIntegerArray(numberColors * 2, 1, squareSampling);
                let citiesUrl = url + "/solve?cities=" + JSON.stringify(cityPoints) + "&dimension=" + 2;

                let response = await fetch(citiesUrl, payload);
                let json = await response.json();
                if (!cancel) {
                    setCities({cities: json, hasFetched: true})
                }  
            } catch (error) {
                console.log("Call to order endpoint failed.", error)
            }
        }
        fetchCitiesSolution(props.url, numberColors, squareSampling);
        return () => {
            cancel=true;
        } 
    }, [props.url]);

    useEffect(() => {
        if (cities.cities.length > 0 && !presenting) {

            let n = 0;
            let timeoutId: any;

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function() {

                    const maxBound = (time: number, size: number) => {
                        let t = time % (2 * size)
                        if (t < size) {
                            return t;
                        }else {
                            return size;
                        }
                    }
                    const minBound = (time: number, size: number) => {
                        let t = time % (2 * size)
                        if (t < size) {
                            return 0;
                        } else {
                            return time % size;
                        }
                    }
                    let min = minBound(n, numberColors + 1);
                    let max = maxBound(n, numberColors + 1);
                    let citiesToDraw = cities.cities.slice(min * 2, max * 2);
        
        
                    const context: CanvasRenderingContext2D = canvas.current.getContext(
                        "2d"
                    )!;
                    const width = canvas.current.width;
                    const height = canvas.current.height;
                    context.save();
                    context.clearRect(0, 0, width, height);
                    context.fillStyle = '#161011';
                    context.fillRect(0, 0, width, height);
                    context.beginPath();
                    context.strokeStyle = '#f0a5a3';
                    context.lineWidth = 5;
                    for(let i=0; i < citiesToDraw.length; i+=2) {
                        context.lineTo(Math.floor(width * citiesToDraw[i] / squareSampling), Math.floor(height * citiesToDraw[i + 1] / squareSampling))    
                    }
                    context.stroke();
                    n += 1;
                    frameId = requestAnimationFrame(animate);
                }, 1000 / 60);
                
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

    let style = {};

    if (props.width > 0 && props.height > 0) {
        style = props.width/props.height< 1 ? {width: "100%"}
                                            : {height: "100%"};
    }

    let minSize = props.width/props.height < 1 ? props.width:
                                                 props.height;
    
    if (cities.cities.length >= 0 && !presenting) {
        return (<canvas
                ref={canvas}
                style={{ ...props.style, ...style }}
                width={minSize}
                height={minSize}
                className="TravelingSalesman"
            />);
    } else {
        return <Loader title={props.title}/>;
    }
}

export default TravelingSalesman;
