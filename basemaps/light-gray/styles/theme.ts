/**
 * Light Gray Basemap Theme
 * 
 * This file contains ALL configurable values for the light-gray basemap:
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

export const lightGraySettings: ThemeSettings = {
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
export const lightGrayLabelFonts: ThemeLabelFonts = {
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

export const lightGrayColors: ThemeColors = {
  // Background - light gray base
  background: "#fafafa",
  
  // Land/terrain - subtle gray variations
  land: {
    wood: "#e8e8e8",      // Slightly darker - forests
    grass: "#ededed",     // Light gray
    scrub: "#eaeaea",     // Between wood and grass
    cropland: "#efefef",  // Light
    farmland: "#efefef",  // Same as cropland
    rock: "#e0e0e0",      // Darker - rocky terrain
    sand: "#f2f2f2",      // Lighter
    wetland: "#e5e5e5",   // Darker - wet areas
    default: "#f0f0f0",   // Default landcover
  },
  
  // Landuse - monochrome gray variations
  landuse: {
    park: "#e8e8e8",        // Gray (was green)
    cemetery: "#eaeaea",    // Gray
    pitch: "#e5e5e5",       // Sports fields - slightly darker
    stadium: "#e5e5e5",     // Same as pitch
    residential: "#f2f2f2", // Very light gray
    // Additional landuse classes - subtle gray variations
    college: "#ebedeb",     // Light gray
    commercial: "#f0f0f0",  // Light gray
    construction: "#e8e8e8", // Gray
    dam: "#e0e0e0",         // Darker gray
    farmland: "#efefef",    // Light (matches land.cropland)
    grass: "#ededed",       // Light (matches land.grass)
    hospital: "#ececec",    // Light gray
    industrial: "#e8e8e8",  // Gray
    military: "#e5e5e5",    // Gray
    neighbourhood: "#f2f2f2", // Light gray
    quarry: "#e0e0e0",      // Darker gray
    quarter: "#f2f2f2",     // Light gray
    railway: "#e8e8e8",     // Gray
    retail: "#f0f0f0",      // Light gray
    school: "#ebedeb",      // Light gray
    suburb: "#f2f2f2",      // Light gray
    theme_park: "#e8e8e8",  // Gray
    track: "#ededed",       // Light gray
    university: "#ebedeb",  // Light gray
    zoo: "#e8e8e8",         // Gray
    default: "#f0f0f0",     // Light gray
  },
  
  // Water - grayscale based on #dadada
  water: {
    fill: "#dadada",
    line: "#c8c8c8",
    labelColor: "#707070",
    labelHalo: "#fafafa",
    // Water class colors - subtle gray variations
    ocean: "#dadada",     // Base water color
    sea: "#dcdcdc",       // Slightly lighter
    lake: "#d8d8d8",      // Slightly darker
    pond: "#d6d6d6",      // Slightly darker
    river: "#d5d5d5",     // Darker for rivers
    canal: "#d5d5d5",     // Same as river
    stream: "#d3d3d3",    // Slightly darker
    ditch: "#d0d0d0",     // Darker
    drain: "#d0d0d0",     // Same as ditch
    bay: "#dcdcdc",       // Same as sea
    gulf: "#dcdcdc",      // Same as sea
    reservoir: "#d8d8d8", // Same as lake
    default: "#dadada",   // Default water color
  },
  
  // Boundaries - gray tones
  boundary: {
    country: "#a0a0a0",
    state: "#b8b8b8",
  },
  
  // Roads - moderate gray fills (visible without casings at high zoom)
  road: {
    motorway: "#e0e0e0",   // Darkest - major roads
    trunk: "#e2e2e2",      // Slightly lighter
    primary: "#e5e5e5",    // Medium gray
    secondary: "#e8e8e8",  // Lighter
    tertiary: "#e8e8e8",   // Lighter
    residential: "#e8e8e8", 
    service: "#ebebeb", 
    parkingAisle: "#eaeaea",  // Slightly darker than service
    other: "#ebebeb", 
    casing: "#c0c0c0",
    
    // Tunnel colors - slightly muted grays
    tunnel: {
      motorway: "#d8d8d8",
      trunk: "#dadada",
      primary: "#dedede",
      secondary: "#e0e0e0",
      tertiary: "#e0e0e0",
      residential: "#e0e0e0",
      service: "#e2e2e2",
      default: "#e2e2e2",
    },
    
    // Bridge colors - same as road
    bridge: {
      motorway: "#e0e0e0",
      trunk: "#e2e2e2",
      primary: "#e5e5e5",
      secondary: "#e8e8e8",
      tertiary: "#e8e8e8",
      residential: "#e8e8e8",
      default: "#e8e8e8",
      casing: "#b0b0b0",
    },
    
    tunnelCasing: "#c8c8c8",
  },
  
  // Paths - medium gray
  path: "#d0d0d0",
  
  // Railway - darker gray for visibility
  railway: "#a0a0a0",
  
  // Buildings - gray fills
  building: {
    fill: "#e5e5e5",
    outline: "#d0d0d0",
    // Height-based building colors - subtle gradient
    short: "#e5e5e5",      // Light gray - short buildings (0-10m)
    medium: "#e0e0e0",     // Slightly darker - medium buildings (10-50m)
    tall: "#dadada",       // Medium gray - tall buildings (50-150m)
    skyscraper: "#d5d5d5", // Darker gray - skyscrapers (150-300m)
    supertall: "#d0d0d0",  // Even darker - supertall buildings (300-600m)
    megatall: "#c8c8c8",   // Darkest - megatall buildings (600m+)
    default: "#e5e5e5",    // Default building color (matches short)
  },
  
  // Labels - dark grays on light background
  label: {
    place: {
      color: "#505050",
      halo: "#fafafa",
      // haloWidth: 2,        // Optional: override place label halo width
      // haloBlur: 1,         // Optional: override place label halo blur
    },
    // Optional: place label display config (uncomment to customize)
    // placeLabels: { suburbMaxRank: 8, villageMaxRank: 15, minZoom: 8 },
    road: {
      major: { color: "#606060", opacity: 0.9 },
      secondary: { color: "#707070", opacity: 0.85 },
      tertiary: { color: "#808080", opacity: 0.8 },
      other: { color: "#909090", opacity: 0.75 },
      halo: "#fafafa",
    },
    water: {
      color: "#707070",
      halo: "#fafafa",
      // haloWidth: 2,        // Optional: override water label halo width
      // haloBlur: 1,         // Optional: override water label halo blur
    },
    poi: {
      iconColor: "#707070",            // Medium gray for icons
      iconSize: 0.8,                   // Slightly smaller icons
      textColor: "#606060",            // Dark gray for labels
      textHalo: "#fafafa",             // Light halo for contrast
      textHaloWidth: 1.5,
    },
  },
};

// ============================================================================
// LINE WIDTHS (at different zoom levels)
// ============================================================================

export const lightGrayWidths: ThemeWidths = {
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
    motorway: { z6: 1.5, z12: 3.5, z15: 11 },
    trunk: { z6: 1.2, z12: 3.25, z15: 11 },
    primary: { z6: 1.0, z12: 2.5, z15: 11 },
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

export const lightGrayOpacities: ThemeOpacities = {
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

export const lightGrayShields = {
  /** Whether to show highway shields */
  enabled: true,
  
  /** Global minimum zoom for all shields */
  minZoom: 6,
  
  /** Interstate shields (I-70, I-95, etc.) */
  interstate: {
    enabled: true,
    sprite: "shield-interstate-custom",
    textColor: "#fafafa",                 // Light text on dark background
    minZoom: 6,
    textPadding: [5, 5, 5, 5] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [6, 9, 14, 13] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    // Custom shield appearance - grayscale two-tone
    upperBackground: "#b5b5b5",           // Medium gray top
    lowerBackground: "#c5c5c5",           // Lighter gray bottom
    strokeColor: "#b5b5b5",               
    strokeWidth: 2,
  },
  
  /** US Highway shields (US-1, US-66, etc.) */
  usHighway: {
    enabled: true,
    sprite: "shield-ushighway-custom",
    textColor: "#404040",                 // Dark gray text
    minZoom: 7,
    textPadding: [5, 5, 5, 5] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [6, 9, 14, 13] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    // Custom shield appearance - light gray with dark outline
    background: "#f0f0f0",                // Light gray background
    strokeColor: "#606060",               // Medium gray border
    strokeWidth: 2.5,
  },
  
  /** State Highway shields */
  stateHighway: {
    enabled: true,
    sprite: "shield-state-custom",
    textColor: "#404040",                 // Dark gray text
    minZoom: 8,
    textPadding: [4, 4, 4, 4] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [8, 8, 14, 12] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    // Custom shield appearance - light gray oval with gray border
    background: "#f0f0f0",                // Light gray background
    strokeColor: "#808080",               // Gray border
    strokeWidth: 2,                       // Border thickness
  },
};

