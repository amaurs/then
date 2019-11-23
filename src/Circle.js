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


let board = new Board(50, 50);

board.randomize();



const Circle = () => {
    let ref = useRef();

    const [count, setCount] = useState(0);
    const [drag, setDrag] = useState(false);
    const [position, setPosition] = useState([0,0]);
    const [offset, setOffset] = useState([0,0]);
    const squareSize = 10;
    const square = [8 * squareSize, 3 * squareSize];




    useInterval(() => {
        
        board = board.getNextGeneration();
        let canvas = ref.current;
        let context = canvas.getContext('2d');
        let ratio = getPixelRatio(context);
        
        /**
        let width = getComputedStyle(canvas)
            .getPropertyValue('width')
            .slice(0, -2);
        let height = getComputedStyle(canvas)
            .getPropertyValue('height')
            .slice(0, -2);
        **/

        
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "black";
        board.printContext(context, squareSize);
        context.strokeStyle = "red";

        context.beginPath();
        context.rect(position[0], position[1], square[0], square[1]); 
        context.stroke();
        setCount(count + 1);
    }, 0);

    const handleOnMouseDown = (e) => {
        let rect = ref.current.getBoundingClientRect();

        console.log("Mouse down: " + (e.pageX - rect.left) + "," + (e.pageY - rect.top));


        let x = (e.pageX - rect.left),
            y = (e.pageY - rect.top);


        if (position[0] <= x && x <= position[0] + square[0] && 
            position[1] <= y && y <= position[1] + square[1]) {
            setDrag(true);
            setOffset([x - position[0], y - position[1]]);
        }            

    } 

    const handleOnMouseUp = (e) => {
        let rect = ref.current.getBoundingClientRect();
        
        setDrag(false);

        console.log("Mouse up: " + (e.pageX - rect.left) + "," + (e.pageY - rect.top));
    } 

    const handleOnMouseMove = (e) => {
        let rect = ref.current.getBoundingClientRect();

        if(drag){
            console.log("Mouse move: " + (e.pageX - rect.left) + "," + (e.pageY - rect.top));

            let newX = Math.round((e.pageX - rect.left) / 10) * 10,
                newY = Math.round((e.pageY - rect.top) / 10) * 10
                



            setPosition([newX - offset[0], newY - offset[1]]);
        }
        
    }

    const handleOnClick = (e) => {
        let rect = ref.current.getBoundingClientRect();
        

        console.log("Mouse click: " + (e.pageX - rect.left) + "," + (e.pageY - rect.top));
    }
    
    return (
        <canvas
            ref={ref} 
            width={500}
            height={500}
            onMouseDown={handleOnMouseDown}
            onMouseUp={handleOnMouseUp}
            onMouseMove={handleOnMouseMove}
            onClick={handleOnClick}
        />
    );
};

export default Circle;