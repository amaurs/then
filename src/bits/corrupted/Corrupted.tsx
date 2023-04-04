import React, { useRef, useEffect, useState, useContext } from 'react'
import * as THREE from 'three'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass.js'
import './Corrupted.css'
import escudo from '../../assets/escudo.png'
import { useTimeout } from '../../Hooks.js'
import Loader from '../../Presentation.js'
import { colorMatrixShader } from '../../util/three/shaders'

import { ThemeContext } from '../../ThemeContext.js'
import CSS from 'csstype'

interface Props {
    title: string
    delay: number
    style: CSS.Properties
    width: number
    height: number
}

const Corrupted = (props: Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    const [presenting, setPresenting] = useState(props.delay > 0)
    const theme = useContext(ThemeContext)

    useTimeout(() => {
        setPresenting(false)
    }, props.delay)

    useEffect(() => {
        if (!presenting) {
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas.current,
            })
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setClearColor(0x000000)

            const glitchPass = new GlitchPass()
            glitchPass.goWild = false
            const magentaPass = new ShaderPass(
                colorMatrixShader(theme.theme.colorMatrix)
            )

            const copyPass = new ShaderPass(CopyShader)
            copyPass.renderToScreen = true
            const parameters = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                stencilBuffer: true,
            }

            let renderTarget

            renderer.setSize(props.width, props.width)
            renderTarget = new THREE.WebGLRenderTarget(
                props.width,
                props.width,
                parameters
            )

            const composer = new EffectComposer(renderer, renderTarget)

            const texture = new THREE.TextureLoader().load(escudo)

            const texturePass = new TexturePass(texture)

            composer.addPass(texturePass)
            composer.addPass(glitchPass)
            composer.addPass(glitchPass)
            composer.addPass(magentaPass)
            composer.addPass(copyPass)

            let timeoutId: any

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
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
    }, [props.width, props.height, presenting, theme])

    let style = {}

    if (presenting) {
        return <Loader title={props.title} />
    } else {
        return (
            <canvas
                className="Corrupted"
                style={{ ...props.style, ...style }}
                ref={canvas}
            />
        )
    }
}

export default Corrupted
