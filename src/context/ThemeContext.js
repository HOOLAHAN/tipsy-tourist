import { createContext, useContext } from "react";
export const ThemeContext = createContext();
export const useUITheme = () => useContext(ThemeContext);
