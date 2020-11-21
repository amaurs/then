import React, { useRef, useState, useEffect, SyntheticEvent } from "react";
import channelsFirst from "../../assets/first-channels-small.png";
import channelsSecond from "../../assets/second-channels-small.png";
import channelsThird from "../../assets/third-channels-small.png";
import channelMask from "../../assets/mask-small.png";
import { useTimeout } from "../../Hooks.js";
import Loader from "../../Presentation.js";
import "./Distrito.css";
import CSS from "csstype";

import { getRandomInt } from "../../util.js";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}

enum Color {
    RED,
    GREEN,
    BLUE,
}

interface Map {
    position: number;
    color: Color;
}

interface RowState {
    position: number;
    color: string;
}

interface Row {
    used: Array<RowState>;
    available: Array<RowState>;
}

interface INumbersOnly {
    [key: string]: number;
}

interface Hold {
    color: string;
    row: number;
    position: number;
    x: number;
    y: number;
}

class MultichannelImage {
    height: number;
    width: number;
    channels: Array<Uint8ClampedArray>;
    mask: Uint8ClampedArray;

    constructor(width: number, height: number) {
        this.height = height;
        this.width = width;
        this.channels = [];
        this.mask = new Uint8ClampedArray(this.height * this.width).fill(255);
    }

    addChannel(channel: Uint8ClampedArray) {
        this.channels.push(channel);
    }

    addMask(mask: Uint8ClampedArray) {
        this.mask = mask;
    }

    getMixImageData(channelIndexes: Array<number>) {
        let [red, green, blue] = channelIndexes;
        const arr = new Uint8ClampedArray(this.height * this.width * 4);
        for (let i = 0; i < arr.length; i++) {
            arr[i * 4 + 0] = red === -1 ? 0 : this.channels[red][i];
            arr[i * 4 + 1] = green === -1 ? 0 : this.channels[green][i];
            arr[i * 4 + 2] = blue === -1 ? 0 : this.channels[blue][i];
            arr[i * 4 + 3] = this.mask[i];
        }
        return new ImageData(arr, this.width, this.height);
    }

    getGrayImageData(channel: number) {
        return this.getMixImageData([channel, channel, channel]);
    }

    getColorMask(color: number) {
        const arr = new Uint8ClampedArray(this.height * this.width * 4);
        for (let i = 0; i < arr.length; i++) {
            arr[i * 4 + color] = this.mask[i];
            arr[i * 4 + 3] = this.mask[i];
        }
        return new ImageData(arr, this.width, this.height);
    }
}

const selectRandomFrom = (pool: Array<any>, howMany: number): Array<any> => {
    let poolCopy = [...pool];

    let result: Array<any> = [];

    for (let i = 0; i < howMany; i++) {
        let index = getRandomInt(0, poolCopy.length - 1);
        let extracted = poolCopy.splice(index, 1);
        result = [...result, ...extracted];
    }
    return result;
};

