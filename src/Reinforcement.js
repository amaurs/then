import React, { useEffect, useState, useRef } from 'react';

import { Environment, map} from './rl/windyGridworld.js';
import Controller from './rl/controller';
import { Agent } from './rl/sarsaAgent.js';

import './Reinforcement.css'

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

    useEffect(() => {
        const animate = () => {
            requestRef.current = requestAnimationFrame(animate);
            controller.tick();
            setBoard(controller.toBoard());
        }
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(requestRef.current);
        }
    }, []);

    if (board !== null) {
        const rows = board.map((row, rowIndex) => 
            <div key={rowIndex}>{row.map((cell, cellIndex) => <div style={style} key={cellIndex}>{getIcon(cell)}</div>)}</div>
        );

        return (<div className="Reinforcement">
                    {rows}
                </div>);
    } else {
        return board
    }
}