import React, { Component, useContext } from 'react';
import './Slider.css';

import { ThemeContext } from './ThemeContext.js';


const Slider = () => {

    const theme = useContext(ThemeContext);

    return (
        <div className="theme-switch-wrapper">
            <label className="theme-switch" >
                <input type="checkbox" id="checkbox" onChange={theme.toggleTheme} checked={theme.theme.slider} />
                <div className="slider round"></div>
            </label>
        </div>
    );
}

export default Slider;
