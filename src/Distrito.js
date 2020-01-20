import React, { useRef, useState, useEffect } from 'react';
import { useParams} from "react-router";

import { colorToInt } from './util.js'
import { useInterval } from './Hooks.js';
import './Distrito.css';

import channelsFirst from './assets/4-channels.png';
import channelsSecond from './assets/3-channels.png';





class MultichannelImage {

    constructor(width, height) {
        this.height = height;
        this.width = width;
        this.channels = [];
    }


    addChannel(channel) {
        this.channels.push(channel);
    }

    getMixImageData(channels) {

        let [red, green, blue, alpha] = channels;
        const arr = new Uint8ClampedArray(this.height * this.width * 4);
        for (let i = 0; i < arr.length; i++) {
            arr[i * 4 + 0] = red === -1 ? 0 : this.channels[red][i];
            arr[i * 4 + 1] = green === -1 ? 0 : this.channels[green][i];
            arr[i * 4 + 2] = blue === -1 ? 0 : this.channels[blue][i];
            arr[i * 4 + 3] = alpha === -1 ? 255 : this.channels[alpha][i];
        }
        return new ImageData(arr, this.width, this.height);
    }

    getGrayImageData(channel) {

        const arr = new Uint8ClampedArray(this.height * this.width * 4);
        for (let i = 0; i < arr.length; i++) {
            arr[i * 4 + 0] = channel === -1 ? 0 : this.channels[channel][i];
            arr[i * 4 + 1] = channel === -1 ? 0 : this.channels[channel][i];
            arr[i * 4 + 2] = channel === -1 ? 0 : this.channels[channel][i];
            arr[i * 4 + 3] = 255;
        }
        return new ImageData(arr, this.width, this.height);
    }
}


const Distrito = () => {

    let mount = useRef();
    let [width, setWidth] = useState(0);
    let [height, setHeight] = useState(0);
    let [multiImage, setMultiImage] = useState(null);
    let [rows, setRows] = useState([{red: 2, green: 1, blue: 0}, {red: 3, green: 2, blue: 1}]);

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


        Promise.all([getData(channelsFirst), getData(channelsSecond)]).then(function(values) {
            let [first, second] = values;
        
            let image = new MultichannelImage(first.width, first.height);

            let tm1 = new Uint8ClampedArray(first.width * first.height);
            let tm2 = new Uint8ClampedArray(first.width * first.height);
            let tm3 = new Uint8ClampedArray(first.width * first.height);
            let tm4 = new Uint8ClampedArray(first.width * first.height);
            let tm5 = new Uint8ClampedArray(first.width * first.height);
            let tm6 = new Uint8ClampedArray(first.width * first.height);
            let tm7 = new Uint8ClampedArray(first.width * first.height);

            let l = first.data.length / 4;

            for (let i = 0; i < l; i++) {
                tm1[i] = first.data[i * 4 + 0];
                tm2[i] = first.data[i * 4 + 1];
                tm3[i] = first.data[i * 4 + 2];
                tm4[i] = first.data[i * 4 + 3];
                tm5[i] = second.data[i * 4 + 0];
                tm6[i] = second.data[i * 4 + 1];
                tm7[i] = second.data[i * 4 + 2];
            }
            

            image.addChannel(tm1);
            image.addChannel(tm2);
            image.addChannel(tm3);
            image.addChannel(tm4);
            image.addChannel(tm5);
            image.addChannel(tm6);
            image.addChannel(tm7);


            

            setWidth(image.width * (image.channels.length + 1));
            setHeight(image.height * 3);

            setMultiImage(image);
        });



    }, []);


    useEffect(() => {
    
        if (multiImage !== null) { 
            let context = mount.current.getContext('2d');
            let canvasWidth = mount.current.width;
            let canvasHeight = mount.current.height;
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            for (let i = 0; i < multiImage.channels.length; i++) {
                context.putImageData(multiImage.getMixImageData([i, i, i, -1]), i * multiImage.width, 0);
            }

            rows.forEach((row, index) => {
                let { red, green, blue } = row;

                context.putImageData(multiImage.getMixImageData([red, -1, -1, -1]), red * multiImage.width, (1 + index) * multiImage.height);
                context.putImageData(multiImage.getMixImageData([-1, green, -1, -1]), green * multiImage.width, (1 + index) * multiImage.height);
                context.putImageData(multiImage.getMixImageData([-1, -1, blue, -1]), blue * multiImage.width, (1 + index) * multiImage.height);

                context.putImageData(multiImage.getMixImageData([red, green, blue, -1]), multiImage.channels.length * multiImage.width, (1 + index) * multiImage.height);
            })

        }

    }, [multiImage, width, height]);

    return (<canvas className="Distrito"
                ref={mount} 
                width={width + "px"}
                height={height + "px"}
            />);
}

export default Distrito;
