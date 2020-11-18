import React, { MouseEvent, useRef, useState, useEffect } from "react";
import * as THREE from "three-full";
import Board from "../../Board.js";

import "./Autostereogram.css";

import { useTimeout } from "../../Hooks.js";

import Loader from "../../Presentation.js";
import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}

const AUTOSTEREOGRAM_STRIPS: number = 8;

const Autostereogram = (props: Props) => {
    let autostereogramCanvas = useRef<HTMLCanvasElement>(
        document.createElement("canvas")
    );
    let [show, setShow] = useState(true);
    const [presenting, setPresenting] = useState(props.delay > 0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    const handleToggle = (event: MouseEvent) => {
        setShow(!show);
    };

    useEffect(() => {
        if (props.width > 0 && props.height > 0 && !presenting) {
            const canvas: HTMLCanvasElement = document.createElement("canvas");
            const width = autostereogramCanvas.current.clientWidth;
            const height = autostereogramCanvas.current.clientHeight;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                width / height,
                1,
                1000
            );
            const renderer = new THREE.WebGLRenderer({
                canvas: autostereogramCanvas.current,
                antialias: true,
            });
            const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
            const material = new THREE.MeshDepthMaterial({ wireframe: false });
            const cube = new THREE.Mesh(geometry, material);
            const needResize =
                canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            camera.position.z = 4;
            scene.add(cube);
            renderer.setClearColor("#000000");
            renderer.setSize(width, height);

            const renderScene = () => {
                renderer.render(scene, camera);
                const virtualCanvas = renderer.domElement;
                const realCanvas = autostereogramCanvas.current;
                const realContext: CanvasRenderingContext2D = realCanvas.getContext(
                    "2d"
                )!;
                realContext.clearRect(0, 0, width, height);
                realContext.drawImage(virtualCanvas, 0, 0, width, height);
                if (show) {
                    let frame = realContext.getImageData(0, 0, width, height);

                    let strip_width = Math.round(width / AUTOSTEREOGRAM_STRIPS);

                    let board = new Board(strip_width, height);
                    board.init();
                    board.randomize();

                    for (let y = 0; y < frame.height; y++) {
                        for (let x = 0; x < frame.width; x++) {
                            let index = (y * frame.width + x) * 4;
                            if (!(x < strip_width)) {
                                let average =
                                    (frame.data[index + 0] +
                                        frame.data[index + 1] +
                                        frame.data[index + 2]) /
                                    3 /
                                    255;
                                let offset = Math.floor(average * (64 - 1));
                                if (offset > 0) {
                                    board.setXY(
                                        x % strip_width,
                                        y,
                                        board.getXY(
                                            (x % strip_width) + offset,
                                            y
                                        )
                                    );
                                }
                            }
                            if (board.getXY(x % strip_width, y)) {
                                frame.data[index + 0] = 0;
                                frame.data[index + 1] = 0;
                                frame.data[index + 2] = 0;
                            } else {
                                frame.data[index + 0] = 255;
                                frame.data[index + 1] = 255;
                                frame.data[index + 2] = 255;
                            }
                        }
                    }
                    realContext.putImageData(frame, 0, 0);
                }
            };

            let timeoutId: any;

            const animate = () => {
                timeoutId = setTimeout(function () {
                    cube.rotation.x += 0.04;
                    cube.rotation.y += 0.04;
                    renderScene();
                    frameId = requestAnimationFrame(animate);
                }, 1000 / 10);
            };

            let frameId: number | null = requestAnimationFrame(animate);

            return () => {
                cancelAnimationFrame(frameId!);
                clearTimeout(timeoutId);
                frameId = null;
                scene.remove(cube);
                geometry.dispose();
                material.dispose();
            };
        }
    }, [show, props.width, props.height, presenting]);

    let style = {};

    if (presenting) {
        return <Loader title={props.title} />;
    } else {
        return (
            <canvas
                className="Autostereogram"
                style={{ ...props.style, ...style }}
                ref={autostereogramCanvas}
                width={props.width}
                height={props.width / 2}
                onClick={handleToggle}
            />
        );
    }
};

export default Autostereogram;
