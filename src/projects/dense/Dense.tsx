import React, { useRef, useState, useEffect, useContext } from "react";
import { useInterval, useTimeout } from "../../Hooks.js";
import {
    getRandomIntegerArray,
    colorToString,
    invertColor,
    randomColor,
    intToColor,
    colorToInt,
} from "../../util.js";
import Loader from "../../Presentation.js";
import "./Dense.css";
import CSS from "csstype";

import { ThemeContext } from "../../ThemeContext.js";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
    url: string;
}

const Dense = (props: Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const theme = useContext(ThemeContext);
    const [delay, setDelay] = useState<number>(0);
    const squareSampling = 100;
    const numberColors = 500;
    const [presenting, setPresenting] = useState(props.delay > 0);

    useTimeout(() => {
        setPresenting(false);
        setDelay(0);
    }, props.delay);

    useEffect(() => {
        if (!presenting) {
            let n = 0;

            const animate = () => {
                const context: CanvasRenderingContext2D = canvas.current.getContext(
                    "2d"
                )!;
                const width = canvas.current.width;
                const height = canvas.current.height;

                context.beginPath();
                //context.strokeStyle = randomColor();
                //context.strokeStyle = intToColor(n * 10000);
                context.strokeStyle = theme.theme.foreground;

                context.lineWidth = 5;
                context.globalAlpha = 0.5;

                context.moveTo(Math.floor(width / 2), Math.floor(height / 2));

                context.lineTo(
                    Math.floor(width / 2) + Math.floor(width * Math.cos(n)),
                    Math.floor(height / 2) + Math.floor(height * Math.sin(n))
                );

                context.closePath();
                context.stroke();
                n += 1;
                frameId = requestAnimationFrame(animate);
            };

            let frameId: number | null = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId!);
                frameId = null;
            };
        }
    }, [presenting]); //, color]);

    let style = {};

    if (props.width > 0 && props.height > 0) {
        style =
            props.width / props.height < 1
                ? { width: "100vw" }
                : { height: "100vh" };
    }

    let minSize = props.width / props.height < 1 ? props.width : props.height;

    let scale = window.devicePixelRatio;

    let canvasWidth = 1000 * scale;
    let canvasHeight = 1000 * scale;

    if (!presenting) {
        return (
            <canvas
                ref={canvas}
                style={{ ...props.style, ...style }}
                width={canvasWidth}
                height={canvasHeight}
                className="Dense"
            />
        );
    } else {
        return <Loader title={props.title} />;
    }
};

export default Dense;
