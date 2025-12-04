/**
 * Dark Blue Basemap Theme
 * 
 * This file contains ALL configurable values for the dark-blue basemap:
 * - Colors (fills, strokes, labels)
 * - Line widths (roads, boundaries, water)
 * - Opacities
 * 
 * To create a new basemap, copy this file and adjust the values.
 */

import { 
  fonts, 
  type Theme, 
  type ThemeColors, 
  type ThemeWidths, 
  type ThemeOpacities 
} from "../../../shared/styles/theme.js";

// ============================================================================
// COLORS
// ============================================================================

export const darkBlueColors: ThemeColors = {
  // Background
  background: "#0b0f14",
  
  // Land/terrain
  land: {
    wood: "#0f141b",
    grass: "#10161e",
    scrub: "#10161e",
    cropland: "#0f141b",
    default: "#0f141b",
  },
  
  // Landuse
  landuse: {
    park: "#11161d",
    cemetery: "#11161d",
    pitch: "#121923",
    stadium: "#121923",
    residential: "#0e131a",
    default: "#0e131a",
  },
  
  // Water
  water: {
    fill: "#0a2846",
    line: "#103457",
    labelColor: "#5b8db8",
    labelHalo: "#0a2846",
  },
  
  // Boundaries
  boundary: {
    country: "#3b82f6",
    state: "#284a7c",
  },
  
  // Roads
  road: {
    motorway: "#3a4657",
    trunk: "#374251",
    primary: "#34404f",
    secondary: "#313b49",
    tertiary: "#2d3744",
    residential: "#2a333f",
    service: "#28313d",
    other: "#28313d",
    casing: "#0e131a",
    tunnel: {
      motorway: "#364252",
      trunk: "#323c4a",
      primary: "#2f3947",
      secondary: "#2b3441",
      tertiary: "#29323e",
      residential: "#27303b",
      service: "#252d38",
      default: "#242b35",
    },
    bridge: {
      motorway: "#3f4a5b",
      trunk: "#3a4655",
      primary: "#374252",
      secondary: "#343e4c",
      tertiary: "#303a47",
      residential: "#2d3542",
      default: "#2a3240",
      casing: "#0f1520",
    },
    tunnelCasing: "#0a0e13",
  },
  
  // Paths
  path: "#25303b",
  
  // Railway
  railway: "#222b36",
  
  // Buildings
  building: {
    fill: "#151a22",
    outline: "#0f141b",
  },
  
  // Labels
  label: {
    place: {
      color: "#a8b8d0",
      halo: "#0b0f14",
    },
    road: {
      major: { color: "#7a8ba3", opacity: 0.8 },
      secondary: { color: "#6b7a90", opacity: 0.7 },
      tertiary: { color: "#5d6b7d", opacity: 0.6 },
      other: { color: "#5d6b7d", opacity: 0.5 },
      halo: "#0b0f14",
    },
    water: {
      color: "#5b8db8",
      halo: "#0a2846",
    },
  },
};

// ============================================================================
// LINE WIDTHS (at different zoom levels)
// ============================================================================

export const darkBlueWidths: ThemeWidths = {
  // Boundary widths
  boundary: {
    country: { z0: 0.4, z6: 1.2, z10: 2.0, z15: 2.5 },
    state: { z0: 0.2, z6: 0.8, z10: 1.2, z15: 1.5 },
  },
  
  // Water line widths
  water: {
    line: { z0: 0.1, z6: 0.4, z10: 0.8, z15: 1.0 },
  },
  
  // Road widths by class
  road: {
    motorway: { z6: 0.9, z12: 2.0, z15: 3.0 },
    trunk: { z6: 0.8, z12: 1.7, z15: 2.5 },
    primary: { z6: 0.7, z12: 1.4, z15: 2.0 },
    secondary: { z6: 0.6, z12: 1.2, z15: 1.7 },
    tertiary: { z6: 0.5, z12: 1.0, z15: 1.4 },
    residential: { z6: 0.4, z12: 0.8, z15: 1.1 },
    service: { z6: 0.2, z12: 0.5, z15: 0.8 },
    default: { z6: 0.4, z12: 0.8, z15: 1.1 },
  },
  
  // Road casing widths (slightly larger than road)
  roadCasing: {
    motorway: { z8: 1.0, z12: 2.3, z14: 3.5 },
    trunk: { z8: 0.9, z12: 2.0, z14: 3.0 },
    primary: { z8: 0.8, z12: 1.7, z14: 2.5 },
    secondary: { z8: 0.7, z12: 1.5, z14: 2.2 },
    tertiary: { z8: 0.6, z12: 1.3, z14: 1.9 },
    residential: { z8: 0.5, z12: 1.1, z14: 1.6 },
    service: { z8: 0.3, z12: 0.6, z14: 0.9 },
    default: { z8: 0.5, z12: 1.1, z14: 1.6 },
  },
  
  // Tunnel widths
  tunnel: { z10: 0.4, z12: 1.0, z14: 1.6 },
  tunnelCasing: { z10: 0.5, z12: 1.2, z14: 2.0 },
  
  // Bridge widths
  bridge: { z10: 0.5, z12: 1.1, z14: 1.8 },
  bridgeCasing: { z10: 0.6, z12: 1.3, z14: 2.2 },
  
  // Path widths
  path: { z12: 0.2, z14: 0.6 },
  
  // Railway widths
  railway: { z10: 0.3, z14: 0.8 },
};

// ============================================================================
// OPACITIES
// ============================================================================

export const darkBlueOpacities: ThemeOpacities = {
  landcover: 0.6,
  landuse: 0.6,
  building: 0.9,
  
  boundary: {
    country: { z0: 0.25, z3: 0.25, z6: 0.75, z10: 0.8 },
    state: 0.6,
    maritime: 0,  // Hidden by default
  },
  
  tunnel: 0.7,
  
  label: {
    place: 0.75,
    water: 0.9,
    waterway: 0.85,
  },
};

// ============================================================================
// COMPLETE THEME
// ============================================================================

export const darkBlueTheme: Theme = {
  name: "Dark Blue Basemap",
  fonts,
  colors: darkBlueColors,
  widths: darkBlueWidths,
  opacities: darkBlueOpacities,
};
