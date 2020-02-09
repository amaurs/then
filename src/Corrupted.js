import React, { useRef, useState, useEffect } from 'react';
import { useRequestAnimationFrame } from './Hooks.js';
import * as THREE from 'three-full';

import escudo from './assets/escudo.jpg';


const Corrupted = () => {


    let canvas = useRef();
    
    useEffect(() => {
        
        const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 3;

        const scene = new THREE.Scene();

        const texture = new THREE.TextureLoader().load(escudo);



        const geometry = new THREE.PlaneGeometry(2, 2, 0),
             material = new THREE.MeshBasicMaterial({map: texture});

        const mesh = new THREE.Mesh(geometry, material);

        mesh.material.depthTest = false;
        mesh.material.depthWrite = false;


        scene.add(mesh);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas.current, antialias: true });
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );


        const composer = new THREE.EffectComposer( renderer );
        composer.addPass( new THREE.RenderPass( scene, camera ) );

        const glitchPass = new THREE.GlitchPass();
        composer.addPass( glitchPass );

        

        const animate = () => {
            requestAnimationFrame( animate );

            renderer.render( scene, camera );
        }


        let frameId = requestAnimationFrame(animate);
        
        return () => {
            cancelAnimationFrame(frameId);
            frameId = null;
            scene.remove(mesh);
            geometry.dispose();
            material.dispose();
            mesh.dispose();
        }

    }, []);

    return (
        <canvas
            className="Corrupted"
            ref={canvas}
            width={800}
            height={400}
        />
    );
}

export default Corrupted;
/*

import React from 'react';
import corrupted from './assets/escudo.m4v';
import './Corrupted.css'

const Corrupted = () => {
    return (<video autoPlay loop muted>
                <source src={corrupted} type="video/mp4"/>
            </video>);
}

export default Corrupted;

*/