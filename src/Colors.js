import React, { useRef, useState, useEffect } from 'react';
import { useParams} from "react-router";

import { colorToInt } from './util.js'
import { useInterval } from './Hooks.js';
import { getRandomIntegerArray, colorToString, invertColor } from './util.js';

import { useTimeout } from './Hooks.js';

import Loader from './Loader.js'

import './Colors.css';

const numberColors = 750;

const Colors = (props) => {

    let mount = useRef();
    const [tick, setTick] = useState(0);
    const [colors, setColors] = useState([]);


    const [delay, setDelay] = useState(null);
    const [presenting, setPresenting] = useState(true);


    useTimeout(() => {
        setPresenting(false);
        setDelay(100);
    }, props.delay)

    useEffect(() => {
        let cancel = false;
        const fetchColorsSolution = async (url, numberColors) => {
            try {
                let payload = {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                };

                let colorsArray = getRandomIntegerArray(numberColors * 3, 0, 256);
                let colorsUrl = props.url + "/solve?cities=" + JSON.stringify(colorsArray) + "&dimension=" + 3;

                let response = await fetch(colorsUrl, payload);
                let json = await response.json();
                if (!cancel) {
                    setColors(json);
                }  
            } catch (error) {
                console.log("Call to order endpoint failed.", error)
            }
        }
        fetchColorsSolution(props.url, numberColors);
        return () => cancel=true;
    }, [props.url]);

    useEffect(() => {
           
        if (colors.length > 0 && !presenting) {
            let color = [colors[(tick % (colors.length / 3)) * 3],
                         colors[(tick % (colors.length / 3)) * 3 + 1],
                         colors[(tick % (colors.length / 3)) * 3 + 2]];

            const context = mount.current.getContext('2d');
            const width = mount.current.width;
            const height = mount.current.height;
            context.save();
            context.clearRect(0, 0, width, height);
            context.fillStyle = colorToString(color[0], color[1], color[2]);
            context.fillRect(0, 0, width, height);

            context.fillStyle = invertColor(color[0], color[1], color[2]);
            context.fillRect(width * (1 - Math.sqrt(2) / 2) / 2, height * (1 - Math.sqrt(2) / 2) / 2, width / Math.sqrt(2), height / Math.sqrt(2));

        }
    }, [colors, tick, presenting]);


    useInterval(() => {
        if (colors.length > 0) {
            setTick(tick + 1);
        }
    }, delay);

    let style = {};
    if (props.width > 0 && props.height > 0) {
        style = props.width/props.height< 1 ? {width: props.width + "px", height: props.width + "px"}
                                            : {width: props.height + "px", height: props.height + "px"};
    }
    
    if (presenting) {
        return <Loader />
    } else {
        return <canvas className="Colors" 
                       style={style}
                       ref={mount} 
                        />;
    }
}

export default Colors;