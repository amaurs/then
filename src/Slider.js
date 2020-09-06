import React, { Component, useContext } from 'react';
import './Slider.css';

import { ThemeContext } from './ThemeContext.js';


const Slider = () => {

    const theme = useContext(ThemeContext);

    return (
        <div style={{position: "fixed",
                     right: "0",
                     bottom: "0",
                     zIndex: "200",
                     margin: "25px"}}
             className="theme-switch-wrapper">
            <label className="theme-switch" >
                <input type="checkbox" id="checkbox" onChange={theme.toggleTheme} checked={theme.theme.slider} />
                <div className="slider round"></div>
            </label>
        </div>
    );
}

export default Slider;
