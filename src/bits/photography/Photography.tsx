import React, { useState, useEffect, useRef, useContext } from 'react';
import './Photography.css'

import Loader from '../../Presentation.js';

import { useTimeout } from '../../Hooks.js';
import { ThemeContext } from "../../ThemeContext.js";
import { Image } from "../../util/interface";

import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
    url: string;
    rows: number;
    data: Array<Array<Image>>;
}


const Photography = (props: Props) => {

    const [presenting, setPresenting] = useState(props.delay > 0);
    const theme = useContext(ThemeContext);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    const [dynamicHeight, setDynamicHeight] = useState(5546)
    const [translateX, setTranslateX] = useState(0)

    const horizontalContainerRef = useRef<HTMLDivElement>(document.createElement("div"));
    const verticalContainerRef = useRef<HTMLDivElement>(document.createElement("div"));


    useEffect(() => {
        if (!presenting && props.data !== undefined) {
            const setOffsetHander = () => {
                const offsetTop = -verticalContainerRef.current.offsetTop;
                const objectWidth = horizontalContainerRef.current.scrollWidth;
                let dynamicHeight = objectWidth - window.innerWidth + window.innerHeight;
                setDynamicHeight(dynamicHeight);
                setTranslateX(offsetTop);
            }

            window.addEventListener("scroll", setOffsetHander);
            return () => {
                window.removeEventListener("scroll", setOffsetHander);
            }
        }
    }, [props.data, props.width, props.height, presenting]);

    const createRow = (images: Array<Image>) => {
        return images.map((image, index) => <div className="Photography-image" style={{ height: (props.height * .75) / props.rows, width: props.width }} key={index}>
            <svg width="100%" height="100%">
                <defs>
                    <filter id="color">
                        <feColorMatrix
                            type="matrix"
                            values={theme.theme.colorMatrix.join(" ")} />
                    </filter>
                </defs>

                <image href={image.url} width="100%" height="100%" filter="url(#color)" />
            </svg>
        </div>);
    }

    let rows = props.data.map((row, index) => <div className="Photography-row" key={index}>{createRow(row)}</div>);
    let style = { height: dynamicHeight + "px" };
    if (rows.length === 0 && presenting) {
        return <Loader title={props.title} />
    } else {
        return (
            <div className="Photography"
                style={{ ...props.style, ...style }}>
                <div className="Photography-sticky" ref={verticalContainerRef}>
                    <div className="Photography-horizontal" style={{ transform: "translateX(" + translateX + "px)" }} ref={horizontalContainerRef}>
                        {rows}
                    </div>
                </div>
            </div>
        );
    }
}

export default Photography;
