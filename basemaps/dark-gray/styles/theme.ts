/**
 * Dark Gray Basemap Theme
 * 
 * This file contains ALL configurable values for the dark-gray basemap:
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
  type ThemeSettings
} from "../../../shared/styles/theme.js";

// ============================================================================
// SETTINGS
// ============================================================================

export const darkGraySettings: ThemeSettings = {
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
};

// ============================================================================
// COLORS
// ============================================================================

export const darkGrayColors: ThemeColors = {
  // Background
  background: "#212121",
  
  // Land/terrain - Harmonious monochrome grays based on #212121
  land: {
    wood: "#1f1f1f",      // Slightly darker gray
    grass: "#252525",     // Slightly lighter gray
    scrub: "#262626",     // Lighter gray
    cropland: "#272727",   // Lighter gray
    farmland: "#272727",   // Same as cropland
    rock: "#232323",      // Very slightly lighter gray
    sand: "#282828",      // Lighter gray
    wetland: "#202020",   // Slightly darker gray
    default: "#242424",   // Neutral gray - default/unknown
  },
  
  // Landuse - Harmonious monochrome grays based on #212121
  landuse: {
    park: "#252525",        // Lighter gray
    cemetery: "#252525",    // Lighter gray
    pitch: "#262626",       // Lighter gray
    stadium: "#262626",     // Lighter gray
    residential: "#232323", // Slightly lighter gray
    // Additional landuse classes - subtle gray variations
    college: "#252525",     // Lighter gray
    commercial: "#252525",  // Lighter gray
    construction: "#242424", // Neutral gray
    dam: "#242424",         // Neutral gray
    farmland: "#272727",     // Matches land.cropland
    grass: "#252525",       // Matches land.grass
    hospital: "#252525",    // Lighter gray
    industrial: "#242424",  // Neutral gray
    military: "#1f1f1f",    // Darker gray
    neighbourhood: "#242424", // Neutral gray
    quarry: "#242424",      // Neutral gray
    quarter: "#242424",     // Neutral gray
    railway: "#242424",     // Neutral gray
    retail: "#252525",      // Lighter gray
    school: "#252525",      // Lighter gray
    suburb: "#242424",      // Neutral gray
    theme_park: "#252525",  // Lighter gray
    track: "#252525",       // Lighter gray
    university: "#252525",   // Lighter gray
    zoo: "#252525",         // Lighter gray
    default: "#242424",     // Neutral gray - default
  },
  
  // Water - Harmonious monochrome grays (darker than background)
  water: {
    fill: "#080808",      // Darker gray
    line: "#1e1e1e",      // Slightly lighter than fill
    labelColor: "#424242", // Lighter gray for labels
    labelHalo: "#1c1c1c",  // Dark halo
    // Water class colors - subtle gray variations
    ocean: "#080808",      // Base dark gray - ocean (matches fill)
    sea: "#080808",       // Slightly lighter gray - sea
    lake: "#080808",      // Slightly lighter gray - lake
    pond: "#080808",      // Slightly lighter gray - pond
    river: "#080808",     // Matches line color - river
    canal: "#080808",     // Same as river - canal
    stream: "#080808",    // Slightly lighter gray - stream
    ditch: "#080808",     // Slightly lighter gray - ditch
    drain: "#080808",     // Same as ditch - drain
    bay: "#080808",       // Same as sea - bay
    gulf: "#080808",      // Same as sea - gulf
    reservoir: "#080808", // Same as lake - reservoir
    default: "#080808",   // Default water color (matches fill)
  },
  
  // Boundaries - Harmonious monochrome grays (subtle, low-contrast)
  boundary: {
    country: "#9a9a9a",      // Subtle lighter gray
    state: "#6e6e6e",         // Slightly darker gray
  },
  
  // Roads - Harmonious monochrome grays with progressive lightness for hierarchy
  road: {
    motorway: "#5e5e5e",      // Lightest gray for visibility
    trunk: "#595959",         // Slightly darker
    primary: "#545454",       // Progressively darker
    secondary: "#4f4f4f",     // Progressively darker
    tertiary: "#4a4a4a",      // Progressively darker
    residential: "#454545",  // Progressively darker
    service: "#404040",       // Progressively darker
    parkingAisle: "#3d3d3d",  // Darkest road color
    other: "#404040", 
    casing: "#141414",        // Very dark gray for outlines
    
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
  
  // Paths - Harmonious monochrome gray
  path: "#292929",
  
  // Railway - Harmonious monochrome gray
  railway: "#282828",
  
  // Buildings - Harmonious monochrome grays with height-based variations
  building: {
    fill: "#282828",      // Slightly lighter than background
    outline: "#1e1e1e",   // Darker gray for outline
    // Height-based building colors (buildings don't have class property)
    // Colors vary by building height (render_height) - subtle gradient from dark to slightly lighter
    short: "#282828",      // Base gray - short buildings (0-10m)
    medium: "#2b2b2b",     // Slightly lighter gray - medium buildings (10-50m)
    tall: "#2e2e2e",       // Lighter gray - tall buildings (50-150m)
    skyscraper: "#323232", // Lighter gray - skyscrapers (150-300m)
    supertall: "#353535",  // Even lighter gray - supertall buildings (300-600m)
    megatall: "#383838",   // Lightest gray - megatall buildings (600m+)
    default: "#282828",    // Default building color (matches short)
  },
  
  // Labels - Harmonious monochrome grays with good contrast
  label: {
    place: {
      color: "#c1c1c1",      // Light gray for good contrast
      halo: "#313131",       // Very dark halo
    },
    road: {
      major: { color: "#a1a1a1", opacity: 0.8 },      // Light gray
      secondary: { color: "#a1a1a1", opacity: 0.7 },  // Medium gray
      tertiary: { color: "#a1a1a1", opacity: 0.7 },   // Darker gray
      other: { color: "#a1a1a1", opacity: 0.7 },      // Darker gray
      halo: "#313131",       // Very dark halo
    },
    water: {
      color: "#c1c1c1",      // Medium gray for labels
      halo: "#313131",       // Dark halo matching water fill
    },
    poi: {
      iconColor: "#a1a1a1",           // Medium gray for icons
      iconSize: 0.8,                   // Slightly smaller icons
      textColor: "#a1a1a1",            // Light gray for labels
      textHalo: "#313131",             // Very dark halo for contrast
      textHaloWidth: 1.5,
    },
  },
};

// ============================================================================
// LINE WIDTHS (at different zoom levels)
// ============================================================================

export const darkGrayWidths: ThemeWidths = {
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

export const darkGrayOpacities: ThemeOpacities = {
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

export const darkGrayShields = {
  /** Whether to show highway shields */
  enabled: true,
  
  /** Global minimum zoom for all shields */
  minZoom: 6,
  
  /** Interstate shields (I-70, I-95, etc.) */
  interstate: {
    enabled: true,
    sprite: "shield-interstate-custom",
    textColor: "#8d8d8d",                 // Light blue-gray text
    minZoom: 6,
    textPadding: [5, 5, 5, 5] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [6, 9, 14, 13] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    // Custom shield appearance - subtle two-tone for dark theme
    upperBackground: "#4d4d4d",           // Slightly lighter dark blue
    lowerBackground: "#4d4d4d",           // Darker blue background
    strokeColor: "#4d4d4d",               // Subtle blue-gray border
    strokeWidth: 2,
  },
  
  /** US Highway shields (US-1, US-66, etc.) */
  usHighway: {
    enabled: true,
    sprite: "shield-ushighway-custom",
    textColor: "#8d8d8d",                 // Light blue-gray text
    minZoom: 7,
    textPadding: [5, 5, 5, 5] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [6, 9, 14, 13] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    // Custom shield appearance - subtle for dark theme
    background: "#4d4d4d",                // Dark blue background
    strokeColor: "#4d4d4d",               // Subtle blue-gray border
    strokeWidth: 2.5,
  },
  
  /** State Highway shields */
  stateHighway: {
    enabled: true,
    sprite: "shield-state-custom",
    textColor: "#8d8d8d",                 // Light blue-gray text
    minZoom: 8,
    textPadding: [4, 4, 4, 4] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [8, 8, 14, 12] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    // Custom shield appearance - subtle oval for dark theme
    background: "#4d4d4d",                // Dark blue background
    strokeColor: "#3c3c3c",               // Subtle blue-gray border
    strokeWidth: 1,                       // Border thickness (adjustable - reduce if cutoff occurs)
  },
};

