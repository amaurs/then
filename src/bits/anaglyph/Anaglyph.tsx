import React, { useRef, useEffect, useContext } from 'react'
import * as THREE from 'three'
import AnaglyphSVGRenderer from './AnaglyphSVGRenderer.js'
import './Anaglyph.css'
import { ThemeContext } from '../../ThemeContext'

interface Props {
    title: string
    delay: number
    style: object
    width: number
    height: number
}

const Anaglyph = (props: Props) => {
    const div = useRef<HTMLDivElement>(document.createElement('div'))
    const theme = useContext(ThemeContext)

    useEffect(() => {
        if (props.width <= 0 || props.height <= 0) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            props.width / props.height,
            0.1,
            1000
        )
        camera.position.z = 4

        const renderer = new AnaglyphSVGRenderer(props.width, props.height)
        if (theme.theme.name === 'konami') {
            renderer.setLeftColor(new THREE.Color(1, 0, 1))
            renderer.setRightColor(new THREE.Color(1, 0, 1))
        } else if (theme.theme.name === 'light') {
            renderer.setLeftColor(new THREE.Color(1, 0, 0))
            renderer.setRightColor(new THREE.Color(0, 0, 1))
        } else {
            renderer.setLeftColor(new THREE.Color(1, 0, 1))
            renderer.setRightColor(new THREE.Color(0, 1, 0))
        }
        renderer.setClearColor(0xffffff, 0.0)

        if (div.current.childNodes.length > 0)
            div.current.removeChild(div.current.childNodes[0])
        div.current.appendChild(renderer.domElement)

        const curve = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 16)
        const edges = new THREE.EdgesGeometry(curve)
        const material = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 2,
            opacity: 1,
        })
        const line = new THREE.LineSegments(edges, material)
        scene.add(line)

        let frameId: number
        let timeoutId: any

        const animate = () => {
            timeoutId = setTimeout(() => {
                line.rotation.x += 0.01
                line.rotation.y += 0.01
                renderer.render(scene, camera)
                frameId = requestAnimationFrame(animate)
            }, 1000 / 60)
        }

        frameId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(frameId)
            clearTimeout(timeoutId)
            scene.remove(line)
            edges.dispose()
            curve.dispose()
            material.dispose()
        }
    }, [props.width, props.height, theme])

    return <div className="Anaglyph" style={{ ...props.style }} ref={div}></div>
}

export default Anaglyph
