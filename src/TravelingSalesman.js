import React, { useRef, useState, useEffect } from 'react';
import { useInterval, useTimeout } from './Hooks.js';
import { getRandomIntegerArray, colorToString, invertColor } from './util.js';

import Loader from './Loader.js';

import './TravelingSalesman.css';

const TravelingSalesman = (props) => {

    let mount = useRef();
    const [tick, setTick] = useState(0);
    const [delay, setDelay] = useState(null);
    const [cities, setCities] = useState({cities: [], hasFetched: true});
    const [citiesToDraw, setCitiesToDraw] = useState([]);
    const squareSampling = 100;
    const numberColors = 500;

    let [presenting, setPresenting] = useState(true);

    useTimeout(() => {
        setPresenting(false);
        setDelay(10);
    }, props.delay);

    useEffect(() => {
        // TODO: This function needs memoizing. Right now it is calling the service on every mount.
        let cityPoints = getRandomIntegerArray(numberColors * 2, 1, squareSampling);

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
        if (citiesToDraw.length > 0 && !presenting) {
            const context = mount.current.getContext('2d');
            const width = mount.current.width;
            const height = mount.current.height;
            context.save();
            context.clearRect(0, 0, width, height);
            context.beginPath();
            context.strokeStyle = invertColor(255, 255, 255);
            context.lineWidth = 5;
            for(let i=0; i < citiesToDraw.length; i+=2) {
                context.lineTo(Math.floor(width * citiesToDraw[i] / squareSampling), Math.floor(height * citiesToDraw[i + 1] / squareSampling))    
            }
            context.stroke();
        }

    }, [citiesToDraw, presenting]);

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
        let min = minBound(tick, numberColors + 1);
        let max = maxBound(tick, numberColors + 1);
        let citiesToDraw = cities.cities.slice(min * 2, max * 2);
        setCitiesToDraw(citiesToDraw);
        setTick(tick + 1);
    }, delay);

    let style = {};
    if (props.width > 0 && props.height > 0) {
        style = props.width/props.height< 1 ? {width: "100%"}
                                            : {height: "100%"};
    }

    let minSize = props.width/props.height < 1 ? props.width:
                                                 props.height;
    

    if (citiesToDraw.length > 0 && !presenting) {
        return (<canvas
                ref={mount}
                width={minSize}
                height={minSize}
                className="TravelingSalesman"
            />);
    } else {
        return <Loader />
    }

    
}

export default TravelingSalesman;