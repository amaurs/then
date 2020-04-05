import React, { useState } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Mandelbrot.css';

import { useTimeout } from './Hooks.js';
import Loader from './Presentation.js';

const position = [53.78905976160202, 44.45646138397791];

const Mandelbrot = (props) => {

    let [presenting, setPresenting] = useState(true);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    const onZoomEndHandler = (event) => {
        event.target.panTo({lat: position[0], lng: position[1]});
    }

    let style = {height: Math.min(props.width, props.height) + "px", width: Math.min(props.width, props.height) + "px"};

    if (props.width === 0 && props.height === 0) {
        return null;
    }

    if (presenting) {
        return <Loader title={props.title}/>
    } else {
        return (
            <Map className="Mandelbrot" 
                    style={style}
                    center={position} 
                    zoom={3}
                    minZoom={3}
                    maxZoom={42}
                    scrollWheelZoom="center"
                    doubleClickZoom="center"
                    touchZoom="center"
                    dragging={false}
                    onZoomend={onZoomEndHandler}>
                <TileLayer
                  url={props.host}
                />
            </Map>
        );
    }
}

export default Mandelbrot;
