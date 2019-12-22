import React, { useRef, useState, useEffect } from 'react';
import { useRequestAnimationFrame, useInterval } from './Hooks.js';
import { getXYfromIndex, getRandomIntegerArray, getRandomInt, getBrightness, getCentroids, colorToString, invertColor } from './util.js';

import * as THREE from 'three-full';


import './TravelingSalesman.css'

const TravelingSalesman = (props) => {

    let mount = useRef();
    const [tick, setTick] = useState(0);
    const [delay, setDelay] = useState(24);
    const [data, setData] = useState({cities: [], hasFetched: true});
    const [cities, setCities] = useState({cities: [], hasFetched: true});
    const [color, setColor] = useState([0, 0, 0]);
    const [citiesToDraw, setCitiesToDraw] = useState([]);
    const squareSampling = 100;
    const numberColors = 700;


    const colors = getRandomIntegerArray(numberColors * 3, 0, 256);
    const cityPoints = getRandomIntegerArray(numberColors * 3, 0, 256);

    useEffect(() => {
         // TODO: This function needs memoizing. Right now it is calling the service on every mount.
         
         let colorsUrl = props.url + "/solve?cities=" + JSON.stringify(colors) + "&dimension=" + 3;
         fetch(colorsUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            return response.json();
          }).then(json => {
            setData({cities: json, hasFetched: true});
          });
    }, []);


    useEffect(() => {
        // TODO: This function needs memoizing. Right now it is calling the service on every mount.
        let cityPoints = getRandomIntegerArray(numberColors * 2, 0, squareSampling);

        let citiesUrl = props.url + "/solve?cities=" + JSON.stringify(cityPoints) + "&dimension=" + 2;
        fetch(citiesUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          return  response.json();
        }).then(json => {
          setCities({cities: json, hasFetched: true})
        });
    }, []);

    useEffect(() => {
        if (citiesToDraw.length > 0) {
            

            const context = mount.current.getContext('2d');
            const width = mount.current.width;
            const height = mount.current.height;
            context.save();
            context.clearRect(0, 0, width, height);
            context.fillStyle = colorToString(color[0], color[1], color[2]);
            context.fillRect(0, 0, width, height);
            context.beginPath();
            context.strokeStyle = invertColor(color[0], color[1], color[2]);
            context.lineWidth = 5;
            for(let i=0; i < citiesToDraw.length; i+=2) {
                context.lineTo(Math.floor(width * citiesToDraw[i] / squareSampling), Math.floor(height * citiesToDraw[i + 1] / squareSampling))    
            }
            context.stroke();

        }

    }, [data, cities, citiesToDraw]);

    useInterval(() => {
        const maxBound = (time, size) => {
            let t = time % (2 * size)
            if (t < size) {
                return t;
            }else {
                return size;
            }
        }

        const minBound = (time, size) => {
            let t = time % (2 * size)
            if (t < size) {
                return 0;
            } else {
                return time % size;
            }
        }

        let colorNumber = tick % (numberColors + 1);
        let color = [data.cities[colorNumber * 3],
                     data.cities[colorNumber * 3 + 1],
                     data.cities[colorNumber * 3 + 2]];
        setColor(color);
        let min = minBound(tick, numberColors + 1);
        let max = maxBound(tick, numberColors + 1);
        let citiesToDraw = cities.cities.slice(min * 2, max * 2);
        setCitiesToDraw(citiesToDraw);
        setTick(tick + 1);
        setDelay(24);
    }, delay);

    return (<canvas
                ref={mount}
                width={props.width + "px"}
                height={props.height + "px"}
                className="TravelingSalesman"
            />);
}

export default TravelingSalesman;