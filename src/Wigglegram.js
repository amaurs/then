import React, { useRef, useState, useEffect } from 'react';
import video from './assets/emji.mp4'
import './Wigglegram.css'

import Loader from './Loader';

import { useInterval } from './Hooks.js';
import { getRandomInt } from './util.js';

const Wigglegram = (props) => {

    let image = useRef();
    const [data, setData] = useState(null);
    const [current, setCurrent] =  useState(null);
    const [delay, setDelay] = useState(null);

    useEffect(() => {
         // TODO: This function needs memoizing. Right now it is calling the service on every mount.
         console.log("Fetching...");
         fetch(props.url + "/wigglegrams", {

            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            return response.json();
          }).then(json => {
            setData(json["images"]);
            let selected = json["images"];
            setDelay(0);
          });

    }, []);

    useInterval(() => {
        if(data !== null) {
            let selected = data[getRandomInt(0, data.length)];
            setCurrent(selected.url);
            setDelay(1000);
        }
    }, delay);


    return (<div>
                {current === null ? <Loader /> : <img src={current} />}                
            </div>);
}

export default Wigglegram;
