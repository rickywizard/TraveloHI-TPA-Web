import { createContext, useContext, useState } from 'react';
import { IChildren } from '../interfaces/children-interface';

interface IThemeContext {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<IThemeContext>({} as IThemeContext);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }: IChildren) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const contextValue: IThemeContext = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
