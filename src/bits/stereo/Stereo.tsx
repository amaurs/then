import React, { useState, useEffect, useRef, useContext } from 'react'
import './Stereo.css'
import Loader from '../../Presentation'
import { useTimeout, useAnimationLoop } from '../../Hooks'
import { getRandomInt, colorImageData } from '../../utils'

import left from '../../assets/2019/left.jpg'
import right from '../../assets/2019/right.jpg'
import { ThemeContext } from '../../ThemeContext'

import CSS from 'csstype'

interface Props {
    title: string
    delay: number
    style: CSS.Properties
    width: number
    height: number
}

const Stereo = (props: Props) => {
    const mount = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    const [data, setData] = useState(null)
    const [current, setCurrent] = useState(null)
    const [frames, setFrames] = useState<Array<ImageData> | undefined>(
        undefined
    )
    const theme = useContext(ThemeContext)

    const [presenting, setPresenting] = useState(props.delay > 0)

    useTimeout(() => {
        setPresenting(false)
    }, props.delay)

    useEffect(() => {
        if (theme) {
            let cancel = false
            const getData = (src: string): Promise<ImageData> => {
                return new Promise((resolve, reject) => {
                    let img = new Image()
                    img.onload = (event: Event) => {
                        let image = event.currentTarget as HTMLImageElement
                        let canvas = document.createElement('canvas')
                        canvas.width = image.width
                        canvas.height = image.height
                        const context: CanvasRenderingContext2D =
                            canvas.getContext('2d')!
                        context.drawImage(image, 0, 0)
                        resolve(
                            context.getImageData(
                                0,
                                0,
                                image.width,
                                image.height
                            )
                        )
                    }
                    img.onerror = reject
                    img.src = src
                })
            }

            Promise.all([getData(left), getData(right)]).then(function (
                frames: Array<ImageData>
            ) {
                if (!cancel) {
                    setFrames(
                        frames.map((frame) => {
                            return colorImageData(
                                frame,
                                theme.theme.colorMatrix
                            )
                        })
                    )
                    console.log('Promise is fullfiled.')
                }
            })
            return () => {
                cancel = true
            }
        }
    }, [theme])

    const tickRef = useRef(0)
    useEffect(() => {
        tickRef.current = 0
    }, [frames, presenting])

    const stereoRunning = frames !== undefined && !presenting
    useAnimationLoop(stereoRunning ? 8 : null, () => {
        let canvas = mount.current
        canvas.width = frames![0].width
        canvas.height = frames![0].height
        const context: CanvasRenderingContext2D =
            mount.current.getContext('2d')!
        context.putImageData(frames![tickRef.current % frames!.length], 0, 0)
        tickRef.current += 1
    })

    let style = {}
    if (props.width > 0 && props.height > 0) {
        style =
            props.width / props.height < 1
                ? { width: '100vw' }
                : { height: '100vh' }
    }

    if (presenting) {
        return <Loader title={props.title} />
    } else {
        return (
            <canvas
                className="Stereo"
                ref={mount}
                style={{ ...props.style, ...style }}
            />
        )
    }
}

export default Stereo
