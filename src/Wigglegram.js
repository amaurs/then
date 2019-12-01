import React from 'react';
import video from './assets/emji.mp4'
import './Wigglegram.css'

const Wigglegram = () => {
    return (<video autoPlay loop muted>
                <source src={video} type="video/mp4"/>
            </video>);
}

export default Wigglegram;
