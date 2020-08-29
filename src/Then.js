import React from 'react';

import './Then.css'


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

    return (
            <>
            {props.content}
            <div className="Then">
              <h1 className="name">then</h1>
            </div>
            </>);
}

export default Then;
