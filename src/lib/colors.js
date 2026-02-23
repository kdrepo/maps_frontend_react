/**
 * Centralized Color Tokens
 * All colors are defined here to avoid hardcoding hex values throughout the app.
 * These correspond to the CSS variables defined in index.css
 */

// Get CSS variable value from root element
const getCSSVariable = (varName) => {
  if (typeof window === "undefined") return null;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

// Theme Colors (Light Mode)
export const COLORS = {
  // Text Colors
  text: {
    primary: "#1a1a1a",
    secondary: "#4a4a4a",
    muted: "#999999",
  },
  // Background Colors
  bg: {
    primary: "#fef5f0",
    secondary: "#ffffff",
    tertiary: "#fff1e6",
  },
  // Border Colors
  border: {
    primary: "#ffd4a3",
    secondary: "#ffb366",
  },
  // Accent Colors
  accent: {
    primary: "#e87722",
    secondary: "#ff9a3d",
    light: "#fff0e6",
  },
  // Interactive States
  interactive: {
    hoverAccent: "#d4621a",
    focusAccent: "#f58a2f",
  },
  // Map-specific Colors
  map: {
    selected: "#e87722", // Orange - active/selected district
    default: "#fff1e6", // Light orange - default district
    hover: "#ff9a3d", // Lighter orange - hovered district
    stroke: {
      default: "#1a1a1a", // Black
      hover: "#d4621a", // Dark orange
    },
    pressed: "#c45911", // Deep orange
  },
};

// Dark Mode Colors
export const COLORS_DARK = {
  text: {
    primary: "#ffd4a3",
    secondary: "#ff9a3d",
    muted: "#cc9966",
  },
  bg: {
    primary: "#1a1410",
    secondary: "#2a2015",
    tertiary: "#3d2817",
  },
  border: {
    primary: "#4d3419",
    secondary: "#663d26",
  },
  accent: {
    primary: "#ff9a3d",
    secondary: "#ffb366",
    light: "#4d2817",
  },
  interactive: {
    hoverAccent: "#ffc266",
    focusAccent: "#ffb366",
  },
  // Map colors for dark mode
  map: {
    selected: "#ff9a3d",
    default: "#3d2817",
    hover: "#ffb366",
    stroke: {
      default: "#4d3419",
      hover: "#ffc266",
    },
    pressed: "#dd7f1f",
  },
};

// Convenience function to get the right color set based on dark mode
export const getColorSchema = (isDark = false) => {
  return isDark ? COLORS_DARK : COLORS;
};
