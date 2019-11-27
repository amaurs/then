import React, { useRef } from 'react';
import { useRequestAnimationFrame } from './Hooks.js';
import { intToColor } from './util.js';

import Board from './Board.js';

let board = new Board(500, 500);

board.init();


const Autostereogram = () => {

    let ref = useRef();
    const squareSize = 1;


    useRequestAnimationFrame(() => {
        board.randomize();
        let canvas = ref.current;
        let context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        board.printContext(context, squareSize, intToColor(0))

    }, 100);

    return (
            <canvas
                ref={ref} 
                width={500}
                height={500}
        />
        );
}

export default Autostereogram;
