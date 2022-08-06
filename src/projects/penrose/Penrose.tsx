import React, { useRef, useEffect, useState, useContext } from "react";

import Loader from '../../Presentation.js';
import * as THREE from "three";
import { CopyShader } from "three/examples/js/shaders/CopyShader.js";
import { FaceColors } from "three/examples/jsm/deprecated/Geometry.js";
import { EffectComposer } from "three/examples/js/postprocessing/EffectComposer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/js/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/js/postprocessing/ShaderPass.js";
import { ThemeContext } from '../../ThemeContext.js';


import escudo from "../../assets/escudo.png";
import Vector from '../../util/vector';

import Triangle from "../../util/triangle";

import { BTileL, BTileS } from "../../util/bTiles";
import PenroseGeometry from "../../util/three/PenroseGeometry";

import { colorMatrixShader } from "../../shaders"


import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}

async function postData(url: string, payload: object) {
    console.log("calling async");
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload) // body data type must match "Content-Type" header
    });
    return response.json(); 
}

const n = 5;


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
            const material = new THREE.MeshBasicMaterial({vertexColors: FaceColors, side: THREE.DoubleSide});
            
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas.current,
                antialias: true,
            });
            renderer.setClearColor(0xffffff, 1.0);
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize(props.width, props.height);

            let geometries:Array<PenroseGeometry> = [];


            let objects:Array<PenroseGeometry> = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                let  geometry = new PenroseGeometry(1, i);
                //let  geometry = new THREE.BoxGeometry(i,i,i);
                geometries.push(geometry)
                geometry.faces.forEach((face: any, ndx: any) => {
                    let color = new THREE.Color( 0xffffff );
                    color.setHex(Math.random() * 0xffffff);
                    face.color = color;
                });
                let mesh = new THREE.Mesh(geometry, material);

                return mesh;
            });

            
            objects.forEach((object) => {
                object.visible = false;
                scene.add(object);
            });
            
            

            const orbit = new OrbitControls( camera, renderer.domElement );
            orbit.enableZoom = false;

            
            let timeoutId: any;

            let i = 0;

            const composer = new EffectComposer(renderer);
            const renderPass = new RenderPass(scene, camera);
            const magentaPass = new ShaderPass(colorMatrixShader(theme.theme.colorMatrix));
            const copyPass = new ShaderPass(CopyShader);
            
            copyPass.renderToScreen = true;
            composer.addPass(renderPass);
            composer.addPass(magentaPass);
            composer.addPass(copyPass);
            
            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                
                timeoutId = setTimeout(function () {
                    objects.forEach((object, index) => {
                        object.visible = index == (Math.floor(i / 24)) % 7;
                    });
                    composer.render();
                    frameId = requestAnimationFrame(animate);
                    i++;
                }, 0);
            };

            let frameId: number | null = requestAnimationFrame(animate);

            return () => {
                cancelAnimationFrame(frameId!);
                frameId = null;
                objects.forEach((object, index) => {
                    scene.remove(object);
                });

                geometries.forEach((geometry, index) => {
                    geometry.dispose();
                });
                
                material.dispose();
            };
        }

    }, [presenting, theme]);

    let style = {height: 1080, width: 1080};


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