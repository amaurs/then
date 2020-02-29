import React, { useState, useEffect } from 'react';
import './Masonry.css'

import Loader from './Loader';

import { useInterval } from './Hooks.js';
import { getRandomInt } from './util.js';

const Masonry = (props) => {

    const [data, setData] = useState([]);
    const [current, setCurrent] =  useState(null);
    const [delay, setDelay] = useState(null);

    useEffect(() => {
         // TODO: This function needs memoizing. Right now it is calling the service on every mount.
         console.log("Fetching...");
         fetch(props.url, {

            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            return response.json();
          }).then(json => {

            let rows = [...Array(props.rows)].map(() => []);


            json["images"].map((image, index) => {
                rows[index % props.rows].push(image);
            });


            setData(rows);
          });

    }, [props.url, props.rows]);

    const createRow = (images) => {
        return images.map((image, index) => <img className="Masonry-image" style={{ height: (props.height * 0.75) / props.rows }} src={image.url} key={index} />);
    }

    const masStyle = { height: (100 / props.rows) + "%" };

    let rows = data.map((row, index) => <div className="Masonry-row" style={masStyle} key={index}>{createRow(row)}</div>); 


    return (<div className="Masonry" >
                {rows.length === 0 ? <Loader /> : rows}                
            </div>);
}

export default Masonry;
