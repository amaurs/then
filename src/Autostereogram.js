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

        context.clearRect(0, 0, canvas.width, canvas.height);
        board.printContext(context, squareSize, intToColor(0))

        //context.putImageData(props.data, 0, 0);

    }, 100);

    

    return (
            <canvas
                ref={ref}
                width={props.width}
                height={props.height}
        />
        );
}

export default Autostereogram;
