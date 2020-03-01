import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Mandelbrot.css'

const position = [53.78905976160202, 44.45646138397791];

const Mandelbrot = (props) => {
    const onZoomEndHandler = (event) => {
        event.target.panTo({lat: position[0], lng: position[1]});
    }

    let style = {height: Math.min(props.width, props.height) + "px", width: Math.min(props.width, props.height) + "px"};

    if (props.width === 0 && props.height === 0) {
        return null;
    }

    return <div style={style}>
               <Map className="Mandelbrot" 
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
           </div>;
}

export default Mandelbrot;
