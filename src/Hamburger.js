import React, { Component, useContext } from 'react';
import './Hamburger.css';

import { ThemeContext } from './ThemeContext.js';


const Hamburger = (props) => {

    const theme = useContext(ThemeContext);


    
    return (
        <div onClick={props.onClick} className={"Hamburger" + (props.isActive?" active":"")}>
            <div className="Hamburger-hamburger" style={{background: theme.theme.foreground}}></div>
        </div>
    );
}

export default Hamburger;
