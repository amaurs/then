import React, { useEffect, useState, useRef, useContext } from 'react'
import { Environment, map } from '../../rl/windyGridworld.js'
import Controller from '../../rl/controller'
import { Agent } from '../../rl/sarsaAgent.js'
import './Reinforcement.css'
import { useTimeout } from '../../Hooks.js'
import Loader from '../../Presentation.js'

import { ThemeContext } from '../../ThemeContext.js'

import CSS from 'csstype'

interface Props {
    title: string
    delay: number
    style: CSS.Properties
    width: number
    height: number
}

const environment = new Environment(
    map.height,
    map.width,
    map.boardPlan,
    map.wind,
    map.agent,
    map.goal
)
const agent = new Agent(
    environment.getNumberOfActions(),
    environment.getNumberOfStates()
)
const controller = new Controller(environment, agent)

function getIcon(key: string): string {
    const emojis: Map<string, string> = new Map([
        ['o', '🤖'],
        ['%', '🍺'],
        ['*', '🌹'],
        ['$', '🐯'],
    ])
    return emojis.get(key)!
}

export default function Reinforcement(props: Props) {
    const theme = useContext(ThemeContext)
    const squareSize =
        props.width / props.height < 1
            ? props.height / map.height / 2
            : props.width / map.width / 2
    let style = {
        height: squareSize + 'px',
        width: squareSize + 'px',
        fontSize: squareSize * 0.85 + 'px',
        color: 'magenta',
        textShadow: '0 0 0 magenta',
    }

    if (theme.theme.name == 'konami') {
        style = { ...style, color: 'transparent', textShadow: '0 0 0 magenta' }
    }

    const [board, setBoard] = useState(controller.toBoard())
    const requestRef = useRef<number | undefined>()
    const [presenting, setPresenting] = useState(props.delay > 0)

    useTimeout(() => {
        setPresenting(false)
    }, props.delay)

    useEffect(() => {
        let timeoutId: any
        let n = 0
        if (!presenting && board !== null) {
            const animate = () => {
                timeoutId = setTimeout(function () {
                    controller.tick()
                    setBoard(controller.toBoard())
                    n += 1
                    requestRef.current = requestAnimationFrame(animate)
                }, 1000 / 24)
            }
            requestRef.current = requestAnimationFrame(animate)
            return () => {
                cancelAnimationFrame(requestRef.current!)
                // It is important to clean up after the component unmounts.
                clearTimeout(timeoutId)
            }
        }
    }, [presenting, board])

    if (presenting) {
        return <Loader title={props.title} />
    } else {
        const rows = board.map((row: Array<string>, rowIndex: number) => (
            <div key={rowIndex}>
                {row.map((cell: string, cellIndex: number) => (
                    <div style={style} key={cellIndex}>
                        {getIcon(cell)}
                    </div>
                ))}
            </div>
        ))

        return (
            <div className="Reinforcement" style={{}}>
                {rows}
            </div>
        )
    }
}
