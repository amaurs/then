import React, { useEffect, useState } from 'react';
import './Nostalgia.css'
import { useInterval, useTimeout } from './Hooks.js';
import Loader from './Presentation.js';

export default function Nostalgia(props) {
    const [user, setUser] = useState("");
    const [count, setCount] = useState(0);
    const [delay, setDelay] = useState(null);
    const [presenting, setPresenting] = useState(true);

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
                    setUser(json.sentence.split(" ").filter(word => "" !== word)
                                                    .map(word => word === "i"? "I": word)
                                                    .map((word, index) => index === 0? word.charAt(0).toUpperCase() + word.slice(1): word)
                                                    .reduce((a, b) => a + " " + b, ""));
                }  
            } catch (error) {
                console.log("Call to order endpoint failed.", error)
            }
        }
        getPhrase(props.url);
        return () => cancel=true;
    }, [props.url]);

    useInterval(() => {
        if(count < user.length) {
            setCount(count + 1);
            setDelay(100);
        }
    }, delay);

    if (presenting) {
        return <Loader title={props.title}/>
    } else {
        return (
            <div className="Nostalgia">
                <h1>{user.slice(0, count)}</h1>
            </div>
        );
    }
}
