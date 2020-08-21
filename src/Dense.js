import React, { useRef, useState, useEffect, useContext } from 'react';
import { useInterval, useTimeout } from './Hooks.js';
import { getRandomIntegerArray, colorToString, invertColor } from './util.js';
import Loader from './Presentation.js';
import './Dense.css';

import { ThemeContext } from './ThemeContext.js';

const Dense = (props) => {
    let mount = useRef();
    const theme = useContext(ThemeContext);
    const [tick, setTick] = useState(0);
    const [delay, setDelay] = useState(null);
    const squareSampling = 100;
    const numberColors = 500;
    let [presenting, setPresenting] = useState(true);

    useTimeout(() => {
        setPresenting(false);
        setDelay(0);
    }, props.delay);


    useEffect(() => {
        if (!presenting) {
            const context = mount.current.getContext('2d');
            const width = mount.current.width;
            const height = mount.current.height;
            
            context.beginPath();
            context.strokeStyle = theme.theme.foreground;
            context.lineWidth = 3;
            
            context.moveTo(Math.floor(width / 2), Math.floor(height / 2));


            context.lineTo(Math.floor(width / 2) + Math.floor((width - 5) * Math.cos(tick) / 2), 
                           Math.floor(height / 2) + Math.floor((height - 5) * Math.sin(tick) / 2));    
            
            context.stroke();
        }

    }, [presenting, tick]);

    useInterval(() => {
        setTick(tick + 1);
        console.log(tick);
    }, delay);

    let style = {};

    if (props.width > 0 && props.height > 0) {
        style = props.width/props.height< 1 ? {width: "100%"}
                                            : {height: "100%"};
    }

    let minSize = props.width/props.height < 1 ? props.width:
                                                 props.height;
    
    if (!presenting) {
        return (<canvas
                ref={mount}
                width={minSize}
                height={minSize}
                className="Dense"
            />);
    } else {
        return <Loader title={props.title}/>;
    }
}

export default Dense;
