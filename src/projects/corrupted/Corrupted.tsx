import React, { useRef, useEffect, useState, useContext } from "react";
import * as THREE from "three-full";
import "./Corrupted.css";
import escudo from "../../assets/escudo.png";
import { useTimeout } from "../../Hooks.js";
import Loader from "../../Presentation.js";


import { ThemeContext } from "../../ThemeContext.js";
import CSS from "csstype";


let vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
let fragmentShader = `
uniform bool invert;
uniform bool konami;
uniform vec3 color;
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
    vec4 texel = texture2D( tDiffuse, vUv );
    if (konami) {
        float grey = (0.21 * texel.r + 0.71 * texel.g + 0.07 * texel.b);
        if (invert) {
            gl_FragColor =  1.0 - vec4(color.r - grey, color.g - grey, color.b - grey, texel.a);
        } else {
            gl_FragColor = vec4(color.r - grey, color.g - grey, color.b - grey, texel.a);
        }
    } else {
        if (invert) {
            gl_FragColor = 1.0 - vec4(texel.r, texel.g, texel.b, texel.a);
        } else {
            gl_FragColor = vec4(texel.r, texel.g, texel.b, texel.a);
        }
    }
}
`;


interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}

interface Shader {
    uniforms: object;
    vertexShader: string;
    fragmentShader: string;
}


const Corrupted = (props: Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const [presenting, setPresenting] = useState(props.delay > 0);
    const theme = useContext(ThemeContext);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        if (!presenting) {
            const camera = new THREE.PerspectiveCamera(
                70,
                props.width / props.height,
                1,
                1000
            );
            camera.position.z = 1.5;
            const scene = new THREE.Scene();
            const texture = new THREE.TextureLoader().load(escudo);
            const geometry = new THREE.PlaneGeometry(2, 2, 0),
                material = new THREE.MeshBasicMaterial({ map: texture });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.material.depthTest = false;
            mesh.material.depthWrite = false;
            scene.add(mesh);
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas.current,
                antialias: true,
            });
            renderer.setClearColor(0xffffff, 1);

            //renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize(props.width, props.height);

            const composer = new THREE.EffectComposer(renderer);
            composer.addPass(new THREE.RenderPass(scene, camera));

            let g = new THREE.GlitchPass();

            g.goWild = false

            composer.addPass(g);

            const customShader: Shader = {
                uniforms: {
                    "tDiffuse": { value: null }, 
                    "invert": { value: theme.theme.name !== 'light' }, 
                    "konami": { value: theme.theme.name === 'konami' },
                    "color": { value: new THREE.Color(0.0, 1.0, 0.0)}
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
            }

            const magentaShader = new THREE.ShaderPass(customShader);

            composer.addPass(magentaShader);

            let copyPass = new THREE.ShaderPass(THREE.CopyShader);
            copyPass.renderToScreen = true;
            composer.addPass(copyPass);

            const animate = () => {
                requestAnimationFrame(animate);
                composer.render();
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
    }, [props.width, props.height, presenting, theme]);

    let style = {};

    if (presenting) {
        return <Loader title={props.title} />;
    } else {
        return (
            <canvas
                className="Corrupted"
                style={{ ...props.style, ...style }}
                ref={canvas}
            />
        );
    }
};

export default Corrupted;
