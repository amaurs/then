import React from "react";

let themes = {
    light: {
        foreground: "blue",
        background: "orange",
        middleground: "#161011",
        slider: false,
        name: "light",
        mixBlendMode: "multiply",
        mixBlendModeBackground: "difference",
        quilt: ["DarkOrange", "White", "DarkOrange", "Black"],
    },
    dark: {
        foreground: "#f0a5a3",
        background: "#161011",
        middleground: "#ffffff",
        slider: true,
        name: "dark",
        mixBlendMode: "difference",
        mixBlendModeForeground: "multiply",
        quilt: ["DarkOrange", "Black", "DarkOrange", "White"],
    },
    konami: {
        foreground: "red",
        background: "blue",
        middleground: "green",
        slider: true,
        name: "konami",
        mixBlendMode: "normal",
        mixBlendModeForeground: "screen",
        quilt: ["rgb(255,127,255)", "rgb(255,212,255)", "rgb(255,127,255)", "rgb(255,0,255)"],
    },
};

const ThemeContext = React.createContext({
    theme: themes.light,
    toggleTheme: () => {},
});

export { ThemeContext, themes };
