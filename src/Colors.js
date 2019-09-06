import React, { Component } from 'react';
import './Colors.css'

function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    let r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    let zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function toHex(r,g,b) {   
  let red = rgbToHex(r);
  let green = rgbToHex(g);
  let blue = rgbToHex(b);
  return red+green+blue;
}   

function rgbToHex(rgb) { 
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
}

export default class Colors extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidUpdate() {
        const color = this.props.colors;
        console.log(color);
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        context.save();
        context.clearRect(0, 0, width, height);
        context.fillStyle = "rgb(" + this.props.colors[0] + ", " + this.props.colors[1] + ", " + this.props.colors[2] + ")";
        context.fillRect(0, 0, width, height);

        context.beginPath();

        context.strokeStyle = invertColor(toHex(this.props.colors[0], this.props.colors[1], this.props.colors[2]));
        context.lineWidth = 10;
        for(let i=0; i < this.props.cities.length; i+=2) {
            context.lineTo(Math.floor(width * this.props.cities[i] / this.props.squareSampling), Math.floor(height * this.props.cities[i + 1] / this.props.squareSampling))    
        }
        context.stroke();
    }

    render() {
        
        let rgb = "rgb(" + this.props.colors[0] + ", " + this.props.colors[1] + ", " + this.props.colors[2] + ")";
        
        return <canvas width={this.props.width + "px"} height={this.props.height + "px"} className="Colors" ref={this.canvasRef}></canvas>
    }

}