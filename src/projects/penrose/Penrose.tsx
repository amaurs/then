import React, { useRef, useState, useEffect, useContext } from "react";
import * as THREE from "three";
import { useTimeout } from "../../Hooks.js";
import Loader from "../../Presentation.js";
import { ThemeContext } from "../../ThemeContext.js";
import { PenroseBufferGeometry } from "../../util/three/PenroseBufferGeometry";

interface Props {
    title: string;
    delay: number;
    style: object;
    width: number;
    height: number;
    url: string;
}

const Penrose = (props: Props) => {
    let div = useRef<HTMLDivElement>(document.createElement("div"));
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

            const width = props.width;
            const height = props.height;
            const material = new THREE.MeshPhongMaterial({
                vertexColors: true,
                side: THREE.DoubleSide,
            });

            const geometry = new PenroseBufferGeometry( 200, 3);
            const scene = new THREE.Scene();

            
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(0, 0, 10);
            scene.add(light);
            

            const camera = new THREE.PerspectiveCamera(
                70,
                width / height,
                1,
                1000
            );
            camera.position.z = 400;


            let mesh = new THREE.Mesh( geometry, material );
            scene.add( mesh );

            let renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( width, height );
            renderer.setClearColor(0xffffff, 0.0);
            if (div.current.childNodes.length > 0) {
                div.current.removeChild(div.current.childNodes[0]);
            }
            div.current.appendChild(renderer.domElement);

            const renderScene = () => {
                renderer.render(scene, camera);
            };

            let timeoutId: any;

            const animate = () => {
                timeoutId = setTimeout(function () {
                    //mesh.rotation.x += 0.01;
                    //mesh.rotation.y += 0.01;
                    renderScene();
                    frameId = requestAnimationFrame(animate);
                }, 1000 / 60);
            };

            let frameId: number | null = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId!);
                frameId = null;
                clearTimeout(timeoutId);
                scene.remove(mesh);
                geometry.dispose();
                material.dispose();
            };
        }
    }, [data, props.width, props.height, presenting, theme]);

    let style = {};

    if (presenting) {
        return <Loader title={props.title} />;
    } else {
        return (
            <div
                className="Penrose"
                style={{ ...props.style, ...style }}
                ref={div}
            ></div>
        );
    }
};

export default Penrose;
