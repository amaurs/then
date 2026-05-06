import { useState } from 'react'
import { useInterval } from './Hooks'
import './LoaderBraille.css'

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

const LoaderBraille = () => {
    const [index, setIndex] = useState(0)

    useInterval(() => {
        setIndex((i) => (i + 1) % FRAMES.length)
    }, 80)

    return (
        <div className="LoaderBraille">
            <span className="LoaderBraille-frame">{FRAMES[index]}</span>
        </div>
    )
}

export default LoaderBraille
