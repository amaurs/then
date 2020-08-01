import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three-full';
import AnaglyphSVGRenderer from './AnaglyphSVGRenderer.js';
import './Anaglyph.css'
import { useTimeout } from './Hooks.js';
import Loader from './Presentation.js';
import hilbert_cube_8 from './assets/hilbert_cube_8_8.png';
import hilbert_square_8 from './assets/hilbert_square_8_8.png';
import hilbert_cube_64 from './assets/hilbert_cube_64_64.png';
import hilbert_square_64 from './assets/hilbert_square_64_64.png';
import hilbert_cube_512 from './assets/hilbert_cube_512_512.png';
import hilbert_square_512 from './assets/hilbert_square_512_512.png';
import hilbert_cube_4096 from './assets/hilbert_cube_4096_4096.png';
import hilbert_square_4096 from './assets/hilbert_square_4096_4096.png';


const image_cube_map = {8: hilbert_cube_8,
                        64: hilbert_cube_64,
                        512: hilbert_cube_512,
                        4096: hilbert_cube_4096};

const res = 8;

const Anaglyph = (props) => {
    let mount = useRef();
    let [presenting, setPresenting] = useState(true);
    const [data, setData] = useState({points: [], hasFetched: true});
    let [color, setColor] = useState(null);

    useTimeout(() => {
        setPresenting(false);
    }, 0);

    useEffect(() => {
        let cancel = false;



        let hilbert_cube = image_cube_map[res];

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

        const getData = (src) => {
            return new Promise ((resolve, reject) => {
                let img = new Image();
                img.onload = (event) => {
                    let image = event.target;
                    let canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    let context = canvas.getContext('2d');
                    context.drawImage(image, 0, 0);
                    resolve(context.getImageData(0, 0, image.width, image.height))
                }
                img.onerror = reject
                img.src = src
            });
        }

        getData(hilbert_cube).then(imageData => {
            setColor(imageData);
        })


        return () => cancel=true;
    }, [props.url]);

    useEffect(() => {
        if (color !== null && data.points.length > 0 && props.width > 0 && props.height > 0 && !presenting) {
            const vertices = data.points;
            const width = props.width;
            const height =props.height;
            const material = new THREE.LineBasicMaterial({ color: 0x000000, 
                                                           linewidth: 2,
                                                           opacity: 1 });
            const scene = new THREE.Scene()
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000 )
            camera.position.z = 500;
            //const renderer = new AnaglyphSVGRenderer(width, height);
            //const renderer = new THREE.WebGLRenderer({ antialias: true });
            const renderer = new THREE.WebGLRenderer({ canvas: mount.current, antialias: true });
            renderer.setSize(width, height);

            renderer.setClearColor(0xffffff, 1.0);
            //mount.current.appendChild(renderer.domElement)
            let geometry = new THREE.BufferGeometry();

            let colorVertices = [];

            for (let i = 0; i < res * res * 4; i++) {
                colorVertices.push(color.data[i * 4 + 0] - 128);
                colorVertices.push(color.data[i * 4 + 1] - 128);
                colorVertices.push(color.data[i * 4 + 2] - 128);
            }

    
            geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( colorVertices, 3 ) );
    
            let line = new THREE.Line( geometry, material );
                  
            scene.add(line);
    
            const renderScene = () => {
                renderer.render(scene, camera);
            }
    
            const animate = () => {
                line.rotation.x += 0.01;
                line.rotation.y += 0.01;
                line.rotation.z += 0.01;
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

    }, [color, data, props.width, props.height, presenting]);

    if (presenting) {
        return <Loader title={props.title}/>
    } else {
        return (
            <canvas
                className="Anaglyph"
                ref={mount}
                width={1080}
                height={1080}
            />
        );
    }    
}

export default Anaglyph;
