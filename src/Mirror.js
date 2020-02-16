import React, { useRef, useState, useEffect } from 'react';
import { useRequestAnimationFrame } from './Hooks.js';

import * as THREE from 'three-full';
import { useInterval } from './Hooks.js';

import betty from './assets/betty.mp4'



const Mirror = (props) => {

    let canvas = useRef();
    let video = useRef();


    useEffect(() => {

        let AMOUNT = 5;
        let ASPECT_RATIO = window.innerWidth / window.innerHeight;

        let WIDTH = ( window.innerWidth / AMOUNT ) * window.devicePixelRatio;
        let HEIGHT = ( window.innerHeight / AMOUNT ) * window.devicePixelRatio;

        let cameras = [];

        for ( let y = 0; y < AMOUNT; y ++ ) {

            for ( let x = 0; x < AMOUNT; x ++ ) {

                let subcamera = new THREE.PerspectiveCamera( 130, window.innerWidth / window.innerHeight, 1, 100 );
                subcamera.viewport = new THREE.Vector4( Math.floor( x * WIDTH ), Math.floor( y * HEIGHT ), Math.ceil( WIDTH ), Math.ceil( HEIGHT ) );
                subcamera.position.x = 0;
                subcamera.position.y = 0;
                subcamera.position.z = 1;
                subcamera.lookAt( 0, 0, 0 );
                subcamera.updateMatrixWorld();
                cameras.push( subcamera );

            }

        }

        let camera = new THREE.ArrayCamera( cameras );
        camera.position.z = 1;
        
        

        const scene = new THREE.Scene();

        let texture = new THREE.VideoTexture( video.current );

        texture.minFilter = THREE.LinearFilter;

        video.current.play();


        const geometry = new THREE.PlaneGeometry(8, 6, 0),
             material = new THREE.MeshBasicMaterial({map: texture});

        const mesh = new THREE.Mesh(geometry, material);

        mesh.material.depthTest = false;
        mesh.material.depthWrite = false;


        scene.add(mesh);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas.current, antialias: true });

        renderer.setClearColor( 0xffffff, 1);

        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
            
    
        const animate = () => {

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        }
    
        let frameId = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(frameId);
            frameId = null;
            scene.remove(mesh);
            geometry.dispose();
            material.dispose();
        }  
        

    }, []);

    return (
        <>
        <video style={{"display":"none"}} ref={video} autoPlay loop muted>
            <source src={betty} type="video/mp4" />
        </video>
        <canvas ref={canvas} width="480" height="360"></canvas>
        </>
        );
}

export default Mirror;