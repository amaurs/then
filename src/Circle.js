import React, { useState, useRef } from 'react';
import useInterval from './Hooks.js';

import Board from './Board.js';

const getPixelRatio = context => {
    let backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
    
    return (window.devicePixelRatio || 1) / backingStore;
};


let board = new Board(200, 200);

board.randomize();

const Circle = () => {
    let ref = useRef();
    const [count, setCount] = useState(0);

    useInterval(() => {
        setCount(count + 1);
        console.log(count);
        board = board.getNextGeneration();


        let canvas = ref.current;
        let context = canvas.getContext('2d');
         
        let ratio = getPixelRatio(context);
        let width = getComputedStyle(canvas)
            .getPropertyValue('width')
            .slice(0, -2);
        let height = getComputedStyle(canvas)
            .getPropertyValue('height')
            .slice(0, -2);


        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const squareSize = 10;

        
        context.clearRect(0, 0, canvas.width, canvas.height);

        

        //context.beginPath();
        //context.rect(0, 0, 8 * squareSize, 3 * squareSize);
        //context.stroke();

        board.printContext(context, squareSize);


    }, 0);
    
    
    return (
        <canvas
            ref={ref} 
            style={{ width: '1000px', height: '1000px' }}
        />
    );
};

export default Circle;