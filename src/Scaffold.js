import React from "react";
import { useLocalStorage } from "./Hooks.js";
import Home from "./Home.js";

import { ThemeContext, themes } from "./ThemeContext.js";

const Then = () => {

    localStorage.clear();
    const [theme, setTheme] = useLocalStorage("theme", themes.light);

    const toggleTheme = () => {
        console.log(theme);
        setTheme(theme.name !== "konami" ? (theme.name === "dark" ? themes.light : themes.dark): themes.light);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Home />
        </ThemeContext.Provider>
    );
};

export default Then;
