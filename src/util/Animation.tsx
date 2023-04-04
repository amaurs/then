import React, { useRef, useState, useEffect, useContext } from 'react'
import { colorToInt } from '../tools'
import { useTimeout } from '../Hooks.js'
import Loader from '../Presentation.js'
import { ThemeContext } from '../ThemeContext.js'
import './Animation.css'

import CSS from 'csstype'

interface Props {
    title: string
    delay: number
    style: CSS.Properties
    width: number
    height: number
    cube: string | undefined
    square: string | undefined
    res: string
}

const Animation = (props: Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    let theme = useContext(ThemeContext)
    let [color, setColor] = useState<ImageData | undefined>(undefined)
    let [position, setPosition] = useState<ImageData | undefined>(undefined)
    const [presenting, setPresenting] = useState(props.delay > 0)

    useTimeout(() => {
        setPresenting(false)
    }, props.delay)

    useEffect(() => {
        let cancel = false

        console.log(props.cube)
        console.log(props.square)

        const getData = (src: string): Promise<ImageData> => {
            return new Promise((resolve, reject) => {
                let img = new Image()
                img.setAttribute('crossOrigin', '*')
                img.onload = (event: Event) => {
                    let canvas: HTMLCanvasElement =
                        document.createElement('canvas')
                    let image = event.target as HTMLImageElement
                    canvas.width = image.width
                    canvas.height = image.height
                    let context: CanvasRenderingContext2D =
                        canvas.getContext('2d')!
                    context.drawImage(image, 0, 0)
                    resolve(
                        context.getImageData(0, 0, image.width, image.height)
                    )
                }
                img.onerror = reject
                img.src = src
            })
        }

        getData(props.cube!).then((imageData: ImageData) => {
            if (!cancel) {
                console.log(imageData)
                setColor(imageData)
            }
        })

        getData(props.square!).then((imageData: ImageData) => {
            if (!cancel) {
                setPosition(imageData)
            }
        })

        return () => {
            cancel = true
        }
    }, [props.res])

    useEffect(() => {
        if (color !== undefined && position !== undefined && !presenting) {
            let count = 0
            let timeoutId: any

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function () {
                    const context: CanvasRenderingContext2D =
                        canvas.current.getContext('2d')!
                    context.imageSmoothingEnabled = false
                    let canvasWidth = canvas.current.width
                    let canvasHeight = canvas.current.height
                    context.clearRect(0, 0, canvasWidth, canvasHeight)
                    let frame = context.getImageData(
                        0,
                        0,
                        canvasWidth,
                        canvasHeight
                    )

                    let l = frame.data.length / 4

                    for (let i = 0; i < l; i++) {
                        let index = (i + count) % l

                        let r = position!.data[index * 4 + 0]
                        let g = position!.data[index * 4 + 1]
                        let b = position!.data[index * 4 + 2]
                        let j = colorToInt(r, g, b)

                        if (theme.theme.name == 'konami') {
                            frame.data[j * 4 + 0] = 255
                            frame.data[j * 4 + 1] = i * 4
                            frame.data[j * 4 + 2] = 255
                            frame.data[j * 4 + 3] = 255
                        } else if (theme.theme.name == 'light') {
                            frame.data[j * 4 + 0] = 255 - color!.data[i * 4 + 0]
                            frame.data[j * 4 + 1] = 255 - color!.data[i * 4 + 1]
                            frame.data[j * 4 + 2] = 255 - color!.data[i * 4 + 2]
                            frame.data[j * 4 + 3] = 255
                        } else {
                            frame.data[j * 4 + 0] = color!.data[i * 4 + 0]
                            frame.data[j * 4 + 1] = color!.data[i * 4 + 1]
                            frame.data[j * 4 + 2] = color!.data[i * 4 + 2]
                            frame.data[j * 4 + 3] = 255
                        }
                    }
                    context.putImageData(frame, 0, 0)

                    frameId = requestAnimationFrame(animate)
                    count += 512
                }, 1000 / 10)
            }

            let frameId: number | null = requestAnimationFrame(animate)
            return () => {
                cancelAnimationFrame(frameId!)
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId)
                frameId = null
            }
        }
    }, [color, position, presenting, theme])

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
                className="Animation"
                style={{ ...props.style, ...style }}
                width={props.res + 'px'}
                height={props.res + 'px'}
                ref={canvas}
            />
        )
    }
}

export default Animation
