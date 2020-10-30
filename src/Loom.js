import React, { useState, useRef, useContext, useEffect } from 'react';
import { useTimeout } from './Hooks.js';
import Board from './Board.js';
import './Loom.css';

const canvasSize = 1000;
const squareSize = 10;




const Loom = (props) => {
    let ref = useRef();
    const [drag, setDrag] = useState(false);
    const [position, setPosition] = useState([48 * squareSize, 48 * squareSize]);
    const [offset, setOffset] = useState([0,0]);
    const square = [8 * squareSize, 3 * squareSize];


    useEffect(() => {
        let timeoutId;

        const threadingSize = 5;
        const treadlingSize = 5;
        
        let threading = new Board(canvasSize / squareSize - treadlingSize, threadingSize, .2);
        let treadling = new Board(treadlingSize, canvasSize / squareSize - threadingSize, .2);
        let tieup = new Board(treadlingSize, threadingSize, .2);
        threading.randomize();
        treadling.randomize();
        tieup.randomize();

        const animate = () => {

            timeoutId = setTimeout(function() {
                let canvas = ref.current;
                let context = canvas.getContext('2d');
                
                context.clearRect(0, 0, canvas.width, canvas.height);

                threading = threading.shiftRight();
                treadling = treadling.shiftUp();

                let weave = treadling.multiply(tieup.transpose()).multiply(threading);

                threading.printContext(context, squareSize, "black");
                treadling.printContextOffset(context, squareSize, canvasSize / squareSize - treadlingSize, threadingSize, "black");
                tieup.printContextOffset(context, squareSize, canvasSize / squareSize - treadlingSize, 0, "green");

                weave.printContextOffset(context, squareSize, 0, threadingSize, "red", "blue");
                frameId = requestAnimationFrame(animate);
            }, 1000/60);
        }
    
        let frameId = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(frameId);
            clearTimeout(timeoutId);
            frameId = null;
        }             

    }, [props.threadingSize, props.treadlingSize])



    let style = {};
    if (props.width > 0 && props.height > 0) {
        style = props.width / props.height<1? {width: "100vw"} : {height: "100vh"};
    }
    
    return (
       <canvas
           className="Loom"
           ref={ref} 
           style={style}
           width={canvasSize}
           height={canvasSize}
       />
   );
};

export default Loom;