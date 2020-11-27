import React, { useState, useEffect, useRef } from 'react';
import './Photography.css'

import Loader from '../../Presentation.js';

import { useTimeout } from '../../Hooks.js';
import { getRandomInt } from '../../tools';

import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
    url: string;
    rows: number;
}

interface Image {
    url: string;
}


const Photography = (props: Props) => {

    const [data, setData] = useState<Array<Array<Image>>>([[]]);
    const [current, setCurrent] = useState(null);
    const [presenting, setPresenting] = useState(props.delay > 0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    const [dynamicHeight, setDynamicHeight] = useState(5546)
    const [translateX, setTranslateX] = useState(0)

    const horizontalContainerRef = useRef<HTMLDivElement>(document.createElement("div"));
    const verticalContainerRef = useRef<HTMLDivElement>(document.createElement("div"));

    useEffect(() => {
        let cancel = false;
        const fetchImages = async (url: string, rowNumber: number) => {
            try {
                let payload = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                let response = await fetch(url, payload);
                let json = await response.json();
                if (!cancel) {
                    let rows: Array<Array<Image>> = [...Array(rowNumber)].map(() => []);
                    json["images"].map((image: Image, index: number) => {
                        rows[index % rowNumber].push(image);
                    });
                    setData(rows);
                }
            } catch (error) {
                console.log("Call to order endpoint failed.", error)
            }
        }
        fetchImages(props.url, props.rows);
        return () => {
            cancel = true
        };
    }, [props.url, props.rows]);


    useEffect(() => {
        if (!presenting && data !== undefined) {
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
    }, [props.width, props.height, presenting]);

    const createRow = (images: Array<Image>) => {
        return images.map((image, index) => <img className="Photography-image" style={{ height: (props.height * .75) / props.rows }} src={image.url} key={index} />);
    }

    let rows = data.map((row, index) => <div className="Photography-row" key={index}>{createRow(row)}</div>);
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
