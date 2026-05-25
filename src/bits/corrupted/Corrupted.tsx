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
import { useTimeout, useAnimationLoop } from '../../Hooks'
import Loader from '../../Presentation'
import { colorMatrixShader } from '../../util/three/shaders'

import { ThemeContext } from '../../ThemeContext'
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

    const tickRef = useRef(() => {})
    useEffect(() => {
        if (presenting) return
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas.current,
            preserveDrawingBuffer: true,
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
            format: THREE.RGBAFormat,
            stencilBuffer: true,
        }

        renderer.setSize(props.width, props.width)
        const renderTarget = new THREE.WebGLRenderTarget(
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

        tickRef.current = () => {
            composer.render()
        }
        return () => {
            tickRef.current = () => {}
        }
    }, [props.width, props.height, presenting, theme])

    useAnimationLoop(presenting ? null : 60, () => tickRef.current())

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
