import React from 'react';
import corrupted from './assets/escudo.m4v';
import './Corrupted.css'

const Corrupted = () => {
    return (<video autoPlay loop muted>
                <source src={corrupted} type="video/mp4"/>
            </video>);
}

export default Corrupted;
