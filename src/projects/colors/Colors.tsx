import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router";
import { useInterval } from "../../Hooks.js";
import {
    getRandomIntegerArray,
    colorToString,
    invertColor,
    colorToInt,
} from "../../util.js";
import { useTimeout } from "../../Hooks.js";
import Loader from "../../Presentation.js";
import CSS from "csstype";
import "./Colors.css";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
    url: string;
}

const numberColors = 750;

const Colors = (props: Props) => {
    const canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const [colors, setColors] = useState([]);
    const [presenting, setPresenting] = useState(props.delay > 0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        let cancel = false;
        const fetchColorsSolution = async (
            url: string,
            numberColors: number
        ) => {
            try {
                let payload = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                let colorsArray = getRandomIntegerArray(
                    numberColors * 3,
                    0,
                    256
                );
                let colorsUrl =
                    props.url +
                    "/solve?cities=" +
                    JSON.stringify(colorsArray) +
                    "&dimension=" +
                    3;
                let response = await fetch(colorsUrl, payload);
                let json = await response.json();
                if (!cancel) {
                    setColors(json);
                }
            } catch (error) {
                console.log("Call to order endpoint failed.", error);
            }
        };
        fetchColorsSolution(props.url, numberColors);
        return () => {
            cancel = true;
        };
    }, [props.url]);

    useEffect(() => {
        if (colors.length > 0 && !presenting) {
            let n = 0;
            let timeoutId: any;

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function () {
                    let color = [
                        colors[(n % (colors.length / 3)) * 3],
                        colors[(n % (colors.length / 3)) * 3 + 1],
                        colors[(n % (colors.length / 3)) * 3 + 2],
                    ];

                    const context: CanvasRenderingContext2D = canvas.current.getContext(
                        "2d"
                    )!;
                    const width = canvas.current.width;
                    const height = canvas.current.height;
                    context.save();
                    context.clearRect(0, 0, width, height);
                    context.fillStyle = colorToString(
                        color[0],
                        color[1],
                        color[2]
                    );
                    context.fillRect(0, 0, width, height);
                    context.fillStyle = invertColor(
                        color[0],
                        color[1],
                        color[2]
                    );
                    context.fillRect(
                        (width * (1 - Math.sqrt(2) / 2)) / 2,
                        (height * (1 - Math.sqrt(2) / 2)) / 2,
                        width / Math.sqrt(2),
                        height / Math.sqrt(2)
                    );
                    n += 1;
                    frameId = requestAnimationFrame(animate);
                }, 1000 / 10);
            };

            let frameId: number | null = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId!);
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId);
                frameId = null;
            };
        }
    }, [colors, presenting]);

    let style = {};

    if (props.width > 0 && props.height > 0) {
        style =
            props.width / props.height < 1
                ? { width: props.width + "px", height: props.width + "px" }
                : { width: props.height + "px", height: props.height + "px" };
    }

    if (presenting) {
        return <Loader title={props.title} />;
    } else {
        return (
            <canvas
                className="Colors"
                style={{ ...props.style, ...style }}
                ref={canvas}
            />
        );
    }
};

export default Colors;
