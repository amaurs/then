import React, { Component, useContext } from 'react';
import './Slider.css';

import { ThemeContext } from './ThemeContext.js';


const Slider = (props) => {

    const theme = useContext(ThemeContext);

    return (
        <div className="theme-switch-wrapper">
            <label className="theme-switch" for="checkbox" onChange={props.onClick}>
                <input type="checkbox" id="checkbox" />
                <div className="slider round"></div>
            </label>
        </div>
    );
}

export default Slider;
