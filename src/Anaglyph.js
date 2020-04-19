import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three-full';
import AnaglyphSVGRenderer from './AnaglyphSVGRenderer.js';
import './Anaglyph.css'
import { useTimeout } from './Hooks.js';
import Loader from './Presentation.js';

const Anaglyph = (props) => {
    let mount = useRef();
    let [presenting, setPresenting] = useState(true);
    const [data, setData] = useState({points: [], hasFetched: true});

    useTimeout(() => {
        setPresenting(false);
    }, props.delay);

    useEffect(() => {
        let cancel = false;
        const fetchCitiesSolution = async (url) => {
            try {
                let payload = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({point_set: "moebius", n_cities: "1000"})
                };

                let response = await fetch(url, payload);
                let json = await response.json();
                if (!cancel) {
                    setData({points: json, hasFetched: true})
                }  
            } catch (error) {
                console.log("Call to order endpoint failed.", error)
            }
        }
        fetchCitiesSolution(props.url);
        return () => cancel=true;
    }, [props.url]);

    useEffect(() => {
        if (data.points.length > 0 && props.width > 0 && props.height > 0 && !presenting) {
            const vertices = data.points;
            const width = props.width;
            const height =props.height;
            const material = new THREE.LineBasicMaterial({ color: 0x000000, 
                                                           linewidth: 2,
                                                           opacity: 1 });
            const scene = new THREE.Scene()
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000 )
            camera.position.z = 4
            const renderer = new AnaglyphSVGRenderer(width, height);
            renderer.setClearColor(0xffffff, 0.0);
            mount.current.appendChild(renderer.domElement)
            let geometry = new THREE.BufferGeometry();
    
            geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    
            let line = new THREE.Line( geometry, material );
                  
            scene.add(line);
    
            const renderScene = () => {
                renderer.render(scene, camera);
            }
    
            const animate = () => {
                line.rotation.x += 0.01;
                line.rotation.y += 0.01;
                renderScene();
                frameId = requestAnimationFrame(animate);
            }
    
            let frameId = requestAnimationFrame(animate);
            return () => {
                cancelAnimationFrame(frameId);
                frameId = null;
                scene.remove(line);
                geometry.dispose();
                material.dispose();
            }  
        }

    }, [data, props.width, props.height, presenting]);

    if (presenting) {
        return <Loader title={props.title}/>
    } else {
        return (
            <div className="Anaglyph"
                 ref={mount} >
            </div>
        );
    }    
}

export default Anaglyph;
