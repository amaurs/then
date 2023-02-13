import React, { useRef, useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { colorToInt } from "../../tools";
import { useInterval, useTimeout } from "../../Hooks.js";
import "./Composer.css";
import Loader from "../../Presentation.js";
import Animation from "../../util/Animation";
import { Image } from "../../util/interface";
import { ThemeContext } from "../../ThemeContext.js";

import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
    url: string;
}

const Composer = (props: Props) => {
    let { res } = useParams();
    if (res === undefined) {
        res = "512";
    }

    let [cube, setCube] = useState<string | undefined>();
    let [square, setSquare] = useState<string | undefined>();


    useEffect(() => {
        let cancel = false;
        const fetchImages = async (url: string) => {
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

                    json["images"].forEach((image: Image) => {
                        if (image.url.includes('cube.png')) {
                            setCube(image.url);
                        }
                        if (image.url.includes('square.png')) {
                            setSquare(image.url);   
                        }
                    });
                }
            } catch (error) {
                console.log("Call to order endpoint failed.", error)
            }
        }
        fetchImages(props.url);
        return () => {
            cancel = true
        };
    }, [props.url]);

    if (cube === undefined || square === undefined) {
        
        return null
    } 

    return (
        <Animation
            className="Composer"
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

export default Composer;