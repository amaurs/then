import React, { useState, useRef, useContext, useEffect } from 'react';
import { useInterval, useTimeout } from './Hooks.js';
import './Mandelbrot.css';
import Loader from './Presentation.js';
import myMandelbrot from './assets/mandelbrot-small.png';
import { ThemeContext } from './ThemeContext.js';
import { getXYfromIndex } from './util.js';


const wikipedia = {
    0:  [66, 30, 15],
    1:  [25, 7, 26],
    2:  [9, 1, 47],
    3:  [4, 4, 73],
    4:  [0, 7, 100],
    5:  [12, 44, 138],
    6:  [24, 82, 177],
    7:  [57, 125, 209],
    8:  [134, 181, 229],
    9:  [211, 236, 248],
    10: [241, 233, 191],
    11: [248, 201, 95],
    12: [255, 170, 0],
    13: [204, 128, 0],
    14: [153, 87, 0],
    15: [106, 52, 3]
}


const apple = {
    0:  [0, 0, 0],
    1:  [100, 45, 164],
    2:  [62, 55, 116],
    3:  [200, 78, 232],
    4:  [66, 74, 22],
    5:  [203, 110, 45],
    6:  [128, 128, 128],
    7:  [226, 171, 190],
    8:  [41, 85, 66],
    9:  [128, 128, 128],
    10: [74, 150, 233],
    11: [189, 181, 243],
    12: [94, 191, 59],
    13: [193, 201, 142],
    14: [162, 212, 192],
    15: [255, 255, 255]
}

const cga = {
    0:  [255, 255, 255],
    1:  [234, 159, 246],
    2:  [199, 255, 255],
    3:  [184, 105, 98],
    4:  [170, 95, 182],
    5:  [128, 113, 204],
    6:  [120, 41, 34],
    7:  [64, 49, 141],
    8:  [234, 180, 137],
    9:  [191, 206, 114],
    10: [170, 116, 73],
    11: [148, 224, 137],
    12: [135, 214, 221],
    13: [85, 160, 73],
    14: [255, 255, 178],
    15: [0, 0, 0]
}

const amau = {
    0: [238,187,175],
    1: [159,152,144],
    2: [81,75,77],
    3: [204,156,50],
    4: [233,230,225]
}

let colors = wikipedia;



const Mandelbrot = (props) => {
    const mount = useRef();
    const theme = useContext(ThemeContext);
    const [presenting, setPresenting] = useState(true);
    const [delay, setDelay] = useState(null);

    const [imageData, setImageData] = useState(null);


    useTimeout(() => {
        setPresenting(false);
        setDelay(50);
    }, props.delay)


    useEffect(() => {
        if (props.width > 0 && props.height > 0 && !presenting) {
            const onLoad = (event) => {
                let image = event.target;
                let canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                let context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                let frame = context.getImageData(0, 0, image.width, image.height);
                setImageData(frame);
            }
            let image = new Image();
            image.src = myMandelbrot;
            image.onload = onLoad;
        }

    }, [props.width, props.height, presenting]);


    useEffect(() => {

        if(imageData !== null) {

            // This constants come from the execution of the image,
            // need to figure out how to pass this down in a more
            // dynamic way.

            const re_center = -0.8558480128149437,
                  im_center = -0.24698034102223154,
                  zoom = Math.pow(2.0, 10);

            const base_re_width = 1.0 / zoom,
                  base_im_height = base_re_width * 100 / 100;

            const re_min = re_center - base_re_width / 2,
                  im_min = im_center - base_im_height / 2,
                  re_max = re_center + base_re_width / 2,
                  im_max = im_center + base_im_height / 2;

            let tick = 0;

            let timeoutId;

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function() {
                    let canvas = mount.current;
                    canvas.width = imageData.width;
                    canvas.height = imageData.height;
                    let context2 = canvas.getContext('2d');
                    let frame = context2.createImageData(imageData);
                    for(let i = 0; i < imageData.width * imageData.height * 4; i+=4) {
                        let n = imageData.data[i];
                        let pixel = getXYfromIndex(i / 4, imageData.width);
                        let re = re_min + pixel[0] * base_re_width / imageData.width;
                        let im = im_min + pixel[1] * base_im_height / imageData.height;
                            
                        // This should not be a constant, this value is the module
                        // of the complex number after it just escaped to infinity.

                        let module = Math.sqrt(5)
                        let logAbs = Math.log(module);
                        let logTwo = Math.log(2.0)
                        let aux = Math.log(logAbs) / logTwo;  
                        let continuous = 1.0 + n * 1.0 - aux;
                        let index = Math.floor(continuous);
                        let size = Object.keys(colors).length;
                        let a = colors[(index + tick) % size];
                        let b = colors[(index + 1 + tick) % size];
                        let p = 1 - (continuous - index);
                        let red = Math.floor(p * a[0] + (1 - p) * b[0]);
                        let green = Math.floor(p * a[1] + (1 - p) * b[1]);
                        let blue = Math.floor(p * a[2] + (1 - p) * b[2]);
                        frame.data[i] = red;
                        frame.data[i + 1] = green;
                        frame.data[i + 2] = blue;
                        frame.data[i + 3] = 255;
                    }
                    context2.putImageData(frame, 0, 0);
                    tick = tick + 1
                    frameId = requestAnimationFrame(animate);
                }, 1000 / 4);
            }

            let frameId = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId);
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId);
                frameId = null;
            }  
        }

    }, [imageData]);

    let style = {};
    if (props.width > 0 && props.height > 0) {
        style = props.width/props.height<1?{width: "100vw"}:{height: "100vh"};
    }
    
    if (presenting) {
        return <Loader title={props.title}/>
    } else {
        return (
            <canvas
                className="Mandelbrot"
                ref={mount}
                style={style}
            />
        );
    }
};

export default Mandelbrot;