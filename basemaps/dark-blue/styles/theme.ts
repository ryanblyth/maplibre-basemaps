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
// SETTINGS
// ============================================================================

export const darkBlueSettings = {
  /**
   * When true, road widths scale proportionally to real-world sizes at zoom 15+.
   * Roads will double in pixel width with each zoom level to match map scale.
   * This makes roads proportional to buildings at high zoom levels.
   * 
   * Set to true to enable, false to use fixed pixel widths.
   */
  realWorldScale: true,
  
  /**
   * The zoom level at which real-world scaling begins.
   * Below this zoom, roads use fixed pixel widths.
   */
  realWorldScaleMinZoom: 16,
};

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
    parkingAisle: "#252a35",  // Slightly darker than service for subtle distinction
    other: "#28313d", 
    casing: "#0e131a",
    
    // Tunnel colors - COMMENTED OUT: tunnels inherit road colors by default
    // Uncomment to override with custom tunnel colors:
    // tunnel: {
    //   motorway: "#364252",
    //   trunk: "#323c4a",
    //   primary: "#2f3947",
    //   secondary: "#2b3441",
    //   tertiary: "#29323e",
    //   residential: "#27303b",
    //   service: "#252d38",
    //   default: "#242b35",
    // },
    
    // Bridge colors - COMMENTED OUT: bridges inherit road colors by default
    // Uncomment to override with custom bridge colors:
    // bridge: {
    //   motorway: "#3f4a5b",
    //   trunk: "#3a4655",
    //   primary: "#374252",
    //   secondary: "#343e4c",
    //   tertiary: "#303a47",
    //   residential: "#2d3542",
    //   default: "#2a3240",
    //   casing: "#0f1520",
    // },
    
    // Tunnel casing color - COMMENTED OUT: uses road casing color by default
    // tunnelCasing: "#0a0e13",
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
    poi: {
      iconColor: "#7a8ba3",           // Light blue-gray for icons
      iconSize: 0.8,                   // Slightly smaller icons
      textColor: "#a8b8d0",            // Light blue-gray for labels
      textHalo: "#0b0f14",             // Dark halo for contrast
      textHaloWidth: 1.5,
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
    motorway: { z6: 1, z12: 3, z15: 10 },
    trunk: { z6: 0.8, z12: 2.75, z15: 10 },
    primary: { z6: 0.7, z12: 2, z15: 10 },
    secondary: { z6: 0.6, z12: 1.5, z15: 7.5 },
    tertiary: { z6: 0.5, z12: 1.5, z15: 6 },
    residential: { z6: 0.4, z12: 1, z15: 4 },
    service: { z6: 0.2, z12: 1, z15: 4 },
    default: { z6: 0.4, z12: 1, z15: 4 },
  },
  
  // Road casing widths (slightly larger than road - using same zoom stops)
  // Note: Casing currently uses fixed scaling, not real-world scaling
  roadCasing: {
    motorway: { z6: 1.5, z12: 4, z15: 11 },
    trunk: { z6: 1.2, z12: 3.5, z15: 11 },
    primary: { z6: 1.0, z12: 2.8, z15: 11 },
    secondary: { z6: 0.9, z12: 2.2, z15: 8.5 },
    tertiary: { z6: 0.8, z12: 2.2, z15: 7 },
    residential: { z6: 0.7, z12: 1.8, z15: 5 },
    service: { z6: 0.5, z12: 1.5, z15: 5 },
    default: { z6: 0.7, z12: 1.8, z15: 5 },
  },
  
  // Tunnel widths (legacy - kept for reference)
  tunnel: { z10: 0.4, z12: 1.0, z14: 1.6 },
  tunnelCasing: { z10: 0.5, z12: 1.2, z14: 2.0 },
  
  // Tunnel road class widths - COMMENTED OUT: tunnels inherit road widths by default
  // Uncomment to override with custom tunnel widths:
  // tunnelRoad: {
  //   motorway: { z6: 1, z12: 3, z15: 10 },
  //   trunk: { z6: 0.8, z12: 2.75, z15: 10 },
  //   primary: { z6: 0.7, z12: 2, z15: 10 },
  //   secondary: { z6: 0.6, z12: 1.5, z15: 7.5 },
  //   tertiary: { z6: 0.5, z12: 1.5, z15: 6 },
  //   residential: { z6: 0.4, z12: 1, z15: 4 },
  //   service: { z6: 0.2, z12: 1, z15: 4 },
  //   default: { z6: 0.4, z12: 1, z15: 4 },
  // },
  
  // Bridge widths (legacy - kept for reference)
  bridge: { z10: 0.5, z12: 1.1, z14: 1.8 },
  bridgeCasing: { z10: 0.6, z12: 1.3, z14: 2.2 },
  
  // Bridge road class widths - COMMENTED OUT: bridges inherit road widths by default
  // Uncomment to override with custom bridge widths:
  // bridgeRoad: {
  //   motorway: { z6: 2, z12: 6, z15: 20 },
  //   trunk: { z6: 1.6, z12: 5.5, z15: 20 },
  //   primary: { z6: 1.4, z12: 4, z15: 20 },
  //   secondary: { z6: 1.2, z12: 3, z15: 15 },
  //   tertiary: { z6: 1, z12: 3, z15: 12 },
  //   residential: { z6: 0.8, z12: 2, z15: 8 },
  //   service: { z6: 0.4, z12: 2, z15: 8 },
  //   default: { z6: 0.8, z12: 2, z15: 8 },
  // },
  
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
// HIGHWAY SHIELDS
// ============================================================================

// To build shield icons and styles, run: npx tsx scripts/build-shields.ts && npm run build:styles

export const darkBlueShields = {
  /** Whether to show highway shields */
  enabled: true,
  
  /** Global minimum zoom for all shields */
  minZoom: 6,
  
  /** Interstate shields (I-70, I-95, etc.) */
  interstate: {
    enabled: true,
    sprite: "shield-interstate-custom",
    textColor: "#687383",                 // Light blue-gray text
    minZoom: 6,
    textPadding: [5, 5, 5, 5] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [6, 9, 14, 13] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    // Custom shield appearance - subtle two-tone for dark theme
    upperBackground: "#1a2433",           // Slightly lighter dark blue
    lowerBackground: "#141c28",           // Darker blue background
    strokeColor: "#3a4a5c",               // Subtle blue-gray border
    strokeWidth: 2,
  },
  
  /** US Highway shields (US-1, US-66, etc.) */
  usHighway: {
    enabled: true,
    sprite: "shield-ushighway-custom",
    textColor: "#687383",                 // Light blue-gray text
    minZoom: 7,
    textPadding: [5, 5, 5, 5] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [6, 9, 14, 13] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    // Custom shield appearance - subtle for dark theme
    background: "#182030",                // Dark blue background
    strokeColor: "#3a4a5c",               // Subtle blue-gray border
    strokeWidth: 2.5,
  },
  
  /** State Highway shields */
  stateHighway: {
    enabled: true,
    sprite: "shield-state-custom",
    textColor: "#687383",                 // Light blue-gray text
    minZoom: 8,
    textPadding: [4, 4, 4, 4] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [8, 8, 14, 12] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    // Custom shield appearance - subtle oval for dark theme
    background: "#1a2433",                // Dark blue background
    strokeColor: "#3a4a5c",               // Subtle blue-gray border
    strokeWidth: 2,                       // Border thickness (adjustable - reduce if cutoff occurs)
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
  settings: darkBlueSettings,
  shields: darkBlueShields,
};
