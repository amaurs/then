import React, { useState, useRef } from 'react';
import { useInterval } from './Hooks.js';

import betty from './assets/betty.mp4'


 const Mirror = () => {

    let video = useRef();
    let canvas = useRef();
    let [playing, setPlaying] = useState(false);

    let context;
            

    const handleOnPlay = (e) => {
        setPlaying(true);
        context = canvas.current.getContext('2d');
        context.translate(video.current.videoWidth, 0);
        context.scale(-1, 1);
    }

    useInterval(() => {
        if(playing) {
            context = canvas.current.getContext('2d');
            context.scale(-1, 1);
            context.drawImage(video.current, 0, 0, video.current.videoWidth, video.current.videoHeight);        
        }
        
    }, 0);
    
    return (
        <>
        <video style={{}} onPlay={handleOnPlay} ref={video} autoPlay loop muted>
            <source src={betty} type="video/mp4" />
        </video>
        <canvas ref={canvas} width="480" height="360"></canvas>
        </>
        )

}

export default Mirror;