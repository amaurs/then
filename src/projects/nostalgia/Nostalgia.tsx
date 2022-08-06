import React, { useRef, useEffect, useState, useContext } from "react";
import * as THREE from "three";
import { CopyShader } from "three/examples/js/shaders/CopyShader.js";
import { DotScreenPass } from "three/examples/js/postprocessing/DotScreenPass.js";
import { EffectComposer } from "three/examples/js/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/js/postprocessing/ShaderPass.js";
import { TexturePass } from "three/examples/js/postprocessing/TexturePass.js";
import "./Nostalgia.css";
import boxer from '../../assets/boxer.jpg';
import { useTimeout } from "../../Hooks.js";
import Loader from "../../Presentation.js";

import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

import { ThemeContext } from "../../ThemeContext.js";
import CSS from "csstype";

import { colorMatrixShader, ditherShader, maskShader, Prediction } from "../../shaders"
import { GlitchPass } from  "../../util/three/ShaderPass.js";


interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}

const Nostalgia = (props: Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const [presenting, setPresenting] = useState(true);
    const [predictions, setPredictions] = useState<Array<Prediction>>([]);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const theme = useContext(ThemeContext);

    useTimeout(() => {
        console.log("nothing")
    }, props.delay);

    useEffect(() => {
        let cancel = false;

        const getData = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = (event: Event) => {
                    let image = event.currentTarget as HTMLImageElement;

                    resolve(image)
                }
                img.onerror = reject
                img.src = src
            });
        }
        const loadModel = (): Promise<any> => {
            return new Promise((resolve, reject) => {
                tf.setBackend('cpu');
                const model = blazeface.load();
                resolve(model)
            });
        }

        Promise.all([loadModel(), getData(boxer)]).then(function(results: Array<any>) {
            if (!cancel) {
                 return new Promise((resolve, reject) => {
                     setWidth(results[1].width);
                     setHeight(results[1].height);
                     resolve(results[0].estimateFaces(results[1], false));
                 }); 
            }
        }).then(function(predictions: any) {
            setPresenting(false);
            setPredictions(predictions)
        });

    }, []);


    useEffect(() => {
        if (!presenting && predictions.length > 0) {
            let cancel = false;
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas.current
            });
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setClearColor( 0x000000 );

            let aspectRatioImage = height / width;
            let aspectRatioFrame = props.height / props.width;
            let isVertical = aspectRatioFrame > 1;
            let style;

            const parameters = {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBFormat,
                    stencilBuffer: true
                };

            let renderTarget;

            if (isVertical) {
                renderer.setSize(props.width, props.width * aspectRatioImage);
                renderTarget = new THREE.WebGLRenderTarget(props.width, props.width * aspectRatioImage, parameters);
            } else {
                renderer.setSize(props.height / aspectRatioImage, props.height);
                renderTarget = new THREE.WebGLRenderTarget(props.height / aspectRatioImage, props.height, parameters);
            }
            

            const magentaPass = new ShaderPass(colorMatrixShader(theme.theme.colorMatrix));
            const myMaskPass = new GlitchPass(32, props.width, props.height, width, height, predictions);
            myMaskPass.goWild = false; 

            const texture = new THREE.TextureLoader().load(boxer);
            texture.minFilter = THREE.LinearFilter;
            const texturePass = new TexturePass(texture);
            
            const dotScreenPass = new DotScreenPass(new THREE.Vector2( 0.5, 0.5 ), 1.57, 0.8);
            const copyPass = new ShaderPass(CopyShader);
            copyPass.renderToScreen = true;
            const composer = new EffectComposer(renderer, renderTarget);

            composer.addPass(texturePass);  
            composer.addPass(dotScreenPass);
            composer.addPass(myMaskPass);
            composer.addPass(magentaPass);
            composer.addPass(copyPass);

            const animate = () => {
                requestAnimationFrame(animate);
                composer.render();
            };

            let frameId: number | null = requestAnimationFrame(animate);

            return () => {
                cancelAnimationFrame(frameId!);
                frameId = null;          
            };
        }
    }, [props.width, props.height, presenting, theme, predictions, width, height]);


    if (presenting) {
        return <Loader title={props.title} />;
    } else {
        return (
            <canvas
                className="Nostalgia"
                ref={canvas}
                style={{...props.style}}
            />
        );
    }
};

export default Nostalgia;
