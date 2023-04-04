import React, { useState, useRef, useContext, useEffect } from 'react'
import { useTimeout } from '../../Hooks.js'
import './Mandelbrot.css'
import Loader from '../../Presentation.js'
import myMandelbrot from '../../assets/mandelbrot-small.png'
import { ThemeContext } from '../../ThemeContext.js'

import CSS from 'csstype'

interface Props {
    title: string
    delay: number
    style: CSS.Properties
    width: number
    height: number
}

const wikipedia: Map<number, Array<number>> = new Map([
    [0, [66, 30, 15]],
    [1, [25, 7, 26]],
    [2, [9, 1, 47]],
    [3, [4, 4, 73]],
    [4, [0, 7, 100]],
    [5, [12, 44, 138]],
    [6, [24, 82, 177]],
    [7, [57, 125, 209]],
    [8, [134, 181, 229]],
    [9, [211, 236, 248]],
    [10, [241, 233, 191]],
    [11, [248, 201, 95]],
    [12, [255, 170, 0]],
    [13, [204, 128, 0]],
    [14, [153, 87, 0]],
    [15, [106, 52, 3]],
])

const magentaToBlack: Map<number, Array<number>> = new Map([
    [0, [255, 0, 255]],
    [1, [238, 0, 238]],
    [2, [221, 0, 221]],
    [3, [204, 0, 204]],
    [4, [187, 0, 187]],
    [5, [170, 0, 170]],
    [6, [153, 0, 153]],
    [7, [136, 0, 136]],
    [8, [119, 0, 119]],
    [9, [102, 0, 102]],
    [10, [85, 0, 85]],
    [11, [68, 0, 68]],
    [12, [51, 0, 51]],
    [13, [34, 0, 34]],
    [14, [17, 0, 17]],
    [15, [0, 0, 0]],
])

const magentaToWhite: Map<number, Array<number>> = new Map([
    [0, [255, 0, 255]],
    [1, [255, 17, 255]],
    [2, [255, 34, 255]],
    [3, [255, 51, 255]],
    [4, [255, 68, 255]],
    [5, [255, 85, 255]],
    [6, [255, 102, 255]],
    [7, [255, 119, 255]],
    [8, [255, 136, 255]],
    [9, [255, 153, 255]],
    [10, [255, 170, 255]],
    [11, [255, 187, 255]],
    [12, [255, 204, 255]],
    [13, [255, 221, 255]],
    [14, [255, 238, 255]],
    [15, [255, 255, 255]],
])

const apple: Map<number, Array<number>> = new Map([
    [0, [0, 0, 0]],
    [1, [100, 45, 164]],
    [2, [62, 55, 116]],
    [3, [200, 78, 232]],
    [4, [66, 74, 22]],
    [5, [203, 110, 45]],
    [6, [128, 128, 128]],
    [7, [226, 171, 190]],
    [8, [41, 85, 66]],
    [9, [128, 128, 128]],
    [10, [74, 150, 233]],
    [11, [189, 181, 243]],
    [12, [94, 191, 59]],
    [13, [193, 201, 142]],
    [14, [162, 212, 192]],
    [15, [255, 255, 255]],
])

const amau: Map<number, Array<number>> = new Map([
    [0, [238, 187, 175]],
    [1, [159, 152, 144]],
    [2, [81, 75, 77]],
    [3, [204, 156, 50]],
    [4, [233, 230, 225]],
])

let colors: Map<number, Array<number>>

const Mandelbrot = (props: Props) => {
    const mount = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    const theme = useContext(ThemeContext)
    const [presenting, setPresenting] = useState(false)

    const [imageData, setImageData] = useState<ImageData | undefined>(undefined)

    useTimeout(() => {
        setPresenting(false)
    }, props.delay)

    useEffect(() => {
        let cancel = false

        if (props.width > 0 && props.height > 0 && !presenting) {
            const onLoad = (event: Event) => {
                if (!cancel) {
                    const canvas: HTMLCanvasElement =
                        document.createElement('canvas')
                    let imageTarget = event.currentTarget as HTMLImageElement
                    canvas.width = imageTarget.width
                    canvas.height = imageTarget.height
                    let context = canvas.getContext('2d')
                    context!.drawImage(image, 0, 0)
                    let frame: ImageData = context!.getImageData(
                        0,
                        0,
                        image.width,
                        image.height
                    )
                    setImageData(frame)
                }
            }
            let image = new Image()
            image.src = myMandelbrot
            image.onload = onLoad
        }

        return () => {
            cancel = true
        }
    }, [props.width, props.height, presenting])

    useEffect(() => {
        if (imageData !== undefined) {
            let tick = 0
            let timeoutId: any

            // TODO: Move this declaration to the Theme file when that is ported to typescript.

            if (theme.theme.name === 'light') {
                colors = wikipedia
            } else if (theme.theme.name === 'dark') {
                colors = apple
            } else if (theme.theme.name === 'konami') {
                colors = magentaToWhite
            }

            const animate = () => {
                // Wrapping the animation function wiht a timeout makes it
                // possible to control the fps, without losing the benefits of
                // requestAnimationFrame.
                timeoutId = setTimeout(function () {
                    let canvas = mount.current

                    canvas.width = imageData!.width
                    canvas.height = imageData!.height
                    const context2: CanvasRenderingContext2D =
                        mount.current.getContext('2d')!
                    let frame = context2.createImageData(imageData!)
                    for (
                        let i = 0;
                        i < imageData!.width * imageData!.height * 4;
                        i += 4
                    ) {
                        let n = imageData!.data[i]

                        // This should not be a constant, this value is the module
                        // of the complex number after it just escaped to infinity.

                        let module = Math.sqrt(5)
                        let logAbs = Math.log(module)
                        let logTwo = Math.log(2.0)
                        let aux = Math.log(logAbs) / logTwo
                        let continuous = 1.0 + n * 1.0 - aux
                        let index = Math.floor(continuous)
                        let a: Array<number> | undefined = colors.get(
                            (index + tick) % colors.size
                        )
                        let b: Array<number> | undefined = colors.get(
                            (index + 1 + tick) % colors.size
                        )
                        let p = 1 - (continuous - index)
                        let red = Math.floor(p * a![0] + (1 - p) * b![0])
                        let green = Math.floor(p * a![1] + (1 - p) * b![1])
                        let blue = Math.floor(p * a![2] + (1 - p) * b![2])
                        frame.data[i] = red
                        frame.data[i + 1] = green
                        frame.data[i + 2] = blue
                        frame.data[i + 3] = 255
                    }
                    context2.putImageData(frame, 0, 0)
                    tick = tick + 1
                    frameId = requestAnimationFrame(animate)
                }, 1000 / 8)
            }

            let frameId: number | null = requestAnimationFrame(animate)
            return () => {
                cancelAnimationFrame(frameId!)
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId)
                frameId = null
            }
        }
    }, [imageData, theme])

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
                className="Mandelbrot"
                ref={mount}
                style={{ ...props.style, ...style }}
            />
        )
    }
}

export default Mandelbrot
