import React, { Component } from 'react';
import './Colors.css'
import { colorToString, invertColor } from './util.js';


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
        context.fillStyle = colorToString(this.props.colors[0], this.props.colors[1], this.props.colors[2]);
        //context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        context.beginPath();
        context.strokeStyle = invertColor(this.props.colors[0], this.props.colors[1], this.props.colors[2]);
        console.log(context.strokeStyle)
        //context.strokeStyle = 'black';
        context.lineWidth = 10;
        for(let i=0; i < this.props.cities.length; i+=2) {
            context.lineTo(Math.floor(width * this.props.cities[i] / this.props.squareSampling), Math.floor(height * this.props.cities[i + 1] / this.props.squareSampling))    
        }
        context.stroke();
    }

    render() {
        return <canvas width={this.props.width + "px"} height={this.props.height + "px"} className="Colors" ref={this.canvasRef}></canvas>
    }

}