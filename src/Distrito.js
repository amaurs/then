import React, { useRef, useState, useEffect } from 'react';
import { useParams} from "react-router";

import { colorToInt } from './util.js'
import { useInterval } from './Hooks.js';
import './Distrito.css';

import channelsFirst from './assets/4-channels.png';
import channelsSecond from './assets/3-channels.png';
import channelMask from './assets/mask.png';




class MultichannelImage {

    constructor(width, height) {
        this.height = height;
        this.width = width;
        this.channels = [];
        this.mask = new Uint8ClampedArray(this.height * this.width).fill(255);
    }

    addChannel(channel) {
        this.channels.push(channel);
    }

    addMask(mask) {
        this.mask = mask;
    }

    getMixImageData(channels) {
        let [red, green, blue] = channels;
        const arr = new Uint8ClampedArray(this.height * this.width * 4);
        for (let i = 0; i < arr.length; i++) {
            arr[i * 4 + 0] = red === -1 ? 0 : this.channels[red][i];
            arr[i * 4 + 1] = green === -1 ? 0 : this.channels[green][i];
            arr[i * 4 + 2] = blue === -1 ? 0 : this.channels[blue][i];
            arr[i * 4 + 3] = this.mask[i];
        }
        return new ImageData(arr, this.width, this.height);
    }

    getGrayImageData(channel) {
        return this.getMixImageData([channel, channel, channel]);
    }
}


const Distrito = () => {

    let mount = useRef();
    let [width, setWidth] = useState(0);
    let [height, setHeight] = useState(0);
    let [multiImage, setMultiImage] = useState(null);
    let [rows, setRows] = useState(null);

    const colorMap = {"red": 0, 
                    "green": 1,
                    "blue": 2};

    useEffect(() => {

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


        Promise.all([getData(channelsFirst), getData(channelsSecond), getData(channelMask)]).then(function(values) {
            let [first, second, third] = values;
        
            let image = new MultichannelImage(first.width, first.height);

            let tm1 = new Uint8ClampedArray(first.width * first.height);
            let tm2 = new Uint8ClampedArray(first.width * first.height);
            let tm3 = new Uint8ClampedArray(first.width * first.height);
            let tm4 = new Uint8ClampedArray(first.width * first.height);
            let tm5 = new Uint8ClampedArray(first.width * first.height);
            let tm6 = new Uint8ClampedArray(first.width * first.height);
            let tm7 = new Uint8ClampedArray(first.width * first.height);
            let mask = new Uint8ClampedArray(first.width * first.height);

            let l = first.data.length / 4;

            for (let i = 0; i < l; i++) {
                tm1[i] = first.data[i * 4 + 0];
                tm2[i] = first.data[i * 4 + 1];
                tm3[i] = first.data[i * 4 + 2];
                tm4[i] = first.data[i * 4 + 3];
                tm5[i] = second.data[i * 4 + 0];
                tm6[i] = second.data[i * 4 + 1];
                tm7[i] = second.data[i * 4 + 2];
                mask[i] = third.data[i * 4 + 0];
            }
            

            image.addChannel(tm1);
            image.addChannel(tm2);
            image.addChannel(tm3);
            image.addChannel(tm4);
            image.addChannel(tm5);
            image.addChannel(tm6);
            image.addChannel(tm7);
            image.addMask(mask);

            setWidth(image.width * (image.channels.length + 1));
            setHeight(image.height * 3);
            setMultiImage(image);
            setRows([{used: [{position: 2, color: "red"}, 
                             {position: 1, color: "green"}, 
                             {position: 0, color: "blue"}, 
                             ],
                      available: []},
                     {used: [{position: 1, color: "red"}, 
                             {position: 2, color: "green"}, 
                             {position: 3, color: "blue"}, 
                             ],
                      available: []}]);

        });
    }, []);



    useEffect(() => {
        if (multiImage !== null && width !== null && height !== null && rows !== null) { 
            let realContext = mount.current.getContext('2d');
            let canvasWidth = mount.current.width;
            let canvasHeight = mount.current.height;
            realContext.clearRect(0, 0, canvasWidth, canvasHeight);
            realContext.filter = 'brightness(1) saturate(100%) contrast(100%) opacity(1)';


            const offscreen = document.createElement('canvas');
            offscreen.width = mount.current.width;
            offscreen.height = mount.current.height;

            let context = offscreen.getContext('2d')
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            for (let i = 0; i < multiImage.channels.length; i++) {
                context.putImageData(multiImage.getGrayImageData(i), i * multiImage.width, 0);
            }

            rows.forEach((row, index) => {
                let mergedBands = [-1, -1, -1];
                row.used.forEach((colorObject) => {
                    let bands = [-1, -1, -1];
                    bands[colorMap[colorObject.color]] = colorObject.position;
                    mergedBands[colorMap[colorObject.color]] = colorObject.position;
                    context.putImageData(multiImage.getMixImageData(bands), colorObject.position * multiImage.width, (1 + index) * multiImage.height);
                });
                context.putImageData(multiImage.getMixImageData(mergedBands), multiImage.channels.length * multiImage.width, (1 + index) * multiImage.height);
            });
            realContext.drawImage(offscreen, 0, 0);
        }
        
    }, [multiImage, width, height, rows]);


    const handleOnClick = (e) => {
        let rect = mount.current.getBoundingClientRect();
        let x = Math.floor((e.pageX - rect.left) / rect.width * width),
            y = Math.floor((e.pageY - rect.top) / rect.height * height);
        let row = Math.floor(y / multiImage.height) - 1;
        let column = Math.floor(x / multiImage.width);

        
        let newRows = [...rows];


        let active = false;

        let newUsed = [];
        let newAvailable = [...newRows[row].available];
        
        // First I check if they clicked on an assigned space.

        newRows[row].used.forEach(colorObject => {
            if (colorObject.position === column) {
                newAvailable.unshift({color: colorObject.color, position: -1});
                active = true;
            } else {
                newUsed.push({...colorObject});
            }
        });

        // If they didn't, I get the last color that was unassigned and put in in place.

        if (!active && newAvailable.length > 0) {
            let colorObject = newAvailable.shift();
            colorObject.position = column;
            newUsed.push(colorObject);
        }

        newRows[row].used = newUsed;
        newRows[row].available = newAvailable;
        setRows(newRows);
    }

    return (<canvas className="Distrito"
                ref={mount} 
                width={width + "px"}
                height={height + "px"}
                onClick={handleOnClick}
            />);
}

export default Distrito;
