import React, { useRef, useState, useEffect, useContext } from "react";
import {
    colorToString,
    invertColor,
    colorToGrey,
} from "../../tools";
import { useTimeout } from "../../Hooks.js";
import Loader from "../../Presentation.js";
import CSS from "csstype";
import { ThemeContext } from "../../ThemeContext.js";
import "./Colors.css";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
    colors: number[];
}

const Colors = (props: Props) => {
    const canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const theme = useContext(ThemeContext);
    const [presenting, setPresenting] = useState(props.delay > 0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        if (props.colors.length > 0 && !presenting) {
            let n = 0;
            let timeoutId: any;

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function() {
                    let color = [
                        props.colors[(n % (props.colors.length / 3)) * 3],
                        props.colors[(n % (props.colors.length / 3)) * 3 + 1],
                        props.colors[(n % (props.colors.length / 3)) * 3 + 2],
                    ];

                    const context: CanvasRenderingContext2D = canvas.current.getContext(
                        "2d"
                    )!;
                    const width = canvas.current.width;
                    const height = canvas.current.height;
                    context.save();
                    context.clearRect(0, 0, width, height);
                    if (theme.theme.name === 'konami') {
                        let grey = colorToGrey(color[0],
                            color[1],
                            color[2]);

                        console.log(`grey: ${grey}`);

                        context.fillStyle = colorToString(
                            255,
                            grey,
                            255
                        );

                        context.fillRect(0, 0, width, height);
                        context.fillStyle = colorToString(
                            255,
                            255 - grey,
                            255
                        );
                        context.fillRect(
                            (width * (1 - Math.sqrt(2) / 2)) / 2,
                            (height * (1 - Math.sqrt(2) / 2)) / 2,
                            width / Math.sqrt(2),
                            height / Math.sqrt(2)
                        );

                    } else {
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
                    };


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
    }, [props.colors, presenting, theme]);

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
