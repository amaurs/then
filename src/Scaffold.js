import React from "react";
import { useLocalStorage } from "./Hooks.js";
import Home from "./Something.js";

import { ThemeContext, themes } from "./ThemeContext.js";

const Then = () => {
    const [theme, setTheme] = useLocalStorage("theme", themes.light);

    const toggleTheme = () => {
        setTheme(theme.name === "dark" ? themes.light : themes.dark);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Home />
        </ThemeContext.Provider>
    );
};

export default Then;
