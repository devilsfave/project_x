// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the ThemeContext
const ThemeContext = createContext();

// Define the ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Initially set to light mode

  // Function to toggle the theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // useEffect to update the app's appearance when the theme changes
  useEffect(() => {
    // You might want to update your app's overall theme here,
    // e.g., by changing the background color of the root component
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to easily access the theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};