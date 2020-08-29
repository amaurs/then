import React, { useState, useEffect, useRef } from 'react';
import './Masonry.css'

import Loader from './Presentation.js';

import { useTimeout } from './Hooks.js';
import { getRandomInt } from './util.js';


const Masonry = (props) => {

    const [data, setData] = useState([]);
    const [current, setCurrent] =  useState(null);
    const [presenting, setPresenting] = useState(props.delay>0);

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    const [dynamicHeight, setDynamicHeight] = useState(5546)
    const [translateX, setTranslateX] = useState(0)

    const horizontalContainerRef = useRef(null);
    const verticalContainerRef = useRef(null);

    useEffect(() => {
        let cancel = false;
        const fetchImages = async (url, rowNumber) => {
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
                    let rows = [...Array(rowNumber)].map(() => []);
                    json["images"].map((image, index) => {
                        rows[index % rowNumber].push(image);
                    });
                    setData(rows);
                }  
            } catch (error) {
                console.log("Call to order endpoint failed.", error)
            }
        }
        fetchImages(props.url, props.rows);
        return () => cancel=true;
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

    if (rows.length === 0 && presenting) {
        return <Loader title={props.title}/>
    } else {
        return (
            <div className="Masonry" style={{height: dynamicHeight + "px"}}>
                <div className="Masonry-sticky" ref={verticalContainerRef}>
                    <div className="Masonry-horizontal" style={{ transform: "translateX(" + translateX +"px)" }} ref={horizontalContainerRef}>
                        {rows}
                    </div>
                </div>
            </div>
        );
    }
}

export default Masonry;
