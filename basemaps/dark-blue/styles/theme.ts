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
  type ThemeOpacities,
  type ThemePOIs,
  type ThemeSettings,
  type ThemeLabelFonts
} from "../../../shared/styles/theme.js";

// ============================================================================
// SETTINGS
// ============================================================================

export const darkBlueSettings: ThemeSettings = {
  /** Map projection type - "mercator" for flat map, "globe" for 3D globe */
  projection: "globe",
  
  /** Minimum zoom level - different for globe vs mercator */
  minZoom: {
    mercator: 0,  // Flat map can go to z0
    globe: 2,     // Globe needs higher min zoom for better appearance
  },
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
  
  /**
   * Initial map view configuration.
   * Controls where the map is centered, the zoom level, camera tilt, and rotation when it first loads.
   */
  view: {
    /** Initial center point [longitude, latitude] */
    center: [-98.0, 39.0],
    /** Initial zoom level */
    zoom: 4.25,
    /** Camera tilt angle in degrees (0-60, default 0). 0 = straight down, higher = more tilted */
    pitch: 0,
    /** Rotation angle in degrees (0-360, default 0). 0 = north, 90 = east, 180 = south, 270 = west */
    bearing: 0,
  },
};

// ============================================================================
// LABEL FONTS
// ============================================================================

/**
 * Per-label-type font configuration.
 * 
 * Available fonts (from CDN at https://data.storypath.studio/glyphs/):
 * 
 * Noto Sans (default):
 *   - "Noto Sans Regular"
 *   - "Noto Sans SemiBold"
 *   - "Noto Sans Italic"
 * 
 * Cormorant Garamond:
 *   - "Cormorant Garamond Regular"
 *   - "Cormorant Garamond SemiBold"
 *   - "Cormorant Garamond Italic"
 *   - "Cormorant Garamond Bold"
 *   - "Cormorant Garamond Bold Italic"
 * 
 * IM FELL English:
 *   - "IM FELL English Regular"
 *   - "IM FELL English Italic"
 *   - "IM FELL English SC Regular" (small caps)
 * 
 * Junicode:
 *   - "Junicode Regular"
 *   - "Junicode Bold"
 *   - "Junicode Italic"
 */
export const darkBlueLabelFonts: ThemeLabelFonts = {
  /** Default font for all labels (fallback when specific label fonts not set) */
  default: ["Noto Sans Regular"],
  
  /** Font for place labels (continents, countries, cities, etc.) */
  place: ["Noto Sans Regular"],
  
  /** Font for road labels */
  road: ["Noto Sans Regular"],
  
  /** Font for water labels (oceans, lakes, rivers) - uses italic by default */
  water: ["Noto Sans Italic"],
  
  /** Font for POI labels */
  poi: ["Noto Sans Regular"],
  
  /** Font for grid labels (latitude/longitude) */
  grid: ["Noto Sans Regular"],
};

// ============================================================================
// COLORS
// ============================================================================

