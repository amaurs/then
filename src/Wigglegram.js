import React, { useState, useEffect, useRef } from 'react';
import './Wigglegram.css'
import Loader from './Presentation.js';
import { useTimeout } from './Hooks.js';
import { getRandomInt } from './util.js';

import left from './assets/left.jpg';
import right from './assets/right.jpg';

const Wigglegram = (props) => {

    
    const mount = useRef();
    const [data, setData] = useState(null);
    const [current, setCurrent] =  useState(null);
    const [frames, setFrames] =  useState(null);

    const [presenting, setPresenting] = useState(props.delay>0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay)

    useEffect(() => {
        let cancel = false;
        const getData = (src) => {
            return new Promise ((resolve, reject) => {
                let img = new Image();
                img.onload = (event) => {
                    let image = event.target;
                    let canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    let context = canvas.getContext('2d');
                    context.drawImage(image, 0, 0);
                    resolve(context.getImageData(0, 0, image.width, image.height))
                }
                img.onerror = reject
                img.src = src
            });
        }

        Promise.all([getData(left), getData(right)]).then(function(frames) { 
            if(!cancel) {
                setFrames(frames);
            console.log("Promise is fullfiled.")
            }
        });
        return () => {cancel = true}

    }, []);


    useEffect(() => {

        if(frames !== null && !presenting) {

            // This constants come from the execution of the image,
            // need to figure out how to pass this down in a more
            // dynamic way.

            let tick = 0;

            let timeoutId;
            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function() {
                    let canvas = mount.current;
                    
                    canvas.width = frames[0].width;
                    canvas.height = frames[0].height;
                    let context = canvas.getContext('2d');

                    context.putImageData(frames[tick % frames.length], 0, 0);
                    tick = tick + 1
                    frameId = requestAnimationFrame(animate);
                }, 1000 / 8);
            }

            let frameId = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId);
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId);
                frameId = null;
            }  
        }

    }, [frames, presenting]);

    let style = {};
    if (props.width > 0 && props.height > 0) {
        style = props.width/props.height<1?{width: "100vw"}:{height: "100vh"};
    }
    
    if (presenting) {
        return <Loader title={props.title}/>
    } else {
        return (
            <canvas
                className="Wigglegram"
                ref={mount}
                style={style}
            />
        );
    }
}

export default Wigglegram;
