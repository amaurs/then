import React, { useRef, useState, useEffect, useContext } from 'react'
import { colorToString, invertColor, colorToGrayscale } from '../../utils'
import { useTimeout, useAnimationLoop } from '../../Hooks'
import Loader from '../../Presentation'
import CSS from 'csstype'
import { ThemeContext } from '../../ThemeContext'
import './Colors.css'

interface Props {
    title: string
    delay: number
    style: CSS.Properties
    width: number
    height: number
    colors: number[]
}

const Colors = (props: Props) => {
    const canvas = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    const theme = useContext(ThemeContext)
    const [presenting, setPresenting] = useState(props.delay > 0)

    useTimeout(() => {
        setPresenting(false)
    }, props.delay)

    const nRef = useRef(0)
    useEffect(() => {
        nRef.current = 0
    }, [props.colors, presenting, theme])

    const colorsRunning = props.colors.length > 0 && !presenting
    useAnimationLoop(colorsRunning ? 10 : null, () => {
        const n = nRef.current
        let color = [
            props.colors[(n % (props.colors.length / 3)) * 3],
            props.colors[(n % (props.colors.length / 3)) * 3 + 1],
            props.colors[(n % (props.colors.length / 3)) * 3 + 2],
        ]

        const context: CanvasRenderingContext2D =
            canvas.current.getContext('2d')!
        const width = canvas.current.width
        const height = canvas.current.height
        context.save()
        context.clearRect(0, 0, width, height)
        if (theme.theme.name === 'konami') {
            let luminance = colorToGrayscale(color[0], color[1], color[2])
            context.fillStyle = colorToString(255, luminance, 255)
            context.fillRect(0, 0, width, height)
            context.fillStyle = colorToString(255, 255 - luminance, 255)
            context.fillRect(
                (width * (1 - Math.sqrt(2) / 2)) / 2,
                (height * (1 - Math.sqrt(2) / 2)) / 2,
                width / Math.sqrt(2),
                height / Math.sqrt(2)
            )
        } else {
            context.fillStyle = colorToString(color[0], color[1], color[2])
            context.fillRect(0, 0, width, height)
            context.fillStyle = invertColor(color[0], color[1], color[2])
            context.fillRect(
                (width * (1 - Math.sqrt(2) / 2)) / 2,
                (height * (1 - Math.sqrt(2) / 2)) / 2,
                width / Math.sqrt(2),
                height / Math.sqrt(2)
            )
        }

        nRef.current += 1
    })

    let style = {}

    if (props.width > 0 && props.height > 0) {
        style =
            props.width / props.height < 1
                ? { width: props.width + 'px', height: props.width + 'px' }
                : { width: props.height + 'px', height: props.height + 'px' }
    }

    if (presenting) {
        return <Loader title={props.title} />
    } else {
        return (
            <canvas
                className="Colors"
                style={{ ...props.style, ...style }}
                ref={canvas}
            />
        )
    }
}

export default Colors