export const darkBlueColors: ThemeColors = {
  // Background
  background: "#0b0f14",
  
  // Land/terrain
  land: {
    wood: "#0f1a1b",      // Dark green-brown - wood/forest
    grass: "#0f1618",     // Dark green-grey - grass
    scrub: "#12161a",     // Muted purple-grey - scrub
    cropland: "#141612",   // Warm dark beige - cropland
    farmland: "#141612",   // Warm dark beige - farmland (same as cropland)
    rock: "#111418",      // Cool grey-blue - rock
    sand: "#161510",      // Warm muted beige - sand
    wetland: "#0e1418",   // Dark blue-green - wetland
    default: "#0f141b",   // Neutral dark grey - default/unknown
  },
  
  // Landuse
  landuse: {
    park: "#11161d",        // Dark blue-grey - park (matches existing)
    cemetery: "#11161d",    // Dark blue-grey - cemetery (matches existing)
    pitch: "#121923",       // Slightly lighter blue-grey - pitch (matches existing)
    stadium: "#121923",     // Slightly lighter blue-grey - stadium (matches existing)
    residential: "#0e131a", // Dark grey-blue - residential (matches existing)
    // Additional landuse classes - subtle variations
    college: "#11171e",     // Slightly green-tinted - college
    commercial: "#121820",   // Cool grey-blue - commercial
    construction: "#131510", // Warm dark grey - construction
    dam: "#0f161a",         // Dark blue-grey - dam
    farmland: "#141612",     // Warm dark beige - farmland (matches land.cropland)
    grass: "#0f1618",       // Dark green-grey - grass (matches land.grass)
    hospital: "#12161b",    // Slightly red-tinted grey - hospital
    industrial: "#111418",  // Cool grey-blue - industrial
    military: "#0f1318",    // Very dark grey-blue - military
    neighbourhood: "#0f151a", // Neutral dark grey - neighbourhood
    quarry: "#111510",     // Slightly green-tinted - quarry
    quarter: "#10161a",     // Neutral dark grey - quarter
    railway: "#111418",     // Cool grey-blue - railway
    retail: "#12171d",      // Slightly warm grey - retail
    school: "#11171e",      // Slightly green-tinted - school
    suburb: "#0f151a",      // Neutral dark grey - suburb
    theme_park: "#12161a",  // Muted grey - theme_park
    track: "#0f1618",       // Dark green-grey - track
    university: "#11171e",   // Slightly green-tinted - university
    zoo: "#0f1618",         // Dark green-grey - zoo
    default: "#0e131a",     // Neutral dark grey - default (matches existing)
  },
  
  // Water
  water: {
    fill: "#0a2846",
    line: "#103457",
    labelColor: "#5b8db8",
    labelHalo: "#0a2846",
    // Water class colors - subtle variations of the base water color
    ocean: "#0a2846",      // Base dark blue - ocean (matches fill)
    sea: "#0b2a48",       // Slightly lighter blue - sea
    lake: "#0c2c4a",      // Slightly lighter blue - lake
    pond: "#0d2e4c",      // Slightly lighter blue - pond
    river: "#103457",     // Matches line color - river
    canal: "#0f3254",     // Slightly lighter than river - canal
    stream: "#0e3052",    // Slightly lighter than river - stream
    ditch: "#0d2e50",     // Slightly lighter than river - ditch
    drain: "#0d2e50",     // Same as ditch - drain
    bay: "#0b2a48",       // Same as sea - bay
    gulf: "#0b2a48",      // Same as sea - gulf
    reservoir: "#0c2c4a", // Same as lake - reservoir
    default: "#0a2846",   // Default water color (matches fill)
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
    // Height-based building colors (buildings don't have class property)
    // Colors vary by building height (render_height) - subtle gradient from dark to slightly lighter
    short: "#151a22",      // Dark grey - short buildings (0-10m)
    medium: "#181d25",     // Slightly lighter grey - medium buildings (10-50m)
    tall: "#1b2028",       // Medium grey - tall buildings (50-150m)
    skyscraper: "#1e232b", // Lighter grey - skyscrapers (150-300m)
    supertall: "#21262e",  // Even lighter grey - supertall buildings (300-600m)
    megatall: "#242930",   // Lightest grey - megatall buildings (600m+)
    default: "#151a22",    // Default building color (matches short)
  },
  
  // Labels
  label: {
    place: {
      color: "#a8b8d0",
      halo: "#0b0f14",
      // haloWidth: 2,        // Optional: override place label halo width
      // haloBlur: 1,         // Optional: override place label halo blur
    },
    // Optional: place label display config (uncomment to customize)
    // placeLabels: { suburbMaxRank: 8, villageMaxRank: 15, minZoom: 8 },
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
      // haloWidth: 2,        // Optional: override water label halo width
      // haloBlur: 1,         // Optional: override water label halo blur
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
    strokeWidth: 1,                       // Border thickness (adjustable - reduce if cutoff occurs)
  },
};

