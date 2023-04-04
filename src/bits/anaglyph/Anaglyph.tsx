import React, { useRef, useState, useEffect, useContext } from 'react'
import * as THREE from 'three'
import AnaglyphSVGRenderer from './AnaglyphSVGRenderer.js'
import './Anaglyph.css'
import { useTimeout } from '../../Hooks.js'
import Loader from '../../Presentation.js'
import { ThemeContext } from '../../ThemeContext.js'

import { Points } from '../../util/interface'

interface Props {
    title: string
    delay: number
    style: object
    width: number
    height: number
    anaglyphData: Points
}

const Anaglyph = (props: Props) => {
    let div = useRef<HTMLDivElement>(document.createElement('div'))
    const [presenting, setPresenting] = useState(props.delay > 0)
    const theme = useContext(ThemeContext)

    useTimeout(() => {
        setPresenting(false)
    }, props.delay)

    useEffect(() => {
        if (
            props.anaglyphData.points.length > 0 &&
            props.width > 0 &&
            props.height > 0 &&
            !presenting
        ) {
            const vertices = props.anaglyphData.points
            const width = props.width
            const height = props.height
            const material = new THREE.LineBasicMaterial({
                color: 0x000000,
                linewidth: 2,
                opacity: 1,
            })
            const scene = new THREE.Scene()
            const camera = new THREE.PerspectiveCamera(
                75,
                width / height,
                0.1,
                1000
            )
            camera.position.z = 4
            const renderer = new AnaglyphSVGRenderer(width, height)
            if (theme.theme.name === 'konami') {
                renderer.setLeftColor(new THREE.Color(1, 0, 1))
                renderer.setRightColor(new THREE.Color(1, 0, 1))
            } else if (theme.theme.name === 'light') {
                renderer.setLeftColor(new THREE.Color(1, 0, 0))
                renderer.setRightColor(new THREE.Color(0, 1, 1))
            } else {
                renderer.setLeftColor(new THREE.Color(1, 0, 1))
                renderer.setRightColor(new THREE.Color(0, 1, 0))
            }
            renderer.setClearColor(0xffffff, 0.0)
            if (div.current.childNodes.length > 0) {
                div.current.removeChild(div.current.childNodes[0])
            }
            div.current.appendChild(renderer.domElement)
            let geometry = new THREE.BufferGeometry()

            geometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(vertices, 3)
            )

            let line = new THREE.Line(geometry, material)

            scene.add(line)

            const renderScene = () => {
                renderer.render(scene, camera)
            }

            let timeoutId: any

            const animate = () => {
                timeoutId = setTimeout(function () {
                    line.rotation.x += 0.01
                    line.rotation.y += 0.01
                    renderScene()
                    frameId = requestAnimationFrame(animate)
                }, 1000 / 60)
            }

            let frameId: number | null = requestAnimationFrame(animate)
            return () => {
                cancelAnimationFrame(frameId!)
                frameId = null
                clearTimeout(timeoutId)
                scene.remove(line)
                geometry.dispose()
                material.dispose()
            }
        }
    }, [props.anaglyphData, props.width, props.height, presenting, theme])

    let style = {}

    if (presenting) {
        return <Loader title={props.title} />
    } else {
        return (
            <div
                className="Anaglyph"
                style={{ ...props.style, ...style }}
                ref={div}
            ></div>
        )
    }
}

export default Anaglyph
