import React, { useEffect, useState, useRef, useContext } from 'react';
import { ThemeContext } from './ThemeContext.js';
import './Bolero.css'
import { useInterval, useTimeout } from './Hooks.js';
import Loader from './Presentation.js';

export default function Bolero(props) {

    let mount = useRef();
    const theme = useContext(ThemeContext);
    const [sentence, setSentence] = useState("");
    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [delay, setDelay] = useState(null);
    const [presenting, setPresenting] = useState(props.delay>0);

    useTimeout(() => {
        setPresenting(false);
        setDelay(100);
    }, props.delay);

    useEffect(() => {
        let cancel = false;
        const getPhrase = async (url) => {
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
                    setSentence(json.sentence.split(" ").filter(word => "" !== word)
                                                    .map(word => word === "i"? "I": word)
                                                    .map((word, index) => index === 0? word.charAt(0).toUpperCase() + word.slice(1): word)
                                                    .reduce((a, b) => a + " " + b, ""));
                    setTotal(total + 1);
                }  
            } catch (error) {
                console.log("Call to order endpoint failed.", error)
            }
        }
        getPhrase(props.url);
        return () => cancel = true;
    }, [props.url, count]);


    useEffect(() => {  
        if (sentence.length > 0 && !presenting) {
            let n = 0;
            let timeoutId;

            const animate = () => {
                timeoutId = setTimeout(function() {
                    console.log(sentence.slice(0, n));

                    mount.current.innerHTML = sentence.slice(0, n);
                    
                    if(sentence.length === n - 5 && total < 10) {
                        setCount(count + 1);
                    }

                    n += 1;
                    frameId = requestAnimationFrame(animate);
                }, 1000 / 10);
             }

            let frameId = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId);
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId);
                frameId = null;
            }
        } 
    }, [sentence, presenting]);

    if (presenting) {
        return <Loader title={props.title}/>
    } else {
        return (
            <div className="Bolero" style={{color: theme.theme.foreground, 
                                          mixBlendMode: theme.theme.mixBlendMode}}>
                <h1 ref={mount}></h1>
            </div>
        );
    }
}
