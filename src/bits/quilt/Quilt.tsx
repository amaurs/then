import React, { useRef, useState, useEffect, useContext } from "react";
import { useTimeout } from "../../Hooks.js";

import { shuffle } from "../../util.js";
import {
    getRandomInt,
} from "../../tools";

import Loader from "../../Presentation.js";
import CSS from "csstype";
import { ThemeContext } from "../../ThemeContext.js";
import "./Quilt.css";

const squareSize = 500;


interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
}

class Patch {
  points: Array<Array<number>>;
  color: string;

  constructor(points: Array<Array<number>>, color: string) {
    this.points = points;
    this.color = color;
  }
}


const Quilt: React.FC<Props> = (props: Props) => {
    const canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const { theme } = useContext(ThemeContext);
    const [presenting, setPresenting] = useState(props.delay > 0);

    const o1 = new Patch([
        [-squareSize, -squareSize],
        [squareSize, -squareSize],
        [squareSize, squareSize],
        [0, 0],
        [-squareSize, squareSize],
    ], theme.quilt[0]);
        
    const o2 = new Patch([
        [0, -squareSize],
        [squareSize, 0],
        [0, squareSize],
        [-squareSize, 0],
        [0, 0],
    ], theme.quilt[1]);
        
    const o3 = new Patch([
        [-squareSize, -squareSize],
        [squareSize, -squareSize],
        [squareSize, 0],
            [0, squareSize],
        [-squareSize, 0],
    ], theme.quilt[1]);
        
        
    const o4 = new Patch([
        [-squareSize, -squareSize],
        [squareSize, -squareSize],
        [squareSize, 0],
        [0, squareSize],
        [-squareSize, 0],
    ], theme.quilt[2]);
        

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        if (!presenting && canvas && canvas.current) {

            let timeoutId: any;

            const animate = () => {
                timeoutId = setTimeout(function () {
                    const context: CanvasRenderingContext2D = canvas.current.getContext(
                        "2d"
                    )!;
                    const width = canvas.current.width;
                    const height = canvas.current.height;

                    context.fillStyle = theme.quilt[3];
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
                            const o = allObjects[5 * j + i];
                            context.fillStyle = o.color;
                            context.beginPath();
                            context.translate(i * (squareSize * 2) + squareSize, j * (squareSize * 2) + squareSize);
                            context.rotate((getRandomInt(0, 4) * Math.PI) / 2);
                            context.moveTo(o.points[0][0], o.points[0][1]);

                            for (let k = 1; k < o.points.length; k++) {
                                context.lineTo(o.points[k][0], o.points[k][1]);
                            }

                            context.resetTransform();
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
                clearTimeout(timeoutId);
                frameId = null;
            };
        }
    }, [presenting, theme]);

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
                width={squareSize * 10}
                height={squareSize * 8}
                ref={canvas}
            />
        );
    }
};

export default Quilt;
