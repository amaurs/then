import React, { useContext } from 'react'
import './Then.css'
import { ThemeContext } from './ThemeContext'
import CSS from 'csstype'

const Then = () => {
    const theme = useContext(ThemeContext)

    let style: CSS.Properties = {
        color: theme.theme.foreground,
        mixBlendMode: theme.theme.mixBlendMode as CSS.Property.MixBlendMode,
    }

    return (
        <div className="Then" style={style}>
            <h1 className="name">Then</h1>
        </div>
    )
}

export default Then