const Distrito = (props: Props) => {
    let mount = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    let [width, setWidth] = useState(0);
    let [height, setHeight] = useState(0);
    let [multiImage, setMultiImage] = useState<MultichannelImage | undefined>(
        undefined
    );

    const [presenting, setPresenting] = useState(props.delay > 0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        const getData = (src: string): Promise<ImageData> => {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = (event: Event) => {
                    let canvas: HTMLCanvasElement = document.createElement(
                        "canvas"
                    );
                    let imageTarget = event.currentTarget as HTMLImageElement;
                    canvas!.width = imageTarget.width;
                    canvas.height = imageTarget.height;
                    const context: CanvasRenderingContext2D = canvas.getContext(
                        "2d"
                    )!;
                    context.drawImage(imageTarget, 0, 0);
                    resolve(
                        context.getImageData(
                            0,
                            0,
                            imageTarget.width,
                            imageTarget.height
                        )
                    );
                };
                img.onerror = reject;
                img.src = src;
            });
        };

        let cancel = false;

        Promise.all([
            getData(channelsFirst),
            getData(channelsSecond),
            getData(channelsThird),
            getData(channelMask),
        ]).then(function (values: Array<ImageData>) {
            if (!cancel) {
                let [first, second, third, fourth] = values;
                let image = new MultichannelImage(first.width, first.height);
                let tm1 = new Uint8ClampedArray(first.width * first.height);
                let tm2 = new Uint8ClampedArray(first.width * first.height);
                let tm3 = new Uint8ClampedArray(first.width * first.height);
                let tm4 = new Uint8ClampedArray(first.width * first.height);
                let tm5 = new Uint8ClampedArray(first.width * first.height);
                let tm6 = new Uint8ClampedArray(first.width * first.height);
                let tm7 = new Uint8ClampedArray(first.width * first.height);
                let mask = new Uint8ClampedArray(first.width * first.height);

                let l = first.data.length / 4;

                for (let i = 0; i < l; i++) {
                    tm1[i] = first.data[i * 4 + 0];
                    tm2[i] = first.data[i * 4 + 1];
                    tm3[i] = first.data[i * 4 + 2];
                    tm4[i] = second.data[i * 4 + 0];
                    tm5[i] = second.data[i * 4 + 1];
                    tm6[i] = second.data[i * 4 + 2];
                    tm7[i] = third.data[i * 4 + 0];
                    mask[i] = fourth.data[i * 4 + 0];
                }

                image.addChannel(tm1);
                image.addChannel(tm2);
                image.addChannel(tm3);
                image.addChannel(tm4);
                image.addChannel(tm5);
                image.addChannel(tm6);
                image.addChannel(tm7);
                image.addMask(mask);

                setWidth(image.width * (image.channels.length + 1));
                setHeight(image.height * 3);
                setMultiImage(image);
            }

            return () => {
                cancel = true;
            };
        });
    }, []);

    useEffect(() => {
        if (
            multiImage !== undefined &&
            !presenting &&
            width !== null &&
            height !== null
        ) {
            let timeoutId: any;

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function () {
                    const realContext: CanvasRenderingContext2D = mount.current.getContext(
                        "2d"
                    )!;
                    let canvasWidth = mount.current.width;
                    let canvasHeight = mount.current.height;
                    realContext.clearRect(0, 0, canvasWidth, canvasHeight);
                    realContext.filter =
                        "brightness(1) saturate(100%) contrast(100%) opacity(1)";

                    const offscreen: HTMLCanvasElement = document.createElement(
                        "canvas"
                    );
                    offscreen.width = mount.current.width;
                    offscreen.height = mount.current.height;

                    let context: CanvasRenderingContext2D = offscreen.getContext(
                        "2d"
                    )!;
                    context.clearRect(0, 0, canvasWidth, canvasHeight);

                    multiImage!.channels.forEach(
                        (channel: Uint8ClampedArray, index: number) => {
                            context.putImageData(
                                multiImage!.getGrayImageData(index),
                                index * multiImage!.width,
                                0
                            );
                        }
                    );

                    let mapRows: Array<Array<Map>> = [];

                    for (let i = 0; i < 2; i++) {
                        let row: Array<Map> = [];
                        let positions = selectRandomFrom(
                            [0, 1, 2, 3, 4, 5, 6],
                            3
                        );
                        let colors = selectRandomFrom([0, 1, 2], 3);
                        for (let j = 0; j < 3; j++) {
                            row.push({
                                position: positions[j],
                                color: colors[j],
                            });
                        }
                        mapRows.push(row);
                    }

                    mapRows!.forEach((mapRow: Array<Map>, index: number) => {
                        let mergedBands = [-1, -1, -1];

                        mapRow.forEach((map: Map) => {
                            let bands = [-1, -1, -1];
                            bands[map.color] = map.position;
                            mergedBands[map.color] = map.position;
                            context.putImageData(
                                multiImage!.getMixImageData(bands),
                                map.position * multiImage!.width,
                                (1 + index) * multiImage!.height
                            );
                        });

                        context.putImageData(
                            multiImage!.getMixImageData(mergedBands),
                            multiImage!.channels.length * multiImage!.width,
                            (1 + index) * multiImage!.height
                        );
                    });

                    realContext.drawImage(offscreen, 0, 0);

                    frameId = requestAnimationFrame(animate);
                }, 1000 / 12);
            };

            let frameId: number | null = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId!);
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId);
                frameId = null;
            };
        }
    }, [multiImage, presenting, width, height]);

    let style = { width: props.width + "px" };

    if (props.width === 0 && props.height === 0) {
        return null;
    }

    if (presenting) {
        return <Loader title={props.title} />;
    } else {
        return (
            <canvas
                className="Distrito"
                ref={mount}
                style={{ ...props.style, ...style }}
                width={width + "px"}
                height={height + "px"}
                //onMouseDown={handleOnMouseDown}
                //onMouseUp={handleOnMouseUp}
                //onMouseMove={handleOnMouseMove}
            />
        );
    }
};

export default Distrito;
