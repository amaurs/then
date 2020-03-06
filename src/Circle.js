import React, { useState, useRef } from 'react';
import { useInterval } from './Hooks.js';

import Board from './Board.js';

let board = new Board(100, 100);

board.init();

board.gliderGun(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), );
board.gliderGun(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), );
board.gliderGun(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), );
board.gliderGun(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), );


const Circle = (props) => {
    let ref = useRef();
    const squareSize = 10;
    const [count, setCount] = useState(0);
    const [drag, setDrag] = useState(false);
    const [position, setPosition] = useState([48 * squareSize, 48 * squareSize]);
    const [offset, setOffset] = useState([0,0]);
    const square = [8 * squareSize, 3 * squareSize];

    useInterval(() => {
        board = board.getNextGeneration();
        let canvas = ref.current;
        let context = canvas.getContext('2d');
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "black";
        let color = board.getColor(context, squareSize, position[0] / squareSize, 
                                             position[1] / squareSize, 
                                             square[0] / squareSize, 
                                             square[1] / squareSize);
        board.printContext(context, squareSize, color);
        //board.highlight(context, squareSize, position[0] / squareSize, 
        //                                     position[1] / squareSize, 
        //                                     square[0] / squareSize, 
        //                                     square[1] / squareSize);
        setCount(count + 1);
    }, 50);

    const handleOnMouseDown = (e) => {
        let rect = ref.current.getBoundingClientRect();
        let x = Math.round((e.pageX - rect.left) / 10) * 10,
            y = Math.round((e.pageY - rect.top) / 10) * 10;
        if (position[0] <= x && x <= position[0] + square[0] && 
            position[1] <= y && y <= position[1] + square[1]) {
            setDrag(true);
            setOffset([x - position[0], y - position[1]]);
        }
    } 

    const handleOnMouseUp = (e) => {
        setDrag(false);
    } 

    const handleOnMouseMove = (e) => {
        let rect = ref.current.getBoundingClientRect();

        if(drag){
            let newX = Math.round((e.pageX - rect.left) / 10) * 10,
                newY = Math.round((e.pageY - rect.top) / 10) * 10
            setPosition([newX - offset[0], newY - offset[1]]);
        }
    }

    const handleOnClick = (e) => {
        let rect = ref.current.getBoundingClientRect();
        let x = Math.floor(Math.round((e.pageX - rect.left) / 10)),
            y = Math.floor(Math.round((e.pageY - rect.top) / 10));

        board.setXY(x, y, 1);

    }

    let style = {};
    if (props.width > 0 && props.height > 0) {
        style = props.width/props.height<1?{width: "100%"}:{height: "100%"};
    }
    
    
    return (
        <canvas
            ref={ref} 
            style={style}
            width={1000}
            height={1000}
            onMouseDown={handleOnMouseDown}
            onMouseUp={handleOnMouseUp}
            onMouseMove={handleOnMouseMove}
            onClick={handleOnClick}
        />
    );
};

export default Circle;