
import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme';
import Cookies from 'js-cookie';

export const ThemeContext = createContext({
  setPrimaryColor: (color: string) => { },
});

export const ThemeProvider = ({ children }) => {
  // console.log(JSON.parse(Cookies.get("shopDetails")).primary_color || "No shop details found");
  const [primaryColor, setPrimaryColor] = useState(() => {
    const cookie = Cookies.get("shopDetails");
    try {
      const parsed = cookie ? JSON.parse(cookie) : null;
      return parsed?.primary_color || "#1976d2";
    } catch (e) {
      return "#1976d2";
    }
  });
  const theme = useMemo(() => {
    return createAppTheme(primaryColor);
  }, [primaryColor]);


  return (
    <ThemeContext.Provider value={{ setPrimaryColor }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
