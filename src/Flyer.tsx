import React, { useState, useEffect, useRef, useContext, Fragment } from 'react'
import faunita from './assets/faunita-small.jpg'
import * as THREE from 'three'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'

import { colorMatrixShader, ditherShader } from './util/three/shaders'

import './Flyer.css'

interface Data {
    message: string
    date: string
    url: string
    title: string
    registry: string
    address: Array<string>
}

const banditHost = process.env.REACT_APP_API_HOST
/**
const Flyer = () => {

    const [data, setData] = useState<Data | undefined>(undefined);

    useEffect(() => {
        let cancel = false
        const fetchPost = async (url: string) => {
            try {
                let payload = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                let response = await fetch(url, payload)
                let json = await response.json()

                if (!cancel) {
                    setData(json)
                }
            } catch (error) {
                console.log('Call to post endpoint failed.', error)
            }
        }
        fetchPost(`${banditHost}/flyer`)
        return () => {
            cancel = true
        }
    }, [])


    if (data === undefined) {
        return null
    }

    return (
        <div className="Column">
            <h1>Flyer</h1>
            <p>{data.message}</p>
            <p>{data.date}</p>
            <div>{data.address.map((s, i) => <p key={i}>{s}</p>)}</div>

            <div className="Flyer-image">
                <svg width="100%" height="100%">
                    <defs>
                        <filter id="color">
                            <feColorMatrix
                                type="matrix"
                                values={[
                                    0.2126, 0.7152, 0.0722, 0, 1, 
                                    0.2126, 0.7152, 0.0722, 0, 0, 
                                    0.2126, 0.7152, 0.0722, 0, 1, 
                                    0,      0,      0,      1, 0,
                                ].join(' ')}
                            />
                        </filter>
                    </defs>

                    <image
                        href={faunita}
                        width="100%"
                        height="100%"
                        filter="url(#color)"
                    />
                </svg>
            </div>
        </div>
    )
}

export default Flyer
 */

const width = 512 * 3
const height = 338 * 3

const Flyer = () => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement('canvas'))

    const [data, setData] = useState<Data | undefined>(undefined)

    useEffect(() => {
        let cancel = false
        const fetchPost = async (url: string) => {
            try {
                let payload = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                let response = await fetch(url, payload)
                let json = await response.json()

                if (!cancel) {
                    setData(json)
                }
            } catch (error) {
                console.log('Call to post endpoint failed.', error)
            }
        }
        fetchPost(`${banditHost}/flyer`)
        return () => {
            cancel = true
        }
    }, [])

    useEffect(() => {
        if (true) {
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas.current,
            })
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setClearColor(0x000000)

            const magentaPass = new ShaderPass(
                colorMatrixShader([
                    0.2126, 0.7152, 0.0722, 0, 0.98431372549, 
                    0.2126, 0.7152, 0.0722, 0, 0.60784313725,
                    0.2126, 0.7152, 0.0722, 0, 0.81960784313, 
                    0, 0, 0, 1, 0,
                ])
            )

            const ditherPass = new ShaderPass(
                ditherShader(width, height, 3)
            )


            const dotScreenPass = new DotScreenPass(
                new THREE.Vector2(0.5, 0.5),
                8.57,
                0.8
            )

            const copyPass = new ShaderPass(CopyShader)
            copyPass.renderToScreen = true
            const parameters = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                stencilBuffer: true,
            }

            let renderTarget

            renderer.setSize(width, height)
            renderTarget = new THREE.WebGLRenderTarget(
                width,
                height,
                parameters
            )

            const composer = new EffectComposer(renderer, renderTarget)
            const texture = new THREE.TextureLoader().load(faunita)
            const texturePass = new TexturePass(texture)

            composer.addPass(texturePass)
            composer.addPass(ditherPass)
            composer.addPass(magentaPass)
            composer.addPass(copyPass)

            let timeoutId: any

            const animate = () => {
                timeoutId = setTimeout(function () {
                    composer.render()
                    frameId = requestAnimationFrame(animate)
                }, 0)
            }

            let frameId: number | null = requestAnimationFrame(animate)

            return () => {
                cancelAnimationFrame(frameId!)
                frameId = null
            }
        }
    }, [])

    if (data === undefined) {
        return null
    }

    return (
        <div className="Flyer">
            <div className="Info">
                <h1>{data.title}</h1>
                <div>
                    <p>{data.message}</p>
                </div>
                <div>
                    <p>{data.date}</p>
                </div>
                <div>
                    <p><a href={data.url}>{data.registry}</a></p>
                </div>
                <div className='address'>
                    {data.address.map((s, i) => (
                        <p key={i}>{s}</p>
                    ))}
                </div>
            </div>
            <div className="Flowers">
                <canvas ref={canvas} />
            </div>
        </div>
    )
}

export default Flyer
