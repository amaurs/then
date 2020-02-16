import React, { useRef, useState, useEffect } from 'react';
import { useRequestAnimationFrame } from './Hooks.js';
import * as THREE from 'three-full';

import escudo from './assets/escudo.png';


const Corrupted = () => {


    let canvas = useRef();
    
    useEffect(() => {
        
        const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 1.5;

        const scene = new THREE.Scene();

        const texture = new THREE.TextureLoader().load(escudo);



        const geometry = new THREE.PlaneGeometry(2, 2, 0),
             material = new THREE.MeshBasicMaterial({map: texture});

        const mesh = new THREE.Mesh(geometry, material);

        mesh.material.depthTest = false;
        mesh.material.depthWrite = false;


        scene.add(mesh);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas.current, antialias: true });

        renderer.setClearColor( 0xffffff, 1);

        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );


        const composer = new THREE.EffectComposer( renderer );
        composer.addPass( new THREE.RenderPass( scene, camera ) );

        
        let g = new THREE.GlitchPass() 

        //g.goWild = true

        composer.addPass( g);


        let copyPass = new THREE.ShaderPass( THREE.CopyShader );
        copyPass.renderToScreen = true;


        composer.addPass( copyPass );


        const  onWindowResize = () => {
    
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
    
            renderer.setSize( window.innerWidth, window.innerHeight );
            composer.setSize( window.innerWidth, window.innerHeight );
    
    
        }

        

        const animate = () => {
            requestAnimationFrame( animate );

            //renderer.render( scene, camera );
            composer.render();
        }

        window.addEventListener( 'resize', onWindowResize, false );


        let frameId = requestAnimationFrame(animate);
        
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", onWindowResize, false);
            frameId = null;
            scene.remove(mesh);
            geometry.dispose();
            material.dispose();
        }

    }, []);



    return (
        <canvas
            className="Corrupted"
            ref={canvas}
        />
    );
}

export default Corrupted;
