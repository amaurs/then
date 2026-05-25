import React, {
    MouseEvent,
    useState,
    useRef,
    useContext,
    useEffect,
} from 'react'
import { useAnimationLoop, useTimeout } from '../../Hooks'
import { colorMatrix } from '../../utils'
import Board from '../../Board'
import './Conway.css'
import Loader from '../../Presentation'

import { ThemeContext } from '../../ThemeContext'
import CSS from 'csstype'

interface Props {
    title: string
    delay: number
    style: CSS.Properties
    width: number
    height: number
}

let board = new Board(100, 100)

board.randomize()
//board.gliderGun(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), );
//board.gliderGun(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), );
//board.gliderGun(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), );
//board.gliderGun(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), );

const Conway = (props: Props) => {
    let ref = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    const theme = useContext(ThemeContext)
    const squareSize = 10
    const [drag, setDrag] = useState(false)
    const [position, setPosition] = useState([48 * squareSize, 48 * squareSize])
    const [offset, setOffset] = useState([0, 0])
    const square = [8 * squareSize, 3 * squareSize]
    const [presenting, setPresenting] = useState(props.delay > 0)
    const baseColor = [240, 165, 163, 1.0]

    useTimeout(() => {
        setPresenting(false)
    }, props.delay)

    useAnimationLoop(presenting ? null : 60, () => {
        board = board.getNextGeneration()
        let canvas = ref.current
        const context: CanvasRenderingContext2D = canvas.getContext('2d')!
        context.clearRect(0, 0, canvas.width, canvas.height)
        let colorProcessed = colorMatrix(baseColor, theme.theme.colorMatrix)
        board.printContext(
            context,
            squareSize,
            `rgba(${colorProcessed[0]}, ${colorProcessed[1]}, ${colorProcessed[2]}, ${colorProcessed[3]})`
        )
    })

    const handleOnMouseDown = (e: MouseEvent) => {
        let rect = ref.current.getBoundingClientRect()
        let x = Math.round((e.pageX - rect.left) / 10) * 10,
            y = Math.round((e.pageY - rect.top) / 10) * 10
        if (
            position[0] <= x &&
            x <= position[0] + square[0] &&
            position[1] <= y &&
            y <= position[1] + square[1]
        ) {
            setDrag(true)
            setOffset([x - position[0], y - position[1]])
        }
    }

    const handleOnMouseUp = (e: MouseEvent) => {
        setDrag(false)
    }

    const handleOnMouseMove = (e: MouseEvent) => {
        let rect = ref.current.getBoundingClientRect()

        if (drag) {
            let newX = Math.round((e.pageX - rect.left) / 10) * 10,
                newY = Math.round((e.pageY - rect.top) / 10) * 10
            setPosition([newX - offset[0], newY - offset[1]])
        }
    }

    const handleOnClick = (e: MouseEvent) => {
        let rect = ref.current.getBoundingClientRect()
        let x = Math.floor(Math.round((e.pageX - rect.left) / 10)),
            y = Math.floor(Math.round((e.pageY - rect.top) / 10))

        board.setXY(x, y, 1)
    }

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
                className="Conway"
                ref={ref}
                style={{ ...props.style, ...style }}
                width={1000}
                height={1000}
                onMouseDown={handleOnMouseDown}
                onMouseUp={handleOnMouseUp}
                onMouseMove={handleOnMouseMove}
                onClick={handleOnClick}
            />
        )
    }
}

export default Conway
