import React, { useState, useEffect, useRef } from 'react';
import './Masonry.css'

import Loader from './Loader';

import { useTimeout } from './Hooks.js';
import { getRandomInt } from './util.js';


const Masonry = (props) => {

    const [data, setData] = useState([]);
    const [current, setCurrent] =  useState(null);
    let [presenting, setPresenting] = useState(true);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    const [dynamicHeight, setDynamicHeight] = useState(5546)
    const [translateX, setTranslateX] = useState(0)

    const horizontalContainerRef = useRef(null);
    const verticalContainerRef = useRef(null);


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


    useEffect(() => {
        if (!presenting) {
            const setOffsetHander = () => {
                const offsetTop = -verticalContainerRef.current.offsetTop;
                const objectWidth = horizontalContainerRef.current.scrollWidth;
                let dynamicHeight = objectWidth - window.innerWidth + window.innerHeight;
                setDynamicHeight(dynamicHeight);
                setTranslateX(offsetTop);
            }
    
            window.addEventListener("scroll", setOffsetHander);
            return () => { 
                window.removeEventListener("scroll", setOffsetHander);
            }
        }
    }, [props.width, props.height, presenting]);

    const createRow = (images) => {
        return images.map((image, index) => <img className="Masonry-image" style={{ height: (props.height *.75) / props.rows }} src={image.url} key={index} />);
    }

    let rows = data.map((row, index) => <div className="Masonry-row" key={index}>{createRow(row)}</div>); 

    if (rows.length === 0 || presenting) {
        return <Loader />
    } else {
        return (<div className="Masonry" style={{height: dynamicHeight + "px"}}>
                <div className="Masonry-sticky" ref={verticalContainerRef}>
                    <div className="Masonry-horizontal" style={{ transform: "translateX(" + translateX +"px)" }} ref={horizontalContainerRef}>
                        {rows}
                    </div>
                </div>
            </div>);
    }
}

export default Masonry;
