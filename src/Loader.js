import React, { useRef, useState, useEffect } from 'react';
import { useRequestAnimationFrame } from './Hooks.js';

import * as THREE from 'three-full';
import Board from './Board.js';

import './Loader.css'


class AutostereogramEffect {

    constructor(renderer) {
        this.renderer = renderer;
    }

    setSize( width, height ) {
        this.renderer.setSize( width, height );

    }

    render(scene, camera) {
        this.renderer.render(scene, camera);

        const _canvas = this.renderer.domElement;

        let oCanvas = document.createElement( "canvas" );
        let oCtx = oCanvas.getContext( "2d" );
        
        let size = this.renderer.getSize();

        oCtx.clearRect( 0, 0, size.width, size.height );
        oCtx.drawImage( _canvas, 0, 0, size.width, size.height );

        let frame = oCtx.getImageData( 0, 0, size.width, size.height );


        let board = new Board(100, size.height);
        board.init();

        board.randomize();

        for(let y = 0; y < frame.height; y++) {
            for(let x = 0; x < frame.width; x++) {
                let index = (y * frame.width + x) * 4;
                if (!(x < 100)) {
                    let average = ((frame.data[index + 0] + 
                                               frame.data[index + 1] + 
                                               frame.data[index + 2]) / 3) / 255;
                    let offset = Math.floor(average * (32 - 1));
                    
                    
                    if (offset > 0) {
                        let value = board.getXY((x % 100) + offset, y);
                        board.setXY((x % 100), y, value);
                    }   
                }
                if (board.getXY((x % 100), y)) {
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
        oCtx.putImageData(frame, 0, 0);

        debugger

    }
}


const Loader = () => {

    let canvas = useRef();

     let canvas2 = useRef();

    

    

    
    

    useEffect(() => {

        let width = canvas.current.clientWidth;
        let height = canvas.current.clientHeight;
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

        //const effect = new AutostereogramEffect( renderer );
        renderer.setSize(width, height);

        const renderScene = () => {
            //effect.render(scene, camera)

            renderer.render(scene, camera);

            const _canvas = renderer.domElement;

            let oCanvas = canvas2.current;
            let oCtx = oCanvas.getContext( "2d" );
            
            let size = renderer.getSize();
    
            oCtx.clearRect( 0, 0, size.width, size.height );
            oCtx.drawImage( _canvas, 0, 0, size.width, size.height );
    
            let frame = oCtx.getImageData( 0, 0, size.width, size.height );
    
    
            let board = new Board(100, size.height);
            board.init();
    
            board.randomize();
    
            for(let y = 0; y < frame.height; y++) {
                for(let x = 0; x < frame.width; x++) {
                    let index = (y * frame.width + x) * 4;
                    if (!(x < 100)) {
                        let average = ((frame.data[index + 0] + 
                                                   frame.data[index + 1] + 
                                                   frame.data[index + 2]) / 3) / 255;
                        let offset = Math.floor(average * (32 - 1));
                        
                        
                        if (offset > 0) {
                            let value = board.getXY((x % 100) + offset, y);
                            board.setXY((x % 100), y, value);
                        }   
                    }
                    if (board.getXY((x % 100), y)) {
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
        oCtx.putImageData(frame, 0, 0);


        }
        console.log("Just called once.");
        const animate = () => {
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
          renderScene();
          frameId = requestAnimationFrame(animate);
        }

        let frameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(frameId)
            frameId = null
            canvas.current.removeChild(renderer.domElement)
            scene.remove(cube)
            geometry.dispose()
            material.dispose()
        }

    }, []);



    return (
        <>
        <canvas
            className="vis"
            ref={canvas}
            width={800}
                height={400}
        />

        <canvas
            className="vis"
            ref={canvas2}
            width={800}
                height={400}
        />
        </>
    );
}

export default Loader;