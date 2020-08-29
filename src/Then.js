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


const Then = (props) => {

    const theme = useContext(ThemeContext);

    return (<>
                {props.content}
                <div className="Then" style={{color: theme.theme.foreground, 
                                              mixBlendMode: theme.theme.mixBlendMode}}> 
                </div>
            </>);
}

export default Then;
