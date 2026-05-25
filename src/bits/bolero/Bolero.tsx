import React, { useEffect, useState, useRef, useContext } from 'react'
import { ThemeContext } from '../../ThemeContext'
import './Bolero.css'
import { useTimeout, useAnimationLoop } from '../../Hooks'
import Loader from '../../Presentation'
import CSS from 'csstype'

interface Props {
    title: string
    delay: number
    style: CSS.Properties
    width: number
    height: number
    sentence: string
}

export default function Bolero(props: Props) {
    let div = useRef<HTMLDivElement>(document.createElement('div'))
    const theme = useContext(ThemeContext)
    const [delay, setDelay] = useState(0)
    const [presenting, setPresenting] = useState(props.delay > 0)

    useTimeout(() => {
        setPresenting(false)
        setDelay(100)
    }, props.delay)

    const nRef = useRef(0)
    useEffect(() => {
        nRef.current = 0
    }, [props.sentence, presenting])

    const boleroRunning = props.sentence.length > 0 && !presenting
    useAnimationLoop(boleroRunning ? 5 : null, () => {
        console.log(props.sentence.slice(0, nRef.current))
        div.current.innerHTML = props.sentence.slice(0, nRef.current)
        nRef.current += 1
    })

    let style: CSS.Properties = {
        color: theme.theme.middleground,
        mixBlendMode: theme.theme.mixBlendMode as CSS.Property.MixBlendMode,
    }

    if (presenting) {
        return <Loader title={props.title} />
    } else {
        return (
            <div className="Bolero" style={{ ...props.style, ...style }}>
                <h1 ref={div}></h1>
            </div>
        )
    }
}
