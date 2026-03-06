import React from 'react'

let themes = {
    light: {
        foreground: 'magenta',
        background: 'white',
        middleground: '#161011',
        slider: false,
        name: 'light',
        mixBlendMode: 'normal',
        mixBlendModeBackground: 'difference',
        quilt: ['DarkOrange', 'White', 'DarkOrange', 'Black'],
        colorMatrix: [
            1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
        ],
    },
    dark: {
        foreground: 'magenta',
        background: '#161011',
        middleground: '#f0a5a3',
        slider: true,
        name: 'dark',
        mixBlendMode: 'normal',
        mixBlendModeForeground: 'multiply',
        quilt: ['DarkOrange', 'Black', 'DarkOrange', 'White'],
        colorMatrix: [
            -1, 0, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, 1, 0,
        ],
    },
    konami: {
        foreground: 'magenta',
        background: 'white',
        middleground: 'magenta',
        slider: true,
        name: 'konami',
        mixBlendMode: 'normal',
        mixBlendModeForeground: 'screen',
        quilt: [
            'rgb(255,127,255)',
            'rgb(255,212,255)',
            'rgb(255,127,255)',
            'rgb(255,0,255)',
        ],
        colorMatrix: [
            0, 0, 0, 0, 1, 0.2126, 0.7152, 0.0722, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
            1, 0,
        ],
    },
}

const ThemeContext = React.createContext({
    theme: themes.light,
})

export { ThemeContext, themes }
