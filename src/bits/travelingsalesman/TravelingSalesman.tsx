import React, { useRef, useState, useEffect, useContext } from 'react'
import { useTimeout } from '../../Hooks.js'
import Loader from '../../Presentation.js'
import './TravelingSalesman.css'

import { ThemeContext } from '../../ThemeContext.js'

import CSS from 'csstype'

import { Cities } from '../../util/interface'

interface Props {
    title: string
    delay: number
    style: CSS.Properties
    width: number
    height: number
    url: string
    cities: Cities
    squareSampling: number
    numberColors: number
}

const TravelingSalesman = (props: Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    const theme = useContext(ThemeContext)
    const [presenting, setPresenting] = useState(props.delay > 0)

    useTimeout(() => {
        setPresenting(false)
    }, props.delay)

    useEffect(() => {
        if (props.cities.cities.length > 0 && !presenting) {
            let n = 0
            let timeoutId: any

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function () {
                    const maxBound = (time: number, size: number) => {
                        let t = time % (2 * size)
                        if (t < size) {
                            return t
                        } else {
                            return size
                        }
                    }
                    const minBound = (time: number, size: number) => {
                        let t = time % (2 * size)
                        if (t < size) {
                            return 0
                        } else {
                            return time % size
                        }
                    }
                    let min = minBound(n, props.numberColors + 1)
                    let max = maxBound(n, props.numberColors + 1)
                    let citiesToDraw = props.cities.cities.slice(
                        min * 2,
                        max * 2
                    )

                    const context: CanvasRenderingContext2D =
                        canvas.current.getContext('2d')!
                    const width = canvas.current.width
                    const height = canvas.current.height
                    context.save()
                    context.clearRect(0, 0, width, height)
                    context.fillStyle = theme.theme.background
                    context.fillRect(0, 0, width, height)
                    context.beginPath()
                    context.strokeStyle = theme.theme.middleground
                    context.lineWidth = 5
                    for (let i = 0; i < citiesToDraw.length; i += 2) {
                        context.lineTo(
                            Math.floor(
                                (width * citiesToDraw[i]) / props.squareSampling
                            ),
                            Math.floor(
                                (height * citiesToDraw[i + 1]) /
                                    props.squareSampling
                            )
                        )
                    }
                    context.stroke()
                    n += 1
                    frameId = requestAnimationFrame(animate)
                }, 1000 / 60)
            }

            let frameId: number | null = requestAnimationFrame(animate)
            return () => {
                cancelAnimationFrame(frameId!)
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId)
                frameId = null
            }
        }
    }, [
        props.cities,
        props.squareSampling,
        props.numberColors,
        presenting,
        theme,
    ])

    let style = {}

    if (props.width > 0 && props.height > 0) {
        style =
            props.width / props.height < 1
                ? { width: '100%' }
                : { height: '100%' }
    }

    let minSize = props.width / props.height < 1 ? props.width : props.height

    if (props.cities.cities.length >= 0 && !presenting) {
        return (
            <canvas
                ref={canvas}
                style={{ ...props.style, ...style }}
                width={minSize}
                height={minSize}
                className="TravelingSalesman"
            />
        )
    } else {
        return <Loader title={props.title} />
    }
}

export default TravelingSalesman
