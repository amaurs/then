import React from "react";
import { useLocalStorage } from "./Hooks.js";
import Home from "./Home.js";

import { ThemeContext, themes } from "./ThemeContext.js";

const Then = () => {

    localStorage.clear();
    const [theme, setTheme] = useLocalStorage("theme", themes.light);

    const toggleTheme = (themeName) => {
        if (themeName === "konami") {
            setTheme(themes.konami);
        } else {
            setTheme(theme.name !== "light" ? themes.light : themes.dark);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Home />
        </ThemeContext.Provider>
    );
};

export default Then;
