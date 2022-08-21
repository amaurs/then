import React, { useRef, useState, useEffect, useContext } from "react";
import * as THREE from "three";
import { useTimeout } from "../../Hooks.js";
import Loader from "../../Presentation.js";
import { ThemeContext } from "../../ThemeContext.js";
import { PenroseBufferGeometry } from "../../util/three/PenroseBufferGeometry";
import "./Penrose.css";

interface Props {
    title: string;
    delay: number;
    style: object;
    width: number;
    height: number;
    url: string;
}

const Penrose = (props: Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const [presenting, setPresenting] = useState(props.delay > 0);
    const [data, setData] = useState({ points: [], hasFetched: true });
    const theme = useContext(ThemeContext);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        if (
            props.width > 0 &&
            props.height > 0 &&
            !presenting
        ) {
            let width, height;
            if (props.width < props.height ) {
                width = props.width;
                height = props.width;
            } else {
                width = props.height;
                height = props.height;
            }
            
            const material = new THREE.MeshPhongMaterial({
                vertexColors: true,
                side: THREE.DoubleSide,
            });

            
            let geometries:Array<PenroseBufferGeometry> = [4, 5, 6,7].map((i) => {
                return new PenroseBufferGeometry(200, i);
            });

            const scene = new THREE.Scene();

            
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(0, 0, -10);
            scene.add(light);
            

            const camera = new THREE.PerspectiveCamera(
                70,
                width / height,
                1,
                1000
            );
            camera.position.z = 100;

            let objects = geometries.map((geometry, i) => {
                let mesh = new THREE.Mesh( geometry, material );
                if (i > 0) {
                    mesh.visible = false;
                }
                scene.add(mesh);
                return mesh;
            });
            

            let renderer = new THREE.WebGLRenderer({
                canvas: canvas.current,
                antialias: true
            });

            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( width, height );
            renderer.setClearColor(0xffffff, 0.0);

            const renderScene = () => {
                renderer.render(scene, camera);
            };

            let timeoutId: any;
            let i: number = 0;

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                
                
                timeoutId = setTimeout(function () {
                    
                    objects.forEach((object, index) => {
                        object.visible = index == (Math.floor(i / 24)) % objects.length;
                        object.rotation.z -= 0.01;
                    });
                    renderScene();
                    frameId = requestAnimationFrame(animate);
                    i++;
                }, 1000 / 40);
            };

            let frameId: number | null = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId!);
                frameId = null;
                clearTimeout(timeoutId);
                objects.forEach((mesh) => { scene.remove(mesh)});
                geometries.forEach((geometry) => { geometry.dispose()});
                material.dispose();
            };
        }
    }, [data, props.width, props.height, presenting, theme]);
    
    if (presenting) {
        return <Loader title={props.title} />;
    } else {
        return (
            <canvas
                className="Penrose"
                style={ props.style }
                ref={ canvas }
            />
        );
    }
};

export default Penrose;
