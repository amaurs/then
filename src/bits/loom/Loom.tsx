import React, { useState, useRef, useContext, useEffect } from "react";
import { useTimeout } from "../../Hooks.js";
import Board from "../../Board.js";
import "./Loom.css";
import CSS from "csstype";
import { ThemeContext } from "../../ThemeContext.js";
import { colorMatrix } from "../../tools";

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
    const theme = useContext(ThemeContext);
    const [drag, setDrag] = useState(false);
    const [position, setPosition] = useState([
        48 * squareSize,
        48 * squareSize,
    ]);
    const [offset, setOffset] = useState([0, 0]);
    const square = [8 * squareSize, 3 * squareSize];

    const threadingColorBase = [0, 255, 0, 1.0];
    const treadlingColorBase = [0, 0, 255, 1.0];
    const tieupColorBase = [0, 0, 0, 1.0];
    const weaveColorBase = [255, 0, 0, 1.0];

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
                let threadingColor = colorMatrix(threadingColorBase, theme.theme.colorMatrix);
                threading.printContext(context, squareSize, `rgba(${threadingColor[0]}, ${threadingColor[1]}, ${threadingColor[2]}, ${threadingColor[3]})`);
                let treadlingColor = colorMatrix(treadlingColorBase, theme.theme.colorMatrix);
                treadling.printContextOffset(
                    context,
                    squareSize,
                    canvasSize / squareSize - treadlingSize,
                    threadingSize,
                    `rgba(${treadlingColor[0]}, ${treadlingColor[1]}, ${treadlingColor[2]}, ${treadlingColor[3]})`
                );
                let tieupColor = colorMatrix(tieupColorBase, theme.theme.colorMatrix);
                tieup.printContextOffset(
                    context,
                    squareSize,
                    canvasSize / squareSize - treadlingSize,
                    0,
                    `rgba(${tieupColor[0]}, ${tieupColor[1]}, ${tieupColor[2]}, ${tieupColor[3]})`
                );
                let weaveColor = colorMatrix(weaveColorBase, theme.theme.colorMatrix);
                weave.printContextOffset(
                    context,
                    squareSize,
                    0,
                    threadingSize,
                    `rgba(${weaveColor[0]}, ${weaveColor[1]}, ${weaveColor[2]}, ${weaveColor[3]})`
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
    }, [theme]);

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
