// context/ThemeContext.js
import React, { createContext, useContext, useEffect } from 'react';
import { theme, colors } from '../config/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Inject theme colors into CSS variables
    useEffect(() => {
        const root = document.documentElement;
        
        // Set CSS variables from theme
        root.style.setProperty('--primary', theme.primary.main);
        root.style.setProperty('--primary-light', theme.primary.light);
        root.style.setProperty('--primary-dark', theme.primary.dark);
        
        root.style.setProperty('--secondary', theme.secondary.main);
        root.style.setProperty('--secondary-light', theme.secondary.light);
        root.style.setProperty('--secondary-dark', theme.secondary.dark);
        
        console.log('Theme injected into CSS variables:', {
            primary: theme.primary.main,
            secondary: theme.secondary.main
        });
    }, []);
    
    return (
        <ThemeContext.Provider value={{ theme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};