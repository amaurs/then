import React, { useEffect, useState } from 'react';
import './Nostalgia.css'
import { useInterval, useTimeout } from './Hooks.js';
import Loader from './Loader.js';


export default function Nostalgia(props) {
    const [user, setUser] = useState("");
    const [count, setCount] = useState(0);
    const [delay, setDelay] = useState(null);
    const [presenting, setPresenting] = useState(true);

    useTimeout(() => {
        setPresenting(false);
        setDelay(100);
    }, props.delay);

    const getPhrase = (url) => {
        fetch(url)
            .then(results => results.json())
            .then(data => {
                setUser(data.sentence.split(" ").filter(word => "" !== word)
                                                    .map(word => word === "i"? "I": word)
                                                    .map((word, index) => index === 0? word.charAt(0).toUpperCase() + word.slice(1): word)
                                                    .reduce((a, b) => a + " " + b, ""));
                
        });
    }

    useEffect(function() {
        getPhrase(props.url);
        setCount(0);
    }, [props.url]);

    useInterval(() => {
        if(count < user.length) {
            setCount(count + 1);
            setDelay(100);
        }
    }, delay);

    if (presenting) {
        return <Loader />
    } else {
        return (<div className="Nostalgia">
                    <h1>{user.slice(0, count)}</h1>
           </div>);
    }
}