// ============================================================================
// STARFIELD CONFIGURATION
// ============================================================================

export const lightGrayStarfield = {
  /** Starfield glow colors - subtle gray scheme for light-gray theme */
  glowColors: {
    inner: "rgba(180, 180, 180, 0.4)",   // Light gray
    middle: "rgba(160, 160, 160, 0.3)",  // Medium gray
    outer: "rgba(140, 140, 140, 0.2)",   // Darker gray
    fade: "rgba(120, 120, 120, 0)"       // Fade out
  },
  /** Number of stars in the starfield */
  starCount: 100,
  /** Glow intensity (0.0 to 1.0) - reduced for light theme */
  glowIntensity: 0.3,
  /** Glow size multiplier relative to globe */
  glowSizeMultiplier: 1.15,
  /** Glow blur multiplier */
  glowBlurMultiplier: 0.08,
};

// ============================================================================
// POI CONFIGURATION
// ============================================================================

export const lightGrayPOIs: ThemePOIs = {
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

export const lightGrayBathymetry = {
  /** Whether to show bathymetry at all */
  enabled: true,
  
  /** Minimum zoom level to show bathymetry */
  minZoom: 0,
  
  /** Maximum zoom level to show bathymetry (fades out after this) */
  maxZoom: 7,
  
  /** Opacity range */
  opacity: {
    min: 0.5,  // Opacity at minZoom
    max: 0.7,  // Opacity at maxZoom
  },
  
  /** Custom colors for each depth level - grayscale */
  colors: {
    shallow: "#dadada",  // 0m - shallowest (lighter)
    shelf: "#d1d1d1",    // 200m - shelf
    slope: "#d1d1d1",    // 1000m - slope
    deep1: "#d2d2d2",    // 2000m - deep1
    deep2: "#d3d3d3",    // 4000m - deep2
    abyss: "#d4d4d4",    // 6000m - abyss
    trench: "#d6d6d6",   // 10000m - trench (deepest/darkest)
  },
  
  /** Custom opacity for each depth level */
  depthOpacities: {
    shallow: 0.3,    // 0m - shallowest (most transparent)
    shelf: 0.35,     // 200m
    slope: 0.45,     // 1000m
    deep1: 0.55,     // 2000m
    deep2: 0.7,     // 4000m
    abyss: 0.85,     // 6000m
    trench: 1,    // 10000m - deepest (most opaque)
  },
};

// ============================================================================
// CONTOURS CONFIGURATION
// ============================================================================

export const lightGrayContours = {
  /** Whether to show contours at all */
  enabled: false,
  
  /** Minimum zoom level to show contours */
  minZoom: 4,
  
  /** Maximum zoom level to show contours (fades out after this) */
  maxZoom: 10,
  
  /** Major contour line styling (800m intervals) */
  major: {
    color: "#a0a0a0",  // Medium gray for light theme
    width: {
      min: 0.5,  // Width at minZoom
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.5,
    minZoom: 4,  // Major contours start at z4
  },
  
  /** Minor contour line styling (350m intervals) */
  minor: {
    color: "#b8b8b8",  // Lighter gray
    width: {
      min: 0.25,  // Width at minZoom
      max: 0.75,  // Width at maxZoom
    },
    opacity: 0.35,
    minZoom: 6,  // Minor contours start at z6
  },
};

// ============================================================================
// ICE CONFIGURATION
// ============================================================================

export const lightGrayIce = {
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
    color: "#f8f8f8",  // Very light gray (almost white)
    opacity: 0.9,
  },
  
  /** Ice shelves */
  iceShelves: {
    color: "#f0f0f0",  // Light gray
    opacity: 0.9,
  },
  
  /** Ice edge (outline) - set to null or enabled: false to disable */
  iceEdge: {
    enabled: false,  // Outline of ice shelves (Antarctica only)
    color: "#c0c0c0",  // Medium gray
    width: 1.0,  // Increased from 0.5 for better visibility
    opacity: 0.8,  // Increased from 0.6 for better visibility
  },
};

// ============================================================================
// HILLSHADE CONFIGURATION
// ============================================================================

export const lightGrayHillshade = {
  /** Whether to show hillshade at all */
  enabled: true,
  
  /** Minimum zoom level to show hillshade */
  minZoom: 0,
  
  /** Maximum zoom level to show hillshade (fades out after this) */
  maxZoom: 12,
  
  /** Base opacity for hillshade (0.0 to 1.0) - reduced for light theme */
  opacity: 0.33,
  
  /** Illumination direction (0-360 degrees, where 0 is north, 90 is east) */
  illuminationDirection: 335,  // Northwest (typical for natural lighting)
  
  /** Illumination anchor - "map" (fixed to map) or "viewport" (fixed to viewport) */
  illuminationAnchor: "viewport" as const,
  
  /** Exaggeration factor for terrain relief (0.0 to 1.0, higher = more dramatic) */
  exaggeration: 0.33,
  
  /** Shadow color (darker areas) - gray for light theme */
  shadowColor: "#ececec",
  
  /** Highlight color (lighter areas) */
  highlightColor: "#f1f1f1",
  
  /** Accent color (mid-tones) */
  accentColor: "#ececec",
};

// ============================================================================
// GRID CONFIGURATION
// ============================================================================

export const lightGrayGrid = {
  /** Whether to show grid lines at all */
  enabled: false,
  
  /** Minimum zoom level to show grid lines */
  minZoom: 0,
  
  /** Maximum zoom level to show grid lines (fades out after this) */
  maxZoom: 10,
  
  /** Latitude lines (horizontal) styling */
  latitude: {
    color: "#b0b0b0",  // Medium gray for light theme
    width: {
      min: 1.0,  // Width at minZoom
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.5,  // Moderate opacity
    interval: 10,  // Lines every 10 degrees
    label: {
      enabled: false,  // Enable labels for latitude lines
      color: "#707070",  // Dark gray for labels
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
    color: "#b0b0b0",  // Medium gray for light theme
    width: {
      min: 1.0,  // Width at minZoom
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.5,  // Moderate opacity
    interval: 10,  // Lines every 10 degrees
    label: {
      enabled: false,  // Enable labels for longitude lines
      color: "#707070",  // Dark gray for labels
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

export const lightGrayBoundary = {
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

export const lightGrayBuildings = {
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

export const lightGrayLand = {
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
  overrideColor: "#f0f0f0",  // Default landcover color - used when useOverrideColor is true (matches land.default)
};

// ============================================================================
// LANDUSE CONFIGURATION
// ============================================================================

export const lightGrayLanduse = {
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
  overrideColor: "#f0f0f0",  // Default landuse color - used when useOverrideColor is true (matches landuse.default)
};

// ============================================================================
// WATER CONFIGURATION
// ============================================================================

export const lightGrayWater = {
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
  overrideColor: "#dadada",  // Default water fill color - used when useOverrideColor is true (matches water.fill)
  /** Whether to use a single override color for all waterway (line) types */
  useOverrideColorWaterway: false,  // Set to true to use overrideColorWaterway for all waterway types
  /** Override color to use for all waterway types when useOverrideColorWaterway is true */
  overrideColorWaterway: "#c8c8c8",  // Default waterway line color - used when useOverrideColorWaterway is true (matches water.line)
};

// ============================================================================
// AEROWAY CONFIGURATION
// ============================================================================

export const lightGrayAeroway = {
  /** Whether to show aeroway features at all */
  enabled: false,
  
  /** Runway line styling */
  runway: {
    color: "#808080",        // Medium gray for runways
    width: 0.5,              // Thin lines
    opacity: 0.8,
    majorLength: 2500,       // Minimum length (meters) for major runways shown at z6-7
  },
  
  /** Apron polygon styling */
  apron: {
    fillColor: "#d0d0d0",    // Light gray fill
    fillOpacity: 0.4,        // Semi-transparent
    outlineColor: "#a0a0a0", // Medium gray outline
    outlineWidth: 0.3,       // Thin outline
  },
  
  /** Taxiway line styling */
  taxiway: {
    color: "#a0a0a0",        // Lighter gray than runways
    width: 0.4,              // Slightly thinner than runways
    opacity: 0.7,
  },
  
  /** Helipad point styling */
  helipad: {
    fillColor: "#a0a0a0",    // Medium gray fill
    fillOpacity: 0.6,
    outlineColor: "#808080", // Darker gray outline
    outlineWidth: 0.3,
    size: 4,                 // Circle radius in pixels
  },
  
  /** Airport label styling */
  label: {
    color: "#404040",        // Dark gray text (matches place labels)
    haloColor: "#ffffff",    // White halo for contrast
    haloWidth: 1,
    opacity: 0.9,
    majorSize: { min: 10, max: 12 },      // Font size for major airports (z8-9)
    detailedSize: { min: 10, max: 12 },   // Font size for detailed labels (z13+)
  },
};

// ============================================================================
// COMPLETE THEME
// ============================================================================

export const lightGrayTheme: Theme = {
  name: "Light Gray Basemap",
  fonts,
  labelFonts: lightGrayLabelFonts,
  colors: lightGrayColors,
  widths: lightGrayWidths,
  opacities: lightGrayOpacities,
  settings: lightGraySettings,
  shields: lightGrayShields,
  pois: lightGrayPOIs,
  bathymetry: lightGrayBathymetry,
  contours: lightGrayContours,
  ice: lightGrayIce,
  hillshade: lightGrayHillshade,
  grid: lightGrayGrid,
  boundary: lightGrayBoundary,
  buildings: lightGrayBuildings,
  land: lightGrayLand,
  landuse: lightGrayLanduse,
  water: lightGrayWater,
  aeroway: lightGrayAeroway,
  starfield: lightGrayStarfield,
};