// ============================================================================
// STARFIELD CONFIGURATION
// ============================================================================

export const darkBlueStarfield = {
  /** Starfield glow colors - blue scheme for dark-blue theme */
  glowColors: {
    inner: "rgba(120, 180, 255, 0.9)",   // Light blue
    middle: "rgba(100, 150, 255, 0.7)",  // Medium blue
    outer: "rgba(70, 120, 255, 0.4)",    // Dark blue
    fade: "rgba(40, 80, 220, 0)"         // Very dark blue
  },
  /** Number of stars in the starfield */
  starCount: 200,
  /** Glow intensity (0.0 to 1.0) */
  glowIntensity: 0.5,
  /** Glow size multiplier relative to globe */
  glowSizeMultiplier: 1.25,
  /** Glow blur multiplier */
  glowBlurMultiplier: 0.1,
};

// ============================================================================
// POI CONFIGURATION
// ============================================================================

export const darkBluePOIs: ThemePOIs = {
  /** Whether to show POIs at all */
  enabled: true,
  
  /** Global minimum zoom for all POIs */
  minZoom: 12,
  
  /** Airport POI settings */
  airport: {
    enabled: true,
    minZoom: 12,
  },
  
  /** Airfield POI settings */
  airfield: {
    enabled: true,
    minZoom: 12,
  },
  
  /** Hospital POI settings */
  hospital: {
    enabled: true,
    minZoom: 12,
  },
  
  /** Museum POI settings */
  museum: {
    enabled: true,
    minZoom: 12,
  },
  
  /** Zoo POI settings */
  zoo: {
    enabled: true,
    minZoom: 12,
  },
  
  /** Stadium POI settings */
  stadium: {
    enabled: true,
    minZoom: 12,
  },
  
  /** Park POI settings */
  park: {
    enabled: true,
    minZoom: 12,
  },
  
  /** Railway station POI settings */
  rail: {
    enabled: true,
    minZoom: 12,
  },
  
  /** School/College/University POI settings */
  school: {
    enabled: true,
    minZoom: 12,
  },
};

// ============================================================================
// BATHYMETRY CONFIGURATION
// ============================================================================

export const darkBlueBathymetry = {
  /** Whether to show bathymetry at all */
  enabled: false,
  
  /** Minimum zoom level to show bathymetry */
  minZoom: 0,
  
  /** Maximum zoom level to show bathymetry (fades out after this) */
  maxZoom: 7,
  
  /** Opacity range */
  opacity: {
    min: 0.7,  // Opacity at minZoom
    max: 0.9,  // Opacity at maxZoom
  },
  
  /** Custom colors for each depth level */
  colors: {
    shallow: "#0d3a5f",  // 0m - shallowest (lighter than water)
    shelf: "#0a2f4f",    // 200m - shelf
    slope: "#082544",    // 1000m - slope
    deep1: "#061d3a",    // 2000m - deep1
    deep2: "#04152a",    // 4000m - deep2
    abyss: "#020d1a",    // 6000m - abyss
    trench: "#000a14",   // 10000m - trench (deepest)
  },
  
  /** Custom opacity for each depth level */
  depthOpacities: {

    shallow: 0.9,    // 0m - shallowest (most opaque)
    shelf: 0.86,     // 200m
    slope: 0.77,     // 1000m
    deep1: 0.63,     // 2000m
    deep2: 0.50,     // 4000m
    abyss: 0.36,     // 6000m
    trench: 0.23,    // 10000m - deepest (most transparent)
  },
};

// ============================================================================
// CONTOURS CONFIGURATION
// ============================================================================

