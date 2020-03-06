import React, { useRef, useEffect } from 'react';
import * as THREE from 'three-full';

import escudo from './assets/escudo.png';


const Corrupted = (props) => {


    let canvas = useRef();
    
    useEffect(() => {
        
        const camera = new THREE.PerspectiveCamera( 70, props.width / props.height, 1, 1000 );
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

        //renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( props.width, props.height );


        const composer = new THREE.EffectComposer( renderer );
        composer.addPass( new THREE.RenderPass( scene, camera ) );

        
        let g = new THREE.GlitchPass() 

        //g.goWild = true

        composer.addPass( g);


        let copyPass = new THREE.ShaderPass( THREE.CopyShader );
        copyPass.renderToScreen = true;


        composer.addPass( copyPass );


        const  onWindowResize = () => {
    
            camera.aspect = props.width / props.height;
            camera.updateProjectionMatrix();
    
            renderer.setSize( props.width, props.height );
            composer.setSize( props.width, props.height );
    
    
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

    }, [props.width, props.height]);



    return (
        <canvas
            className="Corrupted"
            ref={canvas}
        />
    );
}

export default Corrupted;
