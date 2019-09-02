import React, { Component } from 'react';
import { render } from 'react-dom'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Mandelbrot.css'

const position = [53.78905976160202, 44.45646138397791]

export default class Mandelbrot extends Component {

    constructor(props) {
        super(props);
        console.log("%c"+this.props.host, "color:green")
    }

    onZoomEndHandler(event) {
        console.log(event)
        event.target.panTo({lat: 53.78905976160212, lng: 44.456461383977825});
    }

    render() {
        return <Map className="map-container" 
                    center={position} 
                    zoom={3}
                    minZoom={4}
                    maxZoom={42}
                    scrollWheelZoom="center"
                    doubleClickZoom="center"
                    touchZoom="center"
                    dragging={false}
                    onZoomend={(e) => this.onZoomEndHandler(e)}>
                 <TileLayer
                   url={this.props.host}
                 />
                 <Marker position={position}>
                   <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
                 </Marker>
               </Map>
    }

}