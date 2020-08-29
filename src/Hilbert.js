import React, { useRef, useState, useEffect } from 'react';
import { useParams} from "react-router";
import { colorToInt } from './util.js'
import { useInterval } from './Hooks.js';
import './Hilbert.css';
import { useTimeout } from './Hooks.js';
import Loader from './Presentation.js';
import hilbert_cube_8 from './assets/hilbert_cube_8_8.png';
import hilbert_square_8 from './assets/hilbert_square_8_8.png';
import hilbert_cube_64 from './assets/hilbert_cube_64_64.png';
import hilbert_square_64 from './assets/hilbert_square_64_64.png';
import hilbert_cube_512 from './assets/hilbert_cube_512_512.png';
import hilbert_square_512 from './assets/hilbert_square_512_512.png';
import hilbert_cube_4096 from './assets/hilbert_cube_4096_4096.png';
import hilbert_square_4096 from './assets/hilbert_square_4096_4096.png';

const image_cube_map = {8: hilbert_cube_8,
                        64: hilbert_cube_64,
                        512: hilbert_cube_512,
                        4096: hilbert_cube_4096};

const image_square_map = {8: hilbert_square_8,
                          64: hilbert_square_64,
                          512: hilbert_square_512,
                          4096: hilbert_square_4096};

const Hilbert = (props) => {
    let { res } = useParams();
    if(res === undefined) {
        res = 8;
    }

    let mount = useRef();
    let [color, setColor] = useState(null);
    let [position, setPosition] = useState(null);
    const [presenting, setPresenting] = useState(props.delay>0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        
        let hilbert_cube = image_cube_map[res];
        let hilbert_square = image_square_map[res];
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

        getData(hilbert_cube).then(imageData => {
            if (!cancel) {
                setColor(imageData);
            }
        })

        getData(hilbert_square).then(imageData => {
            if (!cancel) {
                setPosition(imageData);
            }
        })

        return () => {cancel = true};

    }, [res]);


    useEffect(() => {

        if (color !== null && position !== null && !presenting) {
            let count = 0;
            let timeoutId;

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function() {
                    let context = mount.current.getContext('2d');
                    context.imageSmoothingEnabled= false;
                    let canvasWidth = mount.current.width;
                    let canvasHeight = mount.current.height;
                    context.clearRect(0, 0, canvasWidth, canvasHeight);
                    let frame = context.getImageData(0, 0, canvasWidth, canvasHeight);
        
                    let l = frame.data.length / 4;
        
                    for (let i = 0; i < l; i++) {
        
                        let index = (i + count) % l;
        
                        let r = position.data[index * 4 + 0];
                        let g = position.data[index * 4 + 1];
                        let b = position.data[index * 4 + 2];
                        let j = colorToInt(r, g, b);
        
                        frame.data[j * 4 + 0] = color.data[i * 4 + 0];
                        frame.data[j * 4 + 1] = color.data[i * 4 + 1];
                        frame.data[j * 4 + 2] = color.data[i * 4 + 2];
                        frame.data[j * 4 + 3] = 255;
                    }
                    context.putImageData(frame, 0, 0);

                    frameId = requestAnimationFrame(animate);
                    count += 1;
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

    }, [color, position, presenting]);



    let style = {};
    if (props.width > 0 && props.height > 0) {
        style = props.width/props.height<1?{width: "100vw"}:{height: "100vh"};
    }
    

    if (presenting) {
        return <Loader title={props.title}/>
    } else {
        return (
            <canvas className="Hilbert" 
                    style={style}
                    width={res + "px"} 
                    height={res + "px"} 
                    ref={mount} 
            />
        );
    }
}

export default Hilbert;
