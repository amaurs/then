import React, { useState, useRef, useContext, useEffect } from "react";
import { useTimeout } from "../../Hooks.js";
import Board from "../../Board.js";
import "./Loom.css";
import CSS from "csstype";

const canvasSize = 1000;
const squareSize = 10;

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}

const Loom = (props: Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const [drag, setDrag] = useState(false);
    const [position, setPosition] = useState([
        48 * squareSize,
        48 * squareSize,
    ]);
    const [offset, setOffset] = useState([0, 0]);
    const square = [8 * squareSize, 3 * squareSize];

    useEffect(() => {
        let timeoutId: any;

        const threadingSize = 6;
        const treadlingSize = 7;

        let threading = new Board(
            canvasSize / squareSize - treadlingSize,
            threadingSize,
            0.5
        );
        let treadling = new Board(
            treadlingSize,
            canvasSize / squareSize - threadingSize,
            0.5
        );
        let tieup = new Board(treadlingSize, threadingSize, 0.5);
        //threading.randomize();
        //treadling.randomize();
        tieup.randomize();

        const animate = () => {
            timeoutId = setTimeout(function () {
                const context: CanvasRenderingContext2D = canvas.current.getContext(
                    "2d"
                )!;

                context.clearRect(
                    0,
                    0,
                    canvas.current.width,
                    canvas.current.height
                );

                threading = threading.shiftRight();
                treadling = treadling.shiftUp();

                let weave = treadling
                    .multiply(tieup.transpose())
                    .multiply(threading);

                threading.printContext(context, squareSize, "black");
                treadling.printContextOffset(
                    context,
                    squareSize,
                    canvasSize / squareSize - treadlingSize,
                    threadingSize,
                    "black"
                );
                tieup.printContextOffset(
                    context,
                    squareSize,
                    canvasSize / squareSize - treadlingSize,
                    0,
                    "green"
                );

                weave.printContextOffset(
                    context,
                    squareSize,
                    0,
                    threadingSize,
                    "red"
                );
                frameId = requestAnimationFrame(animate);
            }, 1000 / 60);
        };

        let frameId: number | null = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(frameId!);
            // It is important to clean up after the component unmounts.
            clearTimeout(timeoutId);
            frameId = null;
        };
    }, []);

    let style = {};
    if (props.width > 0 && props.height > 0) {
        style =
            props.width / props.height < 1
                ? { width: "100vw" }
                : { height: "100vh" };
    }

    return (
        <canvas
            className="Loom"
            ref={canvas}
            style={style}
            width={canvasSize}
            height={canvasSize}
        />
    );
};

export default Loom;