// ============================================================================
// STARFIELD CONFIGURATION
// ============================================================================

export const darkGrayStarfield = {
  /** Starfield glow colors - monochrome grays for dark-gray theme */
  glowColors: {
    inner: "rgba(200, 200, 200, 0.9)",   // Light gray
    middle: "rgba(150, 150, 150, 0.7)",  // Medium gray
    outer: "rgba(100, 100, 100, 0.4)",   // Dark gray
    fade: "rgba(50, 50, 50, 0)"          // Very dark gray
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

export const darkGrayPOIs: ThemePOIs = {
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

export const darkGrayBathymetry = {
  /** Whether to show bathymetry at all */
  enabled: true,
  
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
    shallow: "#0a0a0a",  // 0m - shallowest (lighter than water)
    shelf: "#080808",    // 200m - shelf
    slope: "#080808",    // 1000m - slope
    deep1: "#070707",    // 2000m - deep1
    deep2: "#060606",    // 4000m - deep2
    abyss: "#050505",    // 6000m - abyss
    trench: "#040404",   // 10000m - trench (deepest)
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

export const darkGrayContours = {
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

export const darkGrayIce = {
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

export const darkGrayHillshade = {
  /** Whether to show hillshade at all */
  enabled: true,
  
  /** Minimum zoom level to show hillshade */
  minZoom: 0,
  
  /** Maximum zoom level to show hillshade (fades out after this) */
  maxZoom: 12,
  
  /** Base opacity for hillshade (0.0 to 1.0) */
  opacity: 0.25,
  
  /** Illumination direction (0-360 degrees, where 0 is north, 90 is east) */
  illuminationDirection: 335,  // Northwest (typical for natural lighting)
  
  /** Illumination anchor - "map" (fixed to map) or "viewport" (fixed to viewport) */
  illuminationAnchor: "viewport" as const,
  
  /** Exaggeration factor for terrain relief (0.0 to 1.0, higher = more dramatic) */
  exaggeration: 0.25,
  
  /** Shadow color (darker areas) */
  shadowColor: "#121212",
  
  /** Highlight color (lighter areas) */
  highlightColor: "#1a1a1a",
  
  /** Accent color (mid-tones) */
  accentColor: "#121212",
};

// ============================================================================
// GRID CONFIGURATION
// ============================================================================

export const darkGrayGrid = {
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

export const darkGrayBoundary = {
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

export const darkGrayBuildings = {
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

export const darkGrayLand = {
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

export const darkGrayLanduse = {
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

export const darkGrayWater = {
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

export const darkGrayAeroway = {
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

export const darkGrayTheme: Theme = {
  name: "Dark Gray Basemap",
  fonts,
  colors: darkGrayColors,
  widths: darkGrayWidths,
  opacities: darkGrayOpacities,
  settings: darkGraySettings,
  shields: darkGrayShields,
  pois: darkGrayPOIs,
  bathymetry: darkGrayBathymetry,
  contours: darkGrayContours,
  ice: darkGrayIce,
  hillshade: darkGrayHillshade,
  grid: darkGrayGrid,
  boundary: darkGrayBoundary,
  buildings: darkGrayBuildings,
  land: darkGrayLand,
  landuse: darkGrayLanduse,
  water: darkGrayWater,
  aeroway: darkGrayAeroway,
  starfield: darkGrayStarfield,
};
