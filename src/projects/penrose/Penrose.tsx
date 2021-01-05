import React, { useRef, useEffect, useState, useContext } from "react";

import Loader from '../../Presentation.js';
import * as THREE from "three-full";
import { ThemeContext } from '../../ThemeContext.js';


import escudo from "../../assets/escudo.png";
import Vector from '../../util/vector';

import Triangle from "../../util/triangle";

import { BTileL, BTileS } from "../../util/bTiles";
import PenroseGeometry from "../../util/three/PenroseGeometry";


import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}


const Penrose = (props: Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const theme = useContext(ThemeContext);
    const [presenting, setPresenting] = useState(props.delay>0);

    useEffect(() => {
        if (!presenting) {
            const camera = new THREE.PerspectiveCamera(
                70,
                props.width / props.height,
                1,
                1500
            );
            camera.position.z = 2;
            const scene = new THREE.Scene();

            //let material = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.BackSide, flatShading: true } );
            const material = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors, side: THREE.DoubleSide});
            
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas.current,
                antialias: true,
            });
            renderer.setClearColor(0xffffff, 1.0);

            renderer.setPixelRatio( window.devicePixelRatio );
            
            renderer.setSize(props.width, props.height);

            const orbit = new THREE.OrbitControls( camera, renderer.domElement );
            orbit.enableZoom = false;

            
            let timeoutId: any;

            let i = 0;
            let  geometry = new PenroseGeometry(1, 0);
            let mesh = new THREE.Mesh(geometry, material);
            
            const animate = (time: number) => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.

                time *= 0.01;
                
                timeoutId = setTimeout(function () {
                    //const geometry = new PenroseGeometry(1, i % 7);

                    geometry = new PenroseGeometry(1, i % 9);
                    geometry.faces.forEach((face: any, ndx: any) => {
                        let color = new THREE.Color( 0xffffff );
                        color.setHex(Math.random() * 0xffffff);
                        face.color = color;
                    });

                    mesh = new THREE.Mesh(geometry, material);
                    scene.add(mesh);

                    renderer.render(scene, camera);
                    frameId = requestAnimationFrame(animate);

                    scene.remove(mesh);
                    geometry.dispose();

                    i++;
                }, 1000);
            };

            let frameId: number | null = requestAnimationFrame(animate);

            return () => {
                cancelAnimationFrame(frameId!);
                frameId = null;
                scene.remove(mesh);
                geometry.dispose();
                material.dispose();
            };
        }

    }, [presenting, theme]);

    let style = {};


    if (presenting) {
        return <Loader title={props.title} />;
    } else {
        return (
            <canvas
                className="Penrose"
                style={{ ...props.style, ...style }}
                ref={canvas}
            />
        );
    }
};

export default Penrose;