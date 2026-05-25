import React, { useEffect, useState, useRef, useContext } from 'react'
import { Environment, map } from '../../rl/windyGridworld.js'
import Controller from '../../rl/controller'
import { Agent } from '../../rl/sarsaAgent.js'
import './Reinforcement.css'
import { useTimeout, useAnimationLoop } from '../../Hooks'
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
    const [presenting, setPresenting] = useState(props.delay > 0)

    useTimeout(() => {
        setPresenting(false)
    }, props.delay)

    useAnimationLoop(!presenting && board !== null ? 24 : null, () => {
        controller.tick()
        setBoard(controller.toBoard())
    })

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
