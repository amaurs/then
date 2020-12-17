import React, { useState, useEffect, useRef, useContext } from 'react';
import './Stereo.css'
import Loader from '../../Presentation.js';
import { useTimeout } from '../../Hooks.js';
import { getRandomInt, colorToGrey } from '../../tools';

import left from '../../assets/left.jpg';
import right from '../../assets/right.jpg';
import { ThemeContext } from "../../ThemeContext.js";

import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}

const Stereo = (props: Props) => {


    const mount = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const [data, setData] = useState(null);
    const [current, setCurrent] = useState(null);
    const [frames, setFrames] = useState<Array<ImageData> | undefined>(undefined);
    const theme = useContext(ThemeContext);

    const [presenting, setPresenting] = useState(props.delay > 0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay)

    useEffect(() => {
        let cancel = false;
        const getData = (src: string): Promise<ImageData> => {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = (event: Event) => {
                    let image = event.currentTarget as HTMLImageElement;
                    let canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const context: CanvasRenderingContext2D = canvas.getContext(
                        "2d"
                    )!;
                    context.drawImage(image, 0, 0);
                    resolve(context.getImageData(0, 0, image.width, image.height))
                }
                img.onerror = reject
                img.src = src
            });
        }

        Promise.all([getData(left), getData(right)]).then(function(frames: Array<ImageData>) {
            if (!cancel) {
                setFrames(frames);
                console.log("Promise is fullfiled.");
            }
        });
        return () => { cancel = true };

    }, []);


    useEffect(() => {

        if (frames !== undefined && !presenting) {

            // This constants come from the execution of the image,
            // need to figure out how to pass this down in a more
            // dynamic way.

            let tick = 0;

            let timeoutId: any;
            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function() {
                    let canvas = mount.current;

                    canvas.width = frames[0].width;
                    canvas.height = frames[0].height;
                    const context: CanvasRenderingContext2D = mount.current.getContext(
                        "2d"
                    )!;
                    let image = frames[tick % frames.length];
                    if (theme.theme.name === 'konami') {
                        let arr = new Uint8ClampedArray(canvas.width * canvas.height * 4);
                        for (let i = 0; i < arr.length; i++) {
                            let grey = colorToGrey(image.data[i * 4 + 0], image.data[i * 4 + 1], image.data[i * 4 + 2]);
                            arr[i * 4 + 0] = 255;
                            arr[i * 4 + 1] = grey;
                            arr[i * 4 + 2] = 255;
                            arr[i * 4 + 3] = image.data[i * 4 + 3];
                        }
                        image = new ImageData(arr, image.width, image.height);
                    }
                    
                    context.putImageData(image, 0, 0);
                    tick = tick + 1

                    frameId = requestAnimationFrame(animate);
                }, 1000 / 8);
            }

            let frameId: number | null = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId!);
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId);
                frameId = null;
            };
        }

    }, [frames, presenting, theme]);

    let style = {};
    if (props.width > 0 && props.height > 0) {
        style = props.width / props.height < 1 ? { width: "100vw" } : { height: "100vh" };
    }

    if (presenting) {
        return <Loader title={props.title} />
    } else {
        return (
            <canvas
                className="Stereo"
                ref={mount}
                style={{ ...props.style, ...style }}
            />
        );
    }
}

export default Stereo;
