import React, { useRef, useState, useEffect } from "react";
import { useTimeout } from "../../Hooks.js";

import { shuffle, getRandomInt } from "../../util.js";

import Loader from "../../Presentation.js";
import CSS from "csstype";
import "./Quilt.css";

interface Patch {
    points: Array<Array<number>>;
    color: string;
}

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}

let o1: Patch = {
    points: [
        [-50, -50],
        [50, -50],
        [50, 50],
        [0, 0],
        [-50, 50],
    ],
    color: "DarkOrange",
};

let o2: Patch = {
    points: [
        [0, -50],
        [50, 0],
        [0, 50],
        [-50, 0],
        [0, 0],
    ],
    color: "White",
};

let o3: Patch = {
    points: [
        [-50, -50],
        [0, -50],
        [50, 0],
        [0, 50],
        [-50, 0],
    ],
    color: "White",
};

let o4: Patch = {
    points: [
        [-50, -50],
        [50, -50],
        [50, 0],
        [0, 50],
        [-50, 0],
    ],
    color: "DarkOrange",
};

// [[0, 0], [0, 50], [50, 100], [50, 100], [0, 50]]

const Quilt: React.FC<Props> = (props: Props) => {
    const canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const [presenting, setPresenting] = useState(props.delay > 0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        if (!presenting && canvas && canvas.current) {
            let timeoutId: any;

            const animate = () => {
                // Wrapping the animation function with a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function () {
                    const context: CanvasRenderingContext2D = canvas.current.getContext(
                        "2d"
                    )!;
                    const width = canvas.current.width;
                    const height = canvas.current.height;

                    context.fillStyle = "black";
                    context.fillRect(0, 0, width, height);

                    let allObjects = shuffle([
                        o1,
                        o1,
                        o1,
                        o1,
                        o1,
                        o1,
                        o2,
                        o2,
                        o2,
                        o2,
                        o2,
                        o2,
                        o3,
                        o3,
                        o3,
                        o3,
                        o4,
                        o4,
                        o4,
                        o4,
                    ]);

                    for (let j = 0; j < 4; j++) {
                        for (let i = 0; i < 5; i++) {
                            let o = allObjects[5 * j + i];
                            context.fillStyle = o.color;
                            context.beginPath();
                            context.translate(i * 100 + 50, j * 100 + 50);
                            context.rotate((getRandomInt(0, 4) * Math.PI) / 2);
                            context.moveTo(o.points[0][0], o.points[0][1]);

                            for (let k = 1; k < o.points.length; k++) {
                                context.lineTo(o.points[k][0], o.points[k][1]);
                            }

                            context.resetTransform();
                            //context.closePath();

                            context.fill();
                        }
                    }

                    allObjects.forEach((o: Patch) => {});

                    frameId = requestAnimationFrame(animate);
                }, 1000 / 5);
            };

            let frameId: number | null = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId!);
                // It is important to clean up after the component uncanvass.
                clearTimeout(timeoutId);
                frameId = null;
            };
        }
    }, [presenting]);

    let style = {};

    if (props.width > 0 && props.height > 0) {
        style =
            props.width / props.height < 1
                ? { width: props.width + "px" }
                : { height: props.height + "px" };
    }

    if (presenting) {
        return <Loader title={props.title} />;
    } else {
        return (
            <canvas
                className="Quilt"
                style={{ ...props.style, ...style }}
                width={500}
                height={400}
                ref={canvas}
            />
        );
    }
};

export default Quilt;
