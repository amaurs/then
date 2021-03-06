import React, { useEffect, useState, useRef, useContext } from "react";
import { ThemeContext } from "../../ThemeContext.js";
import "./Bolero.css";
import { useInterval, useTimeout } from "../../Hooks.js";
import Loader from "../../Presentation.js";
import CSS from "csstype";

interface Props {
    title: string;
    delay: number;
    style: CSS.Properties;
    width: number;
    height: number;
    url: string;
}

export default function Bolero(props: Props) {
    let div = useRef<HTMLDivElement>(document.createElement("div"));
    const theme = useContext(ThemeContext);
    const [sentence, setSentence] = useState("");
    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [delay, setDelay] = useState(0);
    const [presenting, setPresenting] = useState(props.delay > 0);

    useTimeout(() => {
        setPresenting(false);
        setDelay(100);
    }, props.delay);

    useEffect(() => {
        let cancel = false;
        const getPhrase = async (url: string) => {
            try {
                let payload = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                let response = await fetch(url, payload);
                let json = await response.json();
                if (!cancel) {
                    setSentence(
                        json.sentence
                            .split(" ")
                            .filter((word: string) => "" !== word)
                            .map((word: string) => (word === "i" ? "I" : word))
                            .map((word: string, index: number) =>
                                index === 0
                                    ? word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                    : word
                            )
                            .reduce((a: string, b: string) => a + " " + b, "")
                    );
                    setTotal(total + 1);
                }
            } catch (error) {
                console.log("Call to order endpoint failed.", error);
            }
        };
        getPhrase(props.url);
        return () => {
            cancel = true;
        };
    }, [props.url, count]);

    useEffect(() => {
        if (sentence.length > 0 && !presenting) {
            let n = 0;
            let timeoutId: any;

            const animate = () => {
                timeoutId = setTimeout(function () {
                    console.log(sentence.slice(0, n));

                    div.current.innerHTML = sentence.slice(0, n);

                    if (sentence.length === n - 5 && total < 10) {
                        setCount(count + 1);
                    }

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
    }, [sentence, presenting]);

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
