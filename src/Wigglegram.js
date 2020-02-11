import React, { useRef, useState, useEffect } from 'react';
import video from './assets/emji.mp4'
import './Wigglegram.css'

import { getRandomInt } from './util.js';

const Wigglegram = (props) => {

    let image = useRef();
    const [data, setData] = useState(null);

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
          });

    }, []);


    useEffect(() => {

        if (data !== null) {
            let selected = data[getRandomInt(0, data.length)];
            
            image.current.src = selected.url;
        }

    }, [data]);

    


    return (<div>
                <img ref={image} />
            </div>);
}

export default Wigglegram;
