import React, { useRef, useState, useEffect } from 'react';
import { useParams} from "react-router";

import { colorToInt } from './util.js'
import { useInterval } from './Hooks.js';
import { getRandomIntegerArray, colorToString, invertColor } from './util.js';


import './Colors.css';

const numberColors = 750;

const Colors = (props) => {

    let mount = useRef();
    const [tick, setTick] = useState(0);

    const [colors, setColors] = useState([]);

    useEffect(() => {
         // TODO: This function needs memoizing. Right now it is calling the service on every mount.
        const colorsArray = getRandomIntegerArray(numberColors * 3, 0, 256);
        let colorsUrl = props.url + "/solve?cities=" + JSON.stringify(colorsArray) + "&dimension=" + 3;
        fetch(colorsUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            return response.json();
          }).then(json => {
            setColors(json);
          });
    }, [props.url]);



    useEffect(() => {
           
        if (colors.length > 0) {
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
        }
    }, [colors, tick]);


    useInterval(() => {
        if (colors.length > 0) {
            setTick(tick + 1);
        }
    }, 100);

    let style = {};
    if (props.width > 0 && props.height > 0) {
        style = props.width/props.height< 1 ? {width: props.width + "px", height: props.width + "px"}
                                            : {width: props.height + "px", height: props.height + "px"};
    }
    

    return <canvas className="Colors" 
                style={style}
                ref={mount} 
            />;
}

export default Colors;