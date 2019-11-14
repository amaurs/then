import React, { useEffect, useState } from 'react';
import './Nostalgia.css'
import useInterval from './Hooks.js';

const USER_SERVICE_URL = "https://azzhejgg0l.execute-api.us-east-1.amazonaws.com/api/boleros/en";

export default function Nostalgia() {
    const [user, setUser] = useState("");
    const [count, setCount] = useState(0);
    const [delay, setDelay] = useState(100);

    useEffect(function() {
        fetch(USER_SERVICE_URL)
            .then(results => results.json())
            .then(data => {
                setUser(data.sentence);
        });
    }, []);

    useInterval(() => {
        if(count < user.length) {
            setCount(count + 1);
            setDelay(100);
        }
    }, delay);
    return <div>
                <h1>{user.slice(0, count)}</h1>
           </div>

}
