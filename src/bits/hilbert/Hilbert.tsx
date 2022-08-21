import React, { useRef, useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { colorToInt } from "../../tools";
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
import Animation from "../../util/Animation";

import { ThemeContext } from "../../ThemeContext.js";

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
        res = "512";
    }

    let [cube, setCube] = useState<string | undefined>(image_cube_map.get(res!));
    let [square, setSquare] = useState<string | undefined>(image_square_map.get(res!));


    useEffect(() => {
        let hilbert_cube = image_cube_map.get(res!);
        let hilbert_square = image_square_map.get(res!);
        setCube(hilbert_cube);
        setSquare(hilbert_square);
        return () => {};
    }, [res]);


    return (
        <Animation
            className="Hilbert"
            title={props.title}
            width={props.width}
            height={props.height}
            delay={props.delay}
            style={props.style}
            res={res}
            square={square}
            cube={cube}
        />
    );
};

export default Hilbert;
