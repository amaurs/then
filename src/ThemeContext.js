import React, { useState } from 'react';

const themes = {
  light: {
    foreground: "#161011",
    background: "#ffffff",
    slider: false,
    name: "light"
  },
  dark: {
    foreground: "#f0a5a3",
    background: "#161011",
    slider: true,
    name: "dark"
  }
};



const ThemeContext = React.createContext({theme: themes.light,
                                          toggleTheme: () => {} });

export { ThemeContext, themes };
