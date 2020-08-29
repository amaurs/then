import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three-full';
import Board from './Board.js';

import './Autostereogram.css';

import { useTimeout } from './Hooks.js';

import Loader from './Presentation.js';

const AUTOSTEREOGRAM_STRIPS = 8

const Autostereogram = (props) => {
    let autostereogramCanvas = useRef();
    let [show, setShow] = useState(true);
    const [presenting, setPresenting] = useState(props.delay>0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    const handleToggle = (e) => {
        setShow(!show);
    }

    useEffect(() => {
        if (props.width > 0 && props.height > 0 && !presenting) {
            let canvas = document.createElement( "canvas" );
            let width = autostereogramCanvas.current.clientWidth;
            let height = autostereogramCanvas.current.clientHeight;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: canvas.current, antialias: true });
            const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
            const material = new THREE.MeshDepthMaterial({wireframe: false});
            const cube = new THREE.Mesh(geometry, material);
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            camera.position.z = 4;
            scene.add(cube);
            renderer.setClearColor('#000000');
            renderer.setSize(width, height);
    
            const renderScene = () => {
                renderer.render(scene, camera);
                const virtualCanvas = renderer.domElement;
                let realCanvas = autostereogramCanvas.current;
                let realContext = realCanvas.getContext("2d");
                realContext.clearRect(0, 0, width, height);
                realContext.drawImage(virtualCanvas, 0, 0, width, height);
                if (show) {
                    let frame = realContext.getImageData(0, 0, width, height);
    
                    let strip_width = parseInt(width / AUTOSTEREOGRAM_STRIPS);
                    
                    let board = new Board(strip_width, height);
                    board.init();    
                    board.randomize();
            
                    for (let y = 0; y < frame.height; y++) {
                        for (let x = 0; x < frame.width; x++) {
                            let index = (y * frame.width + x) * 4;
                            if (!(x < strip_width)) {
                                let average = ((frame.data[index + 0] + 
                                                frame.data[index + 1] + 
                                                frame.data[index + 2]) / 3) / 255;
                                let offset = Math.floor(average * (64 - 1));
                                if (offset > 0) {
                                    board.setXY((x % strip_width), y, board.getXY((x % strip_width) + offset, y));
                                }
                            }
                            if (board.getXY((x % strip_width), y)) {
                                frame.data[index + 0] = 0; 
                                frame.data[index + 1] = 0; 
                                frame.data[index + 2] = 0;
                            } else {
                                frame.data[index + 0] = 255; 
                                frame.data[index + 1] = 255; 
                                frame.data[index + 2] = 255;
                            }
                        }
                    }
                    realContext.putImageData(frame, 0, 0);
                }
            }
    
            const animate = () => {
                cube.rotation.x += 0.04;
                cube.rotation.y += 0.04;
                renderScene();
                frameId = requestAnimationFrame(animate);
            }
    
            let frameId = requestAnimationFrame(animate);
            
            return () => {
                cancelAnimationFrame(frameId);
                frameId = null;
                scene.remove(cube);
                geometry.dispose();
                material.dispose();
            }
        }
    }, [show, props.width, props.height, presenting]);

    if (presenting) {
        return <Loader title={props.title}/>;
    } else {
        return (
            <canvas
                className="Autostereogram"
                ref={autostereogramCanvas}
                width={props.width}
                height={props.width / 2}
                onClick={handleToggle}
            />
        );
    }
}

export default Autostereogram;
