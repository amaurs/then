import React, { useEffect, useState, useRef } from 'react';
import { Environment, map} from './rl/windyGridworld.js';
import Controller from './rl/controller';
import { Agent } from './rl/sarsaAgent.js';
import './Reinforcement.css';
import { useTimeout } from './Hooks.js';
import Loader from './Presentation.js';

const environment = new Environment(map.height, 
                                    map.width, 
                                    map.boardPlan,
                                    map.wind,
                                    map.agent,
                                    map.goal);
const agent = new Agent(environment.getNumberOfActions(), environment.getNumberOfStates());
const controller = new Controller(environment, agent);

function  getIcon(key){
    const emojis = {"o": "🤖", 
                    "%": "🍺",
                    "*": "🌹",
                    "$": "🐯"  };
    return emojis[key];
}

export default function Reinforcement(props) {
    const squareSize = props.width / map.width;
    const style = {height: squareSize + "px", 
                   width: squareSize + "px", 
                   fontSize: (squareSize * 0.75) + "px"};
    const [board, setBoard] = useState(null);
    const requestRef = useRef();
    const [presenting, setPresenting] = useState(true);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        let timeoutId;
        let n = 0;
        if (!presenting) {
            const animate = () => {
                timeoutId = setTimeout(function() {
                    controller.tick();
                    setBoard(controller.toBoard());
                    n += 1;
                    requestRef.current = requestAnimationFrame(animate);
                    console.log("One tick: " + n)

                }, 1000 / 10);
            }
            requestRef.current = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(requestRef.current);
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId);
            }
        }
    }, [presenting]);

    if (board !== null && !presenting) {
        const rows = board.map((row, rowIndex) => 
            <div key={rowIndex}>{row.map((cell, cellIndex) => <div style={style} key={cellIndex}>{getIcon(cell)}</div>)}</div>
        );

        return (
            <div className="Reinforcement">
                {rows}
            </div>
        );
    } else {
        return <Loader title={props.title}/>;
    }
}
