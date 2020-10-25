import React, { Fragment, useContext, useState } from 'react';

import './Then.css'

import { useInterval } from './Hooks.js';

import { ThemeContext } from './ThemeContext.js';
/**
              <p className="pronunciation">/ <span className="underline">TH</span>en /</p>
              <p className="type">adverb</p>
              <ol>
                <li><p>at that time; at the time in question.</p></li>
                <li><p>after that; next; afterward.</p></li>
                <li><p>in that case; therefore.</p></li>
              </ol>

**/


const Then = (props) => {

    const theme = useContext(ThemeContext);
    let [tick, setTick] = useState(0);

    useInterval(() => {
        props.setIndexBackground(props.keys[tick % props.keys.length]);
        setTick(tick + 1);
    }, 10000);

    return <div className="Then" style={{color: theme.theme.foreground, 
                                         mixBlendMode: theme.theme.mixBlendMode}}> 
                    <h1 className="name">Then</h1>
           </div>;
}

export default Then;
