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
    let [rows, setRows] = useState(null);


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
            setRows([{red: {position: 2,
                            x: 2 * image.width,
                            y: 1 * image.height,
                            width: image.width,
                            height: image.height}, 
                        green: {position: 1,
                                x: 1 * image.width,
                                y: 1 * image.height,
                                width: image.width,
                                height: image.height}, 
                        blue: {position: 0,
                                x: 0 * image.width,
                                y: 1 * image.height,
                                width: image.width,
                                height: image.height}}, 
                    {red: {position: 3,
                            x: 3 * image.width,
                            y: 2 * image.height,
                            width: image.width,
                            height: image.height}, 
                        green: {position: 2,
                                x: 2 * image.width,
                                y: 2 * image.height,
                                width: image.width,
                                height: image.height}, 
                        blue: {position: 1,
                                x: 1 * image.width,
                                y: 2 * image.height,
                                width: image.width,
                                height: image.height}}]);
        });



    }, []);


    useEffect(() => {
        if (multiImage !== null && width !== null && height !== null && rows !== null) { 

            let context = mount.current.getContext('2d');
            let canvasWidth = mount.current.width;
            let canvasHeight = mount.current.height;
            context.clearRect(0, 0, canvasWidth, canvasHeight);


            

            for (let i = 0; i < multiImage.channels.length; i++) {
                context.putImageData(multiImage.getMixImageData([i, i, i, -1]), i * multiImage.width, 0);
            }

            rows.forEach((row, index) => {
                let { red, green, blue } = row;

                console.table(green);
                if (!(red.position < 0)) {
                    context.putImageData(multiImage.getMixImageData([red.position, -1, -1, -1]), red.x, red.y);
                }
                if (!(green.position < 0)) {
                    context.putImageData(multiImage.getMixImageData([-1, green.position, -1, -1]), green.x, green.y);
                }
                if (!(blue.position < 0)) {
                    context.putImageData(multiImage.getMixImageData([-1, -1, blue.position, -1]), blue.x, blue.y);
                }
                context.putImageData(multiImage.getMixImageData([red.position, green.position, blue.position, -1]), multiImage.channels.length * multiImage.width, (1 + index) * multiImage.height);
            })
 
        }
        
    }, [multiImage, width, height, rows]);


    const handleOnClick = (e) => {
        let rect = mount.current.getBoundingClientRect();
        let x = Math.floor((e.pageX - rect.left) / rect.width * width),
            y = Math.floor((e.pageY - rect.top) / rect.height * height);

        console.log(x, y);

        console.log("row: " + Math.floor(y / multiImage.height));
        console.log("col: " + Math.floor(x / multiImage.width));

        let row = Math.floor(y / multiImage.height) - 1;
        let column = Math.floor(x / multiImage.width);

        if (!(row < 0) && column < multiImage.channels.length) {
            let newRows = [...rows];


            let changed = false;

            if (x >= newRows[row].red.x && x < newRows[row].red.x + newRows[row].red.width && 
                y >= newRows[row].red.y && y < newRows[row].red.y + newRows[row].red.height) {
                
                if (newRows[row].red.position < 0) {
                    newRows[row].red.position = column;
                } else {
                    newRows[row].red.position = -1;
                }
                changed = true;
            }

            if (x >= newRows[row].green.x && x < newRows[row].green.x + newRows[row].green.width && 
                y >= newRows[row].green.y && y < newRows[row].green.y + newRows[row].green.height) {
                if (newRows[row].green.position < 0) {
                    newRows[row].green.position = column;
                } else {
                    newRows[row].green.position = -1;
                }
                changed = true;
            }


            if (x >= newRows[row].blue.x && x < newRows[row].blue.x + newRows[row].blue.width && 
                y >= newRows[row].blue.y && y < newRows[row].blue.y + newRows[row].blue.height) {
                if (newRows[row].blue.position < 0) {
                    newRows[row].blue.position = column;
                } else {
                    newRows[row].blue.position = -1;
                }
                changed = true;
            }



            if (!changed && (newRows[row].red.position < 0 || newRows[row].green.position < 0 || newRows[row].blue.position < 0)) {
                
                // Some slot is open, we can assign
                console.log("Some slot is open, we can assign");
                if (newRows[row].red.position < 0) {
                    
                    newRows[row].red.position = column;
                    newRows[row].red.x = column * multiImage.width;
                    newRows[row].red.y = (row + 1) * multiImage.height;
                    newRows[row].red.width = multiImage.width;
                    newRows[row].red.height = multiImage.height;
                }
                if (newRows[row].green.position < 0) {
                    
                    newRows[row].green.position = column;
                    newRows[row].green.x = column * multiImage.width;
                    newRows[row].green.y = (row + 1) * multiImage.height;
                    newRows[row].green.width = multiImage.width;
                    newRows[row].green.height = multiImage.height;
                }
                if (newRows[row].blue.position < 0) {
                    
                    newRows[row].blue.position = column;
                    newRows[row].blue.x = column * multiImage.width;
                    newRows[row].blue.y = (row + 1) * multiImage.height;
                    newRows[row].blue.width = multiImage.width;
                    newRows[row].blue.height = multiImage.height;
                }


            }


            setRows(newRows);
        }
    
    }

    return (<canvas className="Distrito"
                ref={mount} 
                width={width + "px"}
                height={height + "px"}
                onClick={handleOnClick}
            />);
}

export default Distrito;
