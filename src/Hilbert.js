import React, { useRef, useState, useEffect } from 'react';

import { colorToInt } from './util.js'

import './Hilbert.css';

import hilbert_cube from './assets/hilbert_cube_512_512.png';
import hilbert_square from './assets/hilbert_square_512_512.png';

const Hilbert = (props) => {

    let mount = useRef();
    let [color, setColor] = useState(null);
    let [position, setPosition] = useState(null);

    useEffect(() => {
        console.log("First call hilbert.")

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
            setColor(imageData);
        })

        getData(hilbert_square).then(imageData => {
            setPosition(imageData);
        })

    }, []);


    useEffect(() => {

        if (color !== null && position !== null) {
            console.log(color);
            console.log(position);

            let context = mount.current.getContext('2d');
            let canvasWidth = mount.current.width;
            let canvasHeight = mount.current.height;
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            let frame = context.getImageData(0, 0, canvasWidth, canvasHeight);

            let l = frame.data.length / 4;

            for (let i = 0; i < l; i++) {

                let r = position.data[i * 4 + 0];
                let g = position.data[i * 4 + 1];
                let b = position.data[i * 4 + 2];
                let a = position.data[i * 4 + 3];

                let j = colorToInt(r, g, b);

                frame.data[j * 4 + 0] = color.data[i * 4 + 0];
                frame.data[j * 4 + 1] = color.data[i * 4 + 1];
                frame.data[j * 4 + 2] = color.data[i * 4 + 2];
                frame.data[j * 4 + 3] = 255;
            }
            context.putImageData(frame, 0, 0);
        }

    }, [color, position]);


    return (<canvas className="Hilbert" 
                width={512 + "px"} 
                height={512 + "px"} 
                ref={mount} 
            />);
}

export default Hilbert;
