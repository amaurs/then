import React, { useEffect, useState, useRef, useContext } from "react";
import { ThemeContext } from "../../ThemeContext.js";
import "./Bolero.css";
import { useTimeout } from "../../Hooks.js";
import Loader from "../../Presentation.js";
import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
    sentence: string;
}

export default function Bolero(props: Props) {
    let div = useRef<HTMLDivElement>(document.createElement("div"));
    const theme = useContext(ThemeContext);
    const [delay, setDelay] = useState(0);
    const [presenting, setPresenting] = useState(props.delay > 0);

    useTimeout(() => {
        setPresenting(false);
        setDelay(100);
    }, props.delay);

    useEffect(() => {
        if (props.sentence.length > 0 && !presenting) {
            let n = 0;
            let timeoutId: any;

            const animate = () => {
                timeoutId = setTimeout(function () {
                    console.log(props.sentence.slice(0, n));
                    div.current.innerHTML = props.sentence.slice(0, n);
                    n += 1;
                    frameId = requestAnimationFrame(animate);
                }, 1000 / 5);
            };

            let frameId: number | null = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId!);
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId);
                frameId = null;
            };
        }
    }, [props.sentence, presenting]);

    let style: CSS.Properties = {
        color: theme.theme.middleground,
        mixBlendMode: theme.theme.mixBlendMode as CSS.Property.MixBlendMode,
    };

    if (presenting) {
        return <Loader title={props.title} />;
    } else {
        return (
            <div className="Bolero" style={{ ...props.style, ...style }}>
                <h1 ref={div}></h1>
            </div>
        );
    }
}
