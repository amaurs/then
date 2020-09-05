import React, { useContext } from 'react';

import './Then.css'

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


const Then = () => {

    const theme = useContext(ThemeContext);

    return (<>
                <div className="Then" style={{color: theme.theme.foreground, 
                                              mixBlendMode: theme.theme.mixBlendMode}}> 
                    <h1 className="name">Then</h1>
                </div>
            </>);
}

export default Then;
