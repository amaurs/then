import React, { useRef, useState, useEffect } from 'react';

import * as THREE from 'three-full';

import AnaglyphSVGRenderer from './AnaglyphSVGRenderer.js';
import './Anaglyph.css'

const Anaglyph = (props) => {

    let mount = useRef();


    const [data, setData] = useState({points: [], hasFetched: true});

    useEffect(() => {
         // TODO: This function needs memoizing. Right now it is calling the service on every mount.
         console.log("Fetching...");
         fetch(props.url, {

            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({point_set: "moebius", n_cities: "1000"})
          })
          .then(response => {
            return response.json();
          }).then(json => {
            setData({points: json, hasFetched: true})
          });

    }, [props]);
    

    useEffect(() => {
        if (data.points.length > 0) {
            const vertices = data.points;
            const width = mount.current.clientWidth;
            const height = mount.current.clientHeight;
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

    }, [data]);

    return (
            <div
                className="Anaglyph"
                ref={mount}
            >
            </div>
    );
}

export default Anaglyph;