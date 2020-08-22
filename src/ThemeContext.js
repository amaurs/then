import React, { useState } from 'react';

const themes = {
  light: {
    foreground: "#000000",
    background: "#ffffff"
  },
  dark: {
    foreground: "#f0a5a3",
    background: "#000000"
  }
};



const ThemeContext = React.createContext({theme: themes.light,
                                        toggleTheme: () => {} });

export { ThemeContext, themes };
