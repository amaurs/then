import React, { useRef, useState, useEffect } from 'react';
import { useTimeout } from './Hooks.js';

import { shuffle, getRandomInt } from './util.js';

import Loader from './Presentation.js';

import './Quilt.css';


let o1 = {points: [[-50,-50],[50,-50],[50,50],[0,0],[-50,50]],
          offsetY: 0,
          offsetX: 0,
          color: "DarkOrange"};


let o2 = {points: [[0,-50],[50,0],[0,50],[-50,0],[0,0]],
          offsetY: 0,
          offsetX: 100,
          color: "White"};


let o3 = {points: [[-50,-50],[0,-50],[50,0],[0,50],[-50,0]],
          offsetY: 0,
          offsetX: 200,
          color: "White"};

let o4 = {points: [[-50,-50],[50,-50],[50,0],[0,50],[-50,0]],
          offsetY: 0,
          offsetX: 300,
          color: "DarkOrange"};

          // [[0, 0], [0, 50], [50, 100], [50, 100], [0, 50]]


const Quilt = (props) => {
    let mount = useRef();
    const [presenting, setPresenting] = useState(props.delay>0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay)

    useEffect(() => {  
        if (!presenting) {

            let n = 0;
            let timeoutId;

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function() {
                    const context = mount.current.getContext('2d');
                    const width = mount.current.width;
                    const height = mount.current.height;

                    context.fillStyle = "black";
                    context.fillRect(0, 0, width, height);
                    
                    

                    let allObjects = shuffle([o1, o1, o1, o1, o1, o1, o2, o2, o2, o2, o2, o2, o3, o3, o3, o3, o4, o4, o4, o4]);

                    for(let j = 0; j < 4; j++) {
                        for(let i = 0; i < 5; i++) {
                            console.log(5 * j + i)
                            let o = allObjects[5 * j + i];

                            console.log(o.points.map(d => "[" + (d[0] - 50) + "," + (d[1] - 50) + "]").toString())
                        
                            context.fillStyle = o.color;
                            context.beginPath();
                            context.translate(i * 100 + 50, j * 100 + 50);
                            context.rotate(getRandomInt(0, 4) * Math.PI/2);
                            context.moveTo(o.points[0][0], o.points[0][1]);
                    
                            for (let k = 1; k < o.points.length; k++) {
                                context.lineTo(o.points[k][0], o.points[k][1]);
                            }

                            context.resetTransform();
                            //context.closePath();
                        
                            context.fill();
                        }
                    }

                    allObjects.forEach(o => {
                        
                    });
                    
                    


                    
                    frameId = requestAnimationFrame(animate);
                }, 1000 / 5);
                
             }

            let frameId = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId);
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId);
                frameId = null;
            }
        } 
    }, [presenting]);


    let style = {};

    if (props.width > 0 && props.height > 0) {
        style = props.width/props.height< 1 ? {width: props.width + "px"}
                                            : {height: props.height + "px"};
    }
    
    if (presenting) {
        return <Loader title={props.title}/>
    } else {
        return (
            <canvas className="Quilt" 
                    style={{ ...props.style, ...style }}
                    width={500}
                    height={400}
                    ref={mount} />
        );
    }
}

export default Quilt;