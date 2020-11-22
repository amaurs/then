import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router";
import { colorToInt } from "../../util.js";
import { useInterval, useTimeout } from "../../Hooks.js";
import "./Hilbert.css";
import Loader from "../../Presentation.js";
import hilbert_cube_8 from "../../assets/hilbert_cube_8_8.png";
import hilbert_square_8 from "../../assets/hilbert_square_8_8.png";
import hilbert_cube_64 from "../../assets/hilbert_cube_64_64.png";
import hilbert_square_64 from "../../assets/hilbert_square_64_64.png";
import hilbert_cube_512 from "../../assets/hilbert_cube_512_512.png";
import hilbert_square_512 from "../../assets/hilbert_square_512_512.png";
import hilbert_cube_4096 from "../../assets/hilbert_cube_4096_4096.png";
import hilbert_square_4096 from "../../assets/hilbert_square_4096_4096.png";

import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}

const image_cube_map: Map<string, string> = new Map([
    ["8", hilbert_cube_8],
    ["64", hilbert_cube_64],
    ["512", hilbert_cube_512],
    ["4096", hilbert_cube_4096],
]);

const image_square_map: Map<string, string> = new Map([
    ["8", hilbert_square_8],
    ["64", hilbert_square_64],
    ["512", hilbert_square_512],
    ["4096", hilbert_square_4096],
]);

const Hilbert = (props: Props) => {
    let { res } = useParams();
    if (res === undefined) {
        res = "8";
    }

    let canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    let [color, setColor] = useState<ImageData | undefined>(undefined);
    let [position, setPosition] = useState<ImageData | undefined>(undefined);
    const [presenting, setPresenting] = useState(props.delay > 0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        let hilbert_cube = image_cube_map.get(res);
        let hilbert_square = image_square_map.get(res);
        let cancel = false;

        const getData = (src: string): Promise<ImageData> => {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = (event: Event) => {
                    let canvas: HTMLCanvasElement = document.createElement(
                        "canvas"
                    );
                    let image = event.target as HTMLImageElement;
                    canvas.width = image.width;
                    canvas.height = image.height;
                    let context: CanvasRenderingContext2D = canvas.getContext(
                        "2d"
                    )!;
                    context.drawImage(image, 0, 0);
                    resolve(
                        context.getImageData(0, 0, image.width, image.height)
                    );
                };
                img.onerror = reject;
                img.src = src;
            });
        };

        getData(hilbert_cube!).then((imageData: ImageData) => {
            if (!cancel) {
                setColor(imageData);
            }
        });

        getData(hilbert_square!).then((imageData: ImageData) => {
            if (!cancel) {
                setPosition(imageData);
            }
        });

        return () => {
            cancel = true;
        };
    }, [res]);

    useEffect(() => {
        if (color !== undefined && position !== undefined && !presenting) {
            let count = 0;
            let timeoutId: any;

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function () {
                    const context: CanvasRenderingContext2D = canvas.current.getContext(
                        "2d"
                    )!;
                    context.imageSmoothingEnabled = false;
                    let canvasWidth = canvas.current.width;
                    let canvasHeight = canvas.current.height;
                    context.clearRect(0, 0, canvasWidth, canvasHeight);
                    let frame = context.getImageData(
                        0,
                        0,
                        canvasWidth,
                        canvasHeight
                    );

                    let l = frame.data.length / 4;

                    for (let i = 0; i < l; i++) {
                        let index = (i + count) % l;

                        let r = position!.data[index * 4 + 0];
                        let g = position!.data[index * 4 + 1];
                        let b = position!.data[index * 4 + 2];
                        let j = colorToInt(r, g, b);

                        frame.data[j * 4 + 0] = color!.data[i * 4 + 0];
                        frame.data[j * 4 + 1] = color!.data[i * 4 + 1];
                        frame.data[j * 4 + 2] = color!.data[i * 4 + 2];
                        frame.data[j * 4 + 3] = 255;
                    }
                    context.putImageData(frame, 0, 0);

                    frameId = requestAnimationFrame(animate);
                    count += 1;
                }, 1000 / 5);
            };

            let frameId: number | null = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId!);
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId);
                frameId = null;
            };
        }
    }, [color, position, presenting]);

    let style = {};
    if (props.width > 0 && props.height > 0) {
        style =
            props.width / props.height < 1
                ? { width: "100vw" }
                : { height: "100vh" };
    }

    if (presenting) {
        return <Loader title={props.title} />;
    } else {
        return (
            <canvas
                className="Hilbert"
                style={{ ...props.style, ...style }}
                width={res + "px"}
                height={res + "px"}
                ref={canvas}
            />
        );
    }
};

export default Hilbert;
