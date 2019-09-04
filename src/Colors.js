import React, { Component } from 'react';
import './Colors.css'


export default class Colors extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidUpdate() {
        const color = this.props.cities;
        console.log(color);
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        context.save();
        context.clearRect(0, 0, width, height);
        context.fillStyle = "rgb(" + this.props.cities[0] + ", " + this.props.cities[1] + ", " + this.props.cities[2] + ")";
        context.fillRect(0, 0, width, height);
    }

    render() {
        
        let rgb = "rgb(" + this.props.cities[0] + ", " + this.props.cities[1] + ", " + this.props.cities[2] + ")";
        
        return <canvas className="Colors" ref={this.canvasRef}></canvas>
    }

}