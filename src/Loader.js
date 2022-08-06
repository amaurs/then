import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/js/effect/AsciiEffect.js';
import './Loader.css'

const Loader = () => {
    let theCanvas = useRef();
    useEffect(() => {
        let width = 800;
        let height = 450;
        let canvas = document.createElement( "canvas" );
           const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas.current, antialias: true });
        //const geometry = new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3, 1);
        const geometry = new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3, 1);
        const material = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geometry, material);
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        camera.position.z = 10;
        scene.add(cube);

        //let effect = new THREE.AsciiEffect( renderer, ' .:-+*=%@#', { invert: true } );
        let effect = new AsciiEffect( renderer, '>LOADING..', { invert: true } );
        
        effect.setSize( width, height );
        effect.domElement.style.color = 'black';
        effect.domElement.style.backgroundColor = 'white';
        theCanvas.current.appendChild( effect.domElement );

        const renderScene = () => {
            effect.render(scene, camera);
        }
        
        const animate = () => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
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
    }, []);

    return (
        <div
            className="Loader"
            ref={theCanvas}
            width={800}
            height={450}
        >
        </div>
    );
}

export default Loader;
