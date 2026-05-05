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
 * Available fonts (from CDN at https://assets.storypath.studio/glyphs/):
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
  // Background - cool "paper" (sync label halos to this)
  background: "#f0f2f4",
  
  // Land/terrain - cool-neutral grays, wider spread vs water/roads
  land: {
    wood: "#d8dce0",      // Darker - forests
    grass: "#e2e6ea",
    scrub: "#dfe3e7",     // Between wood and grass
    cropland: "#e6eaee",  // Light
    farmland: "#e6eaee",  // Same as cropland
    rock: "#d0d4d8",      // Darker - rocky terrain
    sand: "#e8ebef",      // Lighter
    wetland: "#d9dde2",   // Darker - wet areas
    default: "#e3e7eb",   // Default landcover
  },
  
  // Landuse - cool-neutral variations
  landuse: {
    park: "#d9dde2",
    cemetery: "#dfe3e7",
    pitch: "#d5d9de",       // Sports fields - slightly darker
    stadium: "#d5d9de",
    residential: "#e8ebef",
    college: "#e1e5e9",
    commercial: "#e3e7eb",
    construction: "#d9dde2",
    dam: "#d0d4d8",
    farmland: "#e6eaee",
    grass: "#e2e6ea",
    hospital: "#e0e4e8",
    industrial: "#d9dde2",
    military: "#d5d9de",
    neighbourhood: "#e8ebef",
    quarry: "#d0d4d8",
    quarter: "#e8ebef",
    railway: "#d9dde2",
    retail: "#e3e7eb",
    school: "#e1e5e9",
    suburb: "#e8ebef",
    theme_park: "#d9dde2",
    track: "#e2e6ea",
    university: "#e1e5e9",
    zoo: "#d9dde2",
    default: "#e3e7eb",
  },
  
  // Water - recessed plane, clearly darker than land
  water: {
    fill: "#c4c9cf",
    line: "#aeb4bc",
    labelColor: "#5c6168",
    labelHalo: "#f0f2f4",
    ocean: "#c4c9cf",
    sea: "#c6cbd1",
    lake: "#c2c7cd",
    pond: "#bfc4cb",
    river: "#bcc2c9",
    canal: "#bcc2c9",
    stream: "#b9bfc6",
    ditch: "#b4bac2",
    drain: "#b4bac2",
    bay: "#c6cbd1",
    gulf: "#c6cbd1",
    reservoir: "#c2c7cd",
    default: "#c4c9cf",
  },
  
  // Boundaries - slightly deeper for crisp linework
  boundary: {
    country: "#90969e",
    state: "#a8aeb6",
  },
  
  // Roads - hierarchy above general land; dark casings for crisp edges
  road: {
    motorway: "#cfd4d9",
    trunk: "#d2d7dc",
    primary: "#d5d9de",
    secondary: "#dde1e5",
    tertiary: "#dde1e5",
    residential: "#dde1e5",
    service: "#dfe3e7",
    parkingAisle: "#dde0e5",
    other: "#dfe3e7",
    casing: "#9aa2ab",
    
    tunnel: {
      motorway: "#c7ccd2",
      trunk: "#cad0d6",
      primary: "#cdd2d8",
      secondary: "#d5d9de",
      tertiary: "#d5d9de",
      residential: "#d5d9de",
      service: "#d7dce1",
      default: "#d7dce1",
    },
    
    bridge: {
      motorway: "#cfd4d9",
      trunk: "#d2d7dc",
      primary: "#d5d9de",
      secondary: "#dde1e5",
      tertiary: "#dde1e5",
      residential: "#dde1e5",
      default: "#dde1e5",
      casing: "#9aa2ab",
    },
    
    tunnelCasing: "#aeb4bc",
  },
  
  path: "#b8bfc7",
  
  railway: "#90969e",
  
  building: {
    fill: "#d5d9de",
    outline: "#b8bfc7",
    short: "#d5d9de",
    medium: "#cfd4d9",
    tall: "#c9ced4",
    skyscraper: "#c4c9cf",
    supertall: "#bcc2c9",
    megatall: "#b4bac2",
    default: "#d5d9de",
  },
  
  label: {
    place: {
      color: "#3d4248",
      halo: "#f0f2f4",
    },
    road: {
      major: { color: "#4a4f56", opacity: 0.9 },
      secondary: { color: "#5c6168", opacity: 0.85 },
      tertiary: { color: "#6d7279", opacity: 0.8 },
      other: { color: "#7a8088", opacity: 0.75 },
      halo: "#f0f2f4",
    },
    water: {
      color: "#5c6168",
      halo: "#f0f2f4",
    },
    poi: {
      iconColor: "#5c6168",
      iconSize: 0.8,
      textColor: "#4a4f56",
      textHalo: "#f0f2f4",
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
    country: { z0: 0.3, z3: 0.3, z6: 0.8, z10: 0.85 },
    state: 0.65,
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
    textColor: "#f0f2f4",                 // Light text on darker gray shield
    minZoom: 6,
    textPadding: [5, 5, 5, 5] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [6, 9, 14, 13] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    upperBackground: "#9aa2ab",
    lowerBackground: "#aeb4bc",
    strokeColor: "#9aa2ab",
    strokeWidth: 2,
  },
  
  /** US Highway shields (US-1, US-66, etc.) */
  usHighway: {
    enabled: true,
    sprite: "shield-ushighway-custom",
    textColor: "#3d4248",
    minZoom: 7,
    textPadding: [5, 5, 5, 5] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [6, 9, 14, 13] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    background: "#e3e7eb",
    strokeColor: "#5c6168",
    strokeWidth: 2.5,
  },
  
  /** State Highway shields */
  stateHighway: {
    enabled: true,
    sprite: "shield-state-custom",
    textColor: "#3d4248",
    minZoom: 8,
    textPadding: [4, 4, 4, 4] as [number, number, number, number],  // [top, right, bottom, left]
    textSize: [8, 8, 14, 12] as [number, number, number, number],  // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans SemiBold"],     // Font family
    background: "#e3e7eb",
    strokeColor: "#7a8088",
    strokeWidth: 2,                       // Border thickness
  },
};

// ============================================================================
// STARFIELD CONFIGURATION
// ============================================================================

export const lightGrayStarfield = {
  /** Deep neutral “space” — well below darkest map water (~#b4bac2) */
  containerBackground: "#2e2e2e",
  glowColors: {
    inner: "rgba(198, 198, 198, 0.38)",
    middle: "rgba(95, 95, 95, 0.48)",
    outer: "rgba(52, 52, 52, 0.46)",
    fade: "rgba(46, 46, 46, 0)",
  },
  starCount: 100,
  glowIntensity: 0.44,
  glowSizeMultiplier: 1.15,
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
    shallow: "#c0c5cc",
    shelf: "#b8bec6",
    slope: "#b0b6bf",
    deep1: "#a8aeb7",
    deep2: "#a0a7b0",
    abyss: "#989fa9",
    trench: "#9097a2",
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
    color: "#90969e",
    width: {
      min: 0.5,  // Width at minZoom
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.5,
    minZoom: 4,  // Major contours start at z4
  },
  
  /** Minor contour line styling (350m intervals) */
  minor: {
    color: "#a8aeb6",
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
    color: "#f0f2f4",
    opacity: 0.9,
  },
  
  /** Ice shelves */
  iceShelves: {
    color: "#e8ebef",
    opacity: 0.9,
  },
  
  /** Ice edge (outline) - set to null or enabled: false to disable */
  iceEdge: {
    enabled: false,  // Outline of ice shelves (Antarctica only)
    color: "#aeb4bc",
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
  
  /** Minimum zoom level to show hillshade (TileJSON minzoom is 1; z0 has no tiles) */
  minZoom: 1,
  
  /** Maximum zoom level to show hillshade (fades out after this) */
  maxZoom: 12,

  /** Native tiles for world_mtn_hillshade only exist through z6 (see TileJSON maxzoom). */
  rasterSourceMaxZoom: 6,
  
  opacity: 0.37,
  
  /** Illumination direction (0-360 degrees, where 0 is north, 90 is east) */
  illuminationDirection: 335,  // Northwest (typical for natural lighting)
  
  /** Illumination anchor - "map" (fixed to map) or "viewport" (fixed to viewport) */
  illuminationAnchor: "viewport" as const,
  
  /** Exaggeration factor for terrain relief (0.0 to 1.0, higher = more dramatic) */
  exaggeration: 0.33,
  
  shadowColor: "#e0e4e8",
  
  highlightColor: "#e8ebef",
  
  accentColor: "#e2e6ea",
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
    color: "#a0a6ae",
    width: {
      min: 1.0,  // Width at minZoom
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.5,  // Moderate opacity
    interval: 10,  // Lines every 10 degrees
    label: {
      enabled: false,  // Enable labels for latitude lines
      color: "#5c6168",
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
    color: "#a0a6ae",
    width: {
      min: 1.0,  // Width at minZoom
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.5,  // Moderate opacity
    interval: 10,  // Lines every 10 degrees
    label: {
      enabled: false,  // Enable labels for longitude lines
      color: "#5c6168",
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
  overrideColor: "#e3e7eb",  // Default landcover color - used when useOverrideColor is true (matches land.default)
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
  overrideColor: "#e3e7eb",  // Default landuse color - used when useOverrideColor is true (matches landuse.default)
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
  overrideColor: "#c4c9cf",  // Default water fill color - used when useOverrideColor is true (matches water.fill)
  /** Whether to use a single override color for all waterway (line) types */
  useOverrideColorWaterway: false,  // Set to true to use overrideColorWaterway for all waterway types
  /** Override color to use for all waterway types when useOverrideColorWaterway is true */
  overrideColorWaterway: "#aeb4bc",  // Default waterway line color - used when useOverrideColorWaterway is true (matches water.line)
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
    color: "#3d4248",
    haloColor: "#f0f2f4",
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
