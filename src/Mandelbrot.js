import React, { useEffect, useState, useRef } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Mandelbrot.css';

import { useTimeout } from './Hooks.js';
import Loader from './Presentation.js';
import _ from 'lodash';

const position = [53.78905976160202, 44.45646138397791];
const minZoom = 3;
const maxZoom = 42;
const containerHeight = 4000;

const Mandelbrot = (props) => {
    const verticalContainerRef = useRef(null);
    const mapRef = useRef(null);
    let [presenting, setPresenting] = useState(true);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        if (!presenting) {
            
            const zoomIn = (lat, lon, zoom) => {
                mapRef.current.leafletElement.setView([lat, lon], zoom);
            }

            const throttleZoomIn = _.throttle(zoomIn, 100);

            const setOffsetHander = () => {
                const offsetTop = verticalContainerRef.current.offsetTop;
                let height = (containerHeight - verticalContainerRef.current.clientHeight);
                let zoom = minZoom + Math.floor((maxZoom - minZoom) * offsetTop / height);
                throttleZoomIn(position[0], position[1], zoom);
            }
    
            window.addEventListener("scroll", setOffsetHander);
            return () => { 
                window.removeEventListener("scroll", setOffsetHander);
            }
        }
    }, [presenting]);

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
            <div className="Mandelbrot" style={{ height: containerHeight + "px" }}>
                <div className="Masonry-sticky" ref={verticalContainerRef}>
                    <Map className="Mandelbrot-map" 
                            ref={mapRef}
                            style={style}
                            center={position} 
                            zoom={3}
                            minZoom={3}
                            maxZoom={42}
                            scrollWheelZoom={false}
                            doubleClickZoom={false}
                            touchZoom={false}
                            dragging={false}
                            onZoomend={onZoomEndHandler}>
                        <TileLayer
                          url={props.host}
                        />
                    </Map>
                </div>
            </div>
        );
    }
}

export default Mandelbrot;