export const darkBlueContours = {
  /** Whether to show contours at all */
  enabled: false,
  
  /** Minimum zoom level to show contours */
  minZoom: 4,
  
  /** Maximum zoom level to show contours (fades out after this) */
  maxZoom: 10,
  
  /** Major contour line styling (800m intervals) */
  major: {
    color: "#4a5568",  // Medium gray
    width: {
      min: 0.5,  // Width at minZoom
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.6,
    minZoom: 4,  // Major contours start at z4
  },
  
  /** Minor contour line styling (350m intervals) */
  minor: {
    color: "#3a4455",  // Darker gray
    width: {
      min: 0.25,  // Width at minZoom
      max: 0.75,  // Width at maxZoom
    },
    opacity: 0.4,
    minZoom: 6,  // Minor contours start at z6
  },
};

// ============================================================================
// ICE CONFIGURATION
// ============================================================================

export const darkBlueIce = {
  /** Whether to show ice at all */
  enabled: false,
  
  /** Minimum zoom level to show ice */
  minZoom: 0,
  
  /** Maximum zoom level to show ice (fades out after this) */
  maxZoom: 6,
  
  /** Base opacity range */
  opacity: {
    min: 0.7,  // Opacity at minZoom
    max: 0.9,  // Opacity at maxZoom
  },
  
  /** Glaciated areas (glaciers, ice caps) */
  glaciated: {
    color: "#e8f4f8",  // Light blue-white
    opacity: 0.9,
  },
  
  /** Ice shelves */
  iceShelves: {
    color: "#d0e8f0",  // Slightly darker blue-white
    opacity: 0.9,
  },
  
  /** Ice edge (outline) - set to null or enabled: false to disable */
  iceEdge: {
    enabled: false,  // Outline of ice shelves (Antarctica only)
    color: "#a0c8d8",  // Medium blue-gray (matches original design)
    width: 1.0,  // Increased from 0.5 for better visibility
    opacity: 0.8,  // Increased from 0.6 for better visibility
  },
};

// ============================================================================
// HILLSHADE CONFIGURATION
// ============================================================================

export const darkBlueHillshade = {
  /** Whether to show hillshade at all */
  enabled: false,
  
  /** Minimum zoom level to show hillshade */
  minZoom: 0,
  
  /** Maximum zoom level to show hillshade (fades out after this) */
  maxZoom: 12,
  
  /** Base opacity for hillshade (0.0 to 1.0) */
  opacity: 0.5,
  
  /** Illumination direction (0-360 degrees, where 0 is north, 90 is east) */
  illuminationDirection: 335,  // Northwest (typical for natural lighting)
  
  /** Illumination anchor - "map" (fixed to map) or "viewport" (fixed to viewport) */
  illuminationAnchor: "viewport" as const,
  
  /** Exaggeration factor for terrain relief (0.0 to 1.0, higher = more dramatic) */
  exaggeration: 0.5,
  
  /** Shadow color (darker areas) */
  shadowColor: "#000000",
  
  /** Highlight color (lighter areas) */
  highlightColor: "#ffffff",
  
  /** Accent color (mid-tones) */
  accentColor: "#000000",
};

// ============================================================================
// GRID CONFIGURATION
// ============================================================================

export const darkBlueGrid = {
  /** Whether to show grid lines at all */
  enabled: false,
  
  /** Minimum zoom level to show grid lines */
  minZoom: 0,
  
  /** Maximum zoom level to show grid lines (fades out after this) */
  maxZoom: 10,
  
  /** Latitude lines (horizontal) styling */
  latitude: {
    color: "#6b7280",  // Lighter gray for better visibility
    width: {
      min: 1.0,  // Width at minZoom (increased for visibility)
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.6,  // Increased opacity for better visibility
    interval: 10,  // Lines every 10 degrees
    label: {
      enabled: false,  // Enable labels for latitude lines
      color: "#9ca3af",  // Light gray for labels
      size: {
        min: 10,  // Size at minZoom
        max: 12,  // Size at maxZoom
      },
      opacity: 0.8,
      minZoom: 2,  // Show labels starting at zoom 2
    },
  },
  
  /** Longitude lines (vertical) styling */
  longitude: {
    color: "#6b7280",  // Lighter gray for better visibility
    width: {
      min: 1.0,  // Width at minZoom (increased for visibility)
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.6,  // Increased opacity for better visibility
    interval: 10,  // Lines every 10 degrees
    label: {
      enabled: false,  // Enable labels for longitude lines
      color: "#9ca3af",  // Light gray for labels
      size: {
        min: 10,  // Size at minZoom
        max: 12,  // Size at maxZoom
      },
      opacity: 0.8,
      minZoom: 2,  // Show labels starting at zoom 2
    },
  },
};

// ============================================================================
// BOUNDARY CONFIGURATION
// ============================================================================

export const darkBlueBoundary = {
  /** Whether to show country boundaries */
  country: true,  // Set to false to hide country boundaries
  /** Whether to show state boundaries */
  state: true,  // Set to false to hide state boundaries
  /** Whether to show maritime boundaries */
  maritime: false,  // Set to false to hide maritime boundaries
  /** Whether to hide boundaries over water areas (only show on land) */
  hideOverWater: true,  // Set to true to hide boundaries over water
};

// ============================================================================
// BUILDING CONFIGURATION
// ============================================================================

export const darkBlueBuildings = {
  /** Whether to show buildings at all */
  enabled: true,  // Set to false to hide all buildings
  /** Minimum zoom level to show buildings */
  minZoom: 13,  // Buildings start appearing at zoom 13 (PMTiles data availability)
  /** Maximum zoom level to show buildings (fades out after this) */
  maxZoom: undefined,  // No maximum zoom (buildings show at all zoom levels)
  /** Zoom level where height-based colors start (before this, uses default color) */
  heightColorsMinZoom: 14,  // Height-based colors start at zoom 14 (height data available from z14+), default color before that
};

// ============================================================================
// LAND CONFIGURATION
// ============================================================================

export const darkBlueLand = {
  /** 
   * Whether to make all landcover layers transparent (sets opacity to 0, layers still exist but are invisible).
   * Uses transparency instead of removing layers to allow runtime toggling via map.setPaintProperty().
   * Note: Removing layers would be more efficient (no tiles loaded, no processing), but transparency
   * enables dynamic control without rebuilding the style.
   */
  transparent: false,  // Set to true to make all landcover transparent (opacity 0)
  /** Whether to use a single override color for all landcover types */
  useOverrideColor: false,  // Set to true to use overrideColor for all landcover types
  /** Override color to use for all landcover types when useOverrideColor is true */
  overrideColor: "#0f141b",  // Default landcover color - used when useOverrideColor is true (matches land.default)
};

// ============================================================================
// LANDUSE CONFIGURATION
// ============================================================================

export const darkBlueLanduse = {
  /** 
   * Whether to make all landuse layers transparent (sets opacity to 0, layers still exist but are invisible).
   * Uses transparency instead of removing layers to allow runtime toggling via map.setPaintProperty().
   * Note: Removing layers would be more efficient (no tiles loaded, no processing), but transparency
   * enables dynamic control without rebuilding the style.
   */
  transparent: false,  // Set to true to make all landuse transparent (opacity 0)
  /** Whether to use a single override color for all landuse types */
  useOverrideColor: false,  // Set to true to use overrideColor for all landuse types
  /** Override color to use for all landuse types when useOverrideColor is true */
  overrideColor: "#0e131a",  // Default landuse color - used when useOverrideColor is true (matches landuse.default)
};

// ============================================================================
// WATER CONFIGURATION
// ============================================================================

export const darkBlueWater = {
  /** 
   * Whether to make all water fill layers transparent (sets opacity to 0, layers still exist but are invisible).
   * Uses transparency instead of removing layers to allow runtime toggling via map.setPaintProperty().
   * Note: Removing layers would be more efficient (no tiles loaded, no processing), but transparency
   * enables dynamic control without rebuilding the style.
   */
  transparent: false,  // Set to true to make all water fills transparent (opacity 0)
  /** 
   * Whether to make all waterway (line) layers transparent (sets opacity to 0, layers still exist but are invisible).
   * Uses transparency instead of removing layers to allow runtime toggling via map.setPaintProperty().
   * Note: Removing layers would be more efficient (no tiles loaded, no processing), but transparency
   * enables dynamic control without rebuilding the style.
   */
  transparentWaterway: false,  // Set to true to make all waterways transparent (opacity 0)
  /** Whether to use a single override color for all water fill types */
  useOverrideColor: false,  // Set to true to use overrideColor for all water fill types
  /** Override color to use for all water fill types when useOverrideColor is true */
  overrideColor: "#0a2846",  // Default water fill color - used when useOverrideColor is true (matches water.fill)
  /** Whether to use a single override color for all waterway (line) types */
  useOverrideColorWaterway: false,  // Set to true to use overrideColorWaterway for all waterway types
  /** Override color to use for all waterway types when useOverrideColorWaterway is true */
  overrideColorWaterway: "#103457",  // Default waterway line color - used when useOverrideColorWaterway is true (matches water.line)
};

// ============================================================================
// AEROWAY CONFIGURATION
// ============================================================================

export const darkBlueAeroway = {
  /** Whether to show aeroway features at all */
  enabled: false,
  
  /** Runway line styling */
  runway: {
    color: "#4a5568",        // Medium gray for runways
    width: 0.5,              // Thin lines
    opacity: 0.8,
    majorLength: 2500,       // Minimum length (meters) for major runways shown at z6-7
  },
  
  /** Apron polygon styling */
  apron: {
    fillColor: "#3a4455",    // Dark gray fill
    fillOpacity: 0.3,         // Thin fill (semi-transparent)
    outlineColor: "#4a5568",  // Medium gray outline
    outlineWidth: 0.3,        // Thin outline
  },
  
  /** Taxiway line styling */
  taxiway: {
    color: "#5a6578",        // Slightly lighter gray than runways
    width: 0.4,              // Slightly thinner than runways
    opacity: 0.7,
  },
  
  /** Helipad point styling */
  helipad: {
    fillColor: "#5a6578",    // Medium gray fill
    fillOpacity: 0.6,
    outlineColor: "#6a7588", // Lighter gray outline
    outlineWidth: 0.3,
    size: 4,                 // Circle radius in pixels
  },
  
  /** Airport label styling */
  label: {
    color: "#a8b8d0",        // Light blue-gray text (matches place labels)
    haloColor: "#0b0f14",    // Dark halo for contrast
    haloWidth: 0,
    opacity: 0.9,
    majorSize: { min: 10, max: 12 },      // Font size for major airports (z8-9)
    detailedSize: { min: 10, max: 12 },   // Font size for detailed labels (z13+)
  },
};

// ============================================================================
// COMPLETE THEME
// ============================================================================

export const darkBlueTheme: Theme = {
  name: "Dark Blue Basemap",
  fonts,
  labelFonts: darkBlueLabelFonts,
  colors: darkBlueColors,
  widths: darkBlueWidths,
  opacities: darkBlueOpacities,
  settings: darkBlueSettings,
  shields: darkBlueShields,
  pois: darkBluePOIs,
  bathymetry: darkBlueBathymetry,
  contours: darkBlueContours,
  ice: darkBlueIce,
  hillshade: darkBlueHillshade,
  grid: darkBlueGrid,
  boundary: darkBlueBoundary,
  buildings: darkBlueBuildings,
  land: darkBlueLand,
  landuse: darkBlueLanduse,
  water: darkBlueWater,
  aeroway: darkBlueAeroway,
  starfield: darkBlueStarfield,
};
