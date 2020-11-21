import React, { useRef, useState, useEffect, SyntheticEvent } from "react";
import channelsFirst from "../../assets/first-channels-small.png";
import channelsSecond from "../../assets/second-channels-small.png";
import channelsThird from "../../assets/third-channels-small.png";
import channelMask from "../../assets/mask-small.png";
import { useTimeout } from "../../Hooks.js";
import Loader from "../../Presentation.js";
import "./Distrito.css";
import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
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

const Distrito = (props: Props) => {
    let mount = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    let [width, setWidth] = useState(0);
    let [height, setHeight] = useState(0);
    let [multiImage, setMultiImage] = useState(new MultichannelImage(0, 0));
    let [rows, setRows] = useState<Array<Row> | undefined>(undefined);
    let [hold, setHold] = useState<Hold | undefined>(undefined);
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

                let rows: Array<Row> = [
                    {
                        used: [
                            { position: 4, color: "red" },
                            { position: 2, color: "green" },
                            { position: 5, color: "blue" },
                        ],
                        available: [],
                    },
                    {
                        used: [
                            { position: 5, color: "red" },
                            { position: 4, color: "green" },
                            { position: 1, color: "blue" },
                        ],
                        available: [],
                    },
                ];
                setRows(rows);
            }

            return () => {
                cancel = true;
            };
        });
    }, []);

    useEffect(() => {
        const colorMap: INumbersOnly = {
            red: 0,
            green: 1,
            blue: 2,
        };
        if (
            multiImage !== null &&
            width !== null &&
            height !== null &&
            rows !== null &&
            !presenting
        ) {
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

            let context: CanvasRenderingContext2D = offscreen.getContext("2d")!;
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            for (let i = 0; i < multiImage.channels.length; i++) {
                context.putImageData(
                    multiImage.getGrayImageData(i),
                    i * multiImage.width,
                    0
                );
            }

            rows!.forEach((row: Row, index: number) => {
                let mergedBands = [-1, -1, -1];
                row.used.forEach((colorObject: RowState) => {
                    let bands = [-1, -1, -1];
                    let colorIndex: number = colorMap[colorObject.color];
                    bands[colorIndex] = colorObject.position;
                    mergedBands[colorMap[colorObject.color]] =
                        colorObject.position;
                    context.putImageData(
                        multiImage.getMixImageData(bands),
                        colorObject.position * multiImage.width,
                        (1 + index) * multiImage.height
                    );
                });
                context.putImageData(
                    multiImage.getMixImageData(mergedBands),
                    multiImage.channels.length * multiImage.width,
                    (1 + index) * multiImage.height
                );
            });

            if (hold !== null) {
                let color: number = colorMap[hold!.color];
                context.putImageData(
                    multiImage.getColorMask(color),
                    hold!.x,
                    hold!.y
                );
            }
            realContext.drawImage(offscreen, 0, 0);
        }
    }, [multiImage, width, height, rows, hold, presenting]);

    /**
    const handleOnClick = (e) => {
        let rect = mount.current.getBoundingClientRect();
        let x = Math.floor((e.pageX - rect.left) / rect.width * width),
            y = Math.floor((e.pageY - rect.top) / rect.height * height);
        let row = Math.floor(y / multiImage.height) - 1;
        let column = Math.floor(x / multiImage.width);

        console.log("clicked")

        if (!(row < 0)) {

            
            let newRows = [...rows];
            let active = false;
            let newUsed = [];
            let newAvailable = [...newRows[row].available];

            // First I check if they clicked on an assigned space.
            newRows[row].used.forEach(colorObject => {
                if (colorObject.position === column) {
                    newAvailable.unshift({color: colorObject.color, position: -1});
                    active = true;
                } else {
                    newUsed.push({...colorObject});
                }
            });
    
            // If they didn't, I get the last color that was unassigned and put in in place.
    
            if (!active && newAvailable.length > 0) {
                let colorObject = newAvailable.shift();
                colorObject.position = column;
                newUsed.push(colorObject);
            }
    
            newRows[row].used = newUsed;
            newRows[row].available = newAvailable;
            setRows(newRows);
        }
    }
    **/

    //const handleOnMouseDown = (e) => {
    //    let rect = mount.current.getBoundingClientRect();
    //    let x = Math.floor(((e.pageX - rect.left) / rect.width) * width),
    //        y = Math.floor(((e.pageY - rect.top) / rect.height) * height);
    //
    //    let row = Math.floor(y / multiImage.height) - 1;
    //    let column = Math.floor(x / multiImage.width);
    //
    //    let xOffset = x - column * multiImage.width,
    //        yOffset = y - (row + 1) * multiImage.height;
    //
    //    if (!(row < 0)) {
    //        let newRows = [...rows];
    //        let newAvailable = [...newRows[row].available];
    //        let newUsed = [];
    //
    //        // First I check if they clicked on an assigned space.
    //        newRows[row].used.forEach((colorObject) => {
    //            if (colorObject.position === column) {
    //                newAvailable.unshift({
    //                    color: colorObject.color,
    //                    position: -1,
    //                });
    //                setHold({
    //                    color: colorObject.color,
    //                    row: row,
    //                    position: colorObject.position,
    //                    x: x - xOffset,
    //                    y: y - yOffset,
    //                });
    //            } else {
    //                newUsed.push({ ...colorObject });
    //            }
    //        });
    //
    //        newRows[row].used = newUsed;
    //        newRows[row].available = newAvailable;
    //        setRows(newRows);
    //    }
    //};
    //
    //const handleOnMouseUp = (e) => {
    //    console.log("Realeasing hold");
    //
    //    if (hold !== null) {
    //        let rect = mount.current.getBoundingClientRect();
    //        let x = Math.floor(((e.pageX - rect.left) / rect.width) * width),
    //            y = Math.floor(((e.pageY - rect.top) / rect.height) * height);
    //
    //        let row = Math.floor(y / multiImage.height) - 1;
    //        let column = Math.floor(x / multiImage.width);
    //
    //        // First I check if they clicked on an assigned space.
    //
    //        let invalid = false;
    //        let newRows = [...rows];
    //
    //        if (!(row < 0) && hold.row === row) {
    //            newRows[row].used.forEach((colorObject) => {
    //                if (colorObject.position === column) {
    //                    invalid = true;
    //                }
    //            });
    //        }
    //
    //        if (hold.row !== row) {
    //            invalid = true;
    //        }
    //
    //        if (!(column < multiImage.channels.length)) {
    //            invalid = true;
    //        }
    //
    //        if (invalid) {
    //            newRows[hold.row].used.push({
    //                color: hold.color,
    //                position: hold.position,
    //            });
    //        } else {
    //            newRows[hold.row].used.push({
    //                color: hold.color,
    //                position: column,
    //            });
    //        }
    //        setHold(null);
    //        setRows(newRows);
    //    }
    //};
    //
    //const handleOnMouseMove = (e) => {
    //    if (hold !== null) {
    //        let rect = mount.current.getBoundingClientRect();
    //        let x = Math.floor(((e.pageX - rect.left) / rect.width) * width),
    //            y = Math.floor(((e.pageY - rect.top) / rect.height) * height);
    //        let row = Math.floor(y / multiImage.height) - 1;
    //        let column = Math.floor(x / multiImage.width);
    //
    //        let xOffset = x - column * multiImage.width,
    //            yOffset = y - (row + 1) * multiImage.height;
    //
    //        setHold({ ...hold, x: x - xOffset, y: y - yOffset });
    //    }
    //};

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
