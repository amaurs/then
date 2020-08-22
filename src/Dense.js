import React, { useRef, useState, useEffect, useContext } from 'react';
import { useInterval, useTimeout } from './Hooks.js';
import { getRandomIntegerArray, colorToString, invertColor, randomColor, intToColor,colorToInt } from './util.js';
import Loader from './Presentation.js';
import './Dense.css';

//import hilbert_cube_8 from './assets/hilbert_cube_8_8.png';
//import hilbert_square_8 from './assets/hilbert_square_8_8.png';
//import hilbert_cube_64 from './assets/hilbert_cube_64_64.png';
//import hilbert_square_64 from './assets/hilbert_square_64_64.png';
//import hilbert_cube_512 from './assets/hilbert_cube_512_512.png';
//import hilbert_square_512 from './assets/hilbert_square_512_512.png';
//import hilbert_cube_4096 from './assets/hilbert_cube_4096_4096.png';
//import hilbert_square_4096 from './assets/hilbert_square_4096_4096.png';


import { ThemeContext } from './ThemeContext.js';

//const image_cube_map = {8: hilbert_cube_8,
//                        64: hilbert_cube_64,
//                        512: hilbert_cube_512,
//                        4096: hilbert_cube_4096};





const Dense = (props) => {
    let mount = useRef();
    const theme = useContext(ThemeContext);
    const [tick, setTick] = useState(0);
    //let [color, setColor] = useState(null);
    const [delay, setDelay] = useState(null);
    const squareSampling = 100;
    const numberColors = 500;
    let [presenting, setPresenting] = useState(true);

    useTimeout(() => {
        setPresenting(false);
        setDelay(0);
    }, props.delay);



    //useEffect(() => {
    //    
    //    let hilbert_cube = image_cube_map[64];
    //    const getData = (src) => {
    //        return new Promise ((resolve, reject) => {
    //            let img = new Image();
    //            img.onload = (event) => {
    //                let image = event.target;
    //                let canvas = document.createElement('canvas');
    //                canvas.width = image.width;
    //                canvas.height = image.height;
    //                let context = canvas.getContext('2d');
    //                context.drawImage(image, 0, 0);
    //                resolve(context.getImageData(0, 0, image.width, image.height))
    //            }
    //            img.onerror = reject
    //            img.src = src
    //        });
    //    }
    //    getData(hilbert_cube).then(imageData => {
    //        setColor(imageData);
    //    })
    //}, []);




    useEffect(() => {
        if (!presenting) {
            const context = mount.current.getContext('2d');
            const width = mount.current.width;
            const height = mount.current.height;
            


            context.beginPath();
            context.strokeStyle = randomColor();
            //context.strokeStyle = intToColor(tick*10000);
            //context.strokeStyle = theme.theme.foreground;
            
            //let index = (tick * 4) % color.data.length;
            //context.strokeStyle = intToColor(colorToInt(color.data[index + 0], color.data[index + 1], color.data[index + 2])); //

            context.lineWidth = 10;
            context.globalAlpha = 0.5;
            
            context.moveTo(Math.floor(width / 2), Math.floor(height / 2));


            context.lineTo(Math.floor(width / 2) + Math.floor((width) * 0.95 * Math.cos(tick) / 2), 
                           Math.floor(height / 2) + Math.floor((height) * 0.95 * Math.sin(tick) / 2));    
            

            context.closePath();
            //context.stroke();
            //context.lineWidth = 50;
            //context.globalAlpha = 1;
            //context.strokeStyle = theme.theme.background;
            //context.beginPath();
            //
            //
            //context.arc(Math.floor(width / 2), 
            //            Math.floor(height / 2), 
            //            Math.floor(width / 2), 0, 2 * Math.PI);
            //context.closePath();
            context.stroke();
        }

    }, [presenting, tick]); //, color]);

    useInterval(() => {
        setTick(tick + 1);
    }, delay);

    let style = {};

    if (props.width > 0 && props.height > 0) {
        style = props.width / props.height<1?{width: "100vw"}:{height: "100vh"};
    }

    let minSize = props.width/props.height < 1 ? props.width:
                                                 props.height;
    

    let scale = window.devicePixelRatio;

    let canvasWidth = 1000 * scale;
    let canvasHeight = 1000 * scale;

    if (!presenting) {
        return (<canvas
                ref={mount}
                style={style}
                width={canvasWidth}
                height={canvasHeight}
                className="Dense"
            />);
    } else {
        return <Loader title={props.title}/>;
    }
}

export default Dense;
