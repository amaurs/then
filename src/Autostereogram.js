import React, { useRef, useState } from 'react';
import { useRequestAnimationFrame } from './Hooks.js';
import { intToColor } from './util.js';

import Board from './Board.js';

let board = new Board(100, 450);

board.init();

const Autostereogram = (props) => {
    let ref = useRef();
    const squareSize = 1;

    useRequestAnimationFrame(() => {
        board.randomize();
        let canvas = ref.current;
        let context = canvas.getContext('2d');
        let frame  = new ImageData(
                            new Uint8ClampedArray(props.frame.data),
                            props.frame.width,
                            props.frame.height
                          );
        for(let y = 0; y < props.frame.height; y++) {
            for(let x = 0; x < props.frame.width; x++) {
                let index = (y * props.frame.width + x) * 4;
                if (!(x < 100)) {
                    let average = ((frame.data[index + 0] + 
                                               frame.data[index + 1] + 
                                               frame.data[index + 2]) / 3) / 255;
                    let offset = Math.floor(average * (32 - 1));
                    
                    
                    if (offset > 0) {
                        let value = board.getXY((x % 100) + offset, y);
                        board.setXY((x % 100), y, value);
                    }   
                }
                if (board.getXY((x % 100), y)) {
                    frame.data[index + 0] = 0; 
                    frame.data[index + 1] = 0; 
                    frame.data[index + 2] = 0;
                } else {
                    frame.data[index + 0] = 255; 
                    frame.data[index + 1] = 255; 
                    frame.data[index + 2] = 255;
                }

            }
        }
        context.putImageData(frame, 0, 0);
    });

    

    return (
            <canvas
                ref={ref}
                width={props.frame.width}
                height={props.frame.height}
        />
        );
}

export default Autostereogram;
