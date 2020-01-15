import React, { useRef, useState, useEffect } from 'react';

import './Hilbert.css';

import hilbert_cube from './assets/hilbert_cube_512_512.png';
import hilbert_square from './assets/hilbert_square_512_512.png';

const Hilbert = (props) => {

    let mount = useRef();

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
            console.log(imageData)
        })

        getData(hilbert_square).then(imageData => {
            console.log(imageData)
        })

    }, []);


    return (<canvas className="Hilbert" 
                width={props.width + "px"} 
                height={props.height + "px"} 
                ref={mount} 
            />);
}

export default Hilbert;
