import React, {useState} from 'react';
import Home from './Home.js';


import { ThemeContext, themes   } from './ThemeContext.js'


const Then = () => {

    const [theme, setTheme] = useState(themes.light);


    const toggleTheme = () => {

        setTheme(theme === themes.dark?themes.light:themes.dark);

    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            <Home />
        </ThemeContext.Provider>);
}

export default Then;
