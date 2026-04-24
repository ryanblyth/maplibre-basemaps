/**
 * Vintage Green Basemap Theme
 * 
 * This file contains ALL configurable values for the vintage-green basemap:
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

export const vintageGreenSettings: ThemeSettings = {
  /** Map projection type - "mercator" for flat map, "globe" for 3D globe */
  projection: "mercator",
  
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
export const vintageGreenLabelFonts: ThemeLabelFonts = {
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

export const vintageGreenColors: ThemeColors = {
  // Background - light gray base
  background: "hsl(40deg 41% 80%)",
  
  land: {
    wood:     "hsl(90, 28%, 70%)",   // Shift hue green, darker — forest canopy
    grass:    "hsl(72, 25%, 76%)",   // Echoes water hue lightly — open meadow
    scrub:    "hsl(80, 22%, 73%)",   // Midpoint between wood and grass
    cropland: "hsl(55, 32%, 78%)",   // Warm straw yellow — cultivated fields
    farmland: "hsl(55, 32%, 78%)",   // Matches cropland
    rock:     "hsl(35, 18%, 66%)",   // Desaturated, darker — exposed stone
    sand:     "hsl(45, 48%, 87%)",   // Lighter, more yellow — dry sandy areas
    wetland:  "hsl(68, 22%, 72%)",   // Leans toward water hue — marshy ground
    default:  "hsl(40, 41%, 80%)",   // Base land color
  },
  
  landuse: {
    park:         "hsl(88, 26%, 73%)",  // Green, slightly lighter than wood
    cemetery:     "hsl(62, 18%, 73%)",  // Muted yellow-green, somber
    pitch:        "hsl(92, 26%, 71%)",  // Slightly more saturated green
    stadium:      "hsl(92, 26%, 71%)",  // Matches pitch
    residential:  "hsl(38, 30%, 84%)",  // Warm, very light — built area
    college:      "hsl(44, 32%, 82%)",  // Warm cream
    commercial:   "hsl(36, 30%, 80%)",  // Slightly cooler than residential
    construction: "hsl(28, 32%, 74%)",  // Darker orange-tan — disturbed earth
    dam:          "hsl(38, 14%, 67%)",  // Neutral, dark — hard structure
    farmland:     "hsl(55, 32%, 78%)",  // Matches land.cropland
    grass:        "hsl(72, 25%, 76%)",  // Matches land.grass
    hospital:     "hsl(38, 24%, 85%)",  // Light, clean, warm white
    industrial:   "hsl(38, 13%, 75%)",  // Desaturated, neutral
    military:     "hsl(68, 20%, 68%)",  // Olive tone — restricted land
    neighbourhood:"hsl(40, 28%, 84%)",  // Very light warm
    quarry:       "hsl(34, 16%, 65%)",  // Dark, rocky, desaturated
    quarter:      "hsl(40, 28%, 84%)",  // Matches neighbourhood
    railway:      "hsl(38, 18%, 74%)",  // Neutral tan — corridor
    retail:       "hsl(35, 28%, 80%)",  // Slightly cooler warm
    school:       "hsl(44, 30%, 81%)",  // Matches college
    suburb:       "hsl(40, 28%, 84%)",  // Matches residential family
    theme_park:   "hsl(50, 36%, 78%)",  // Warmer, slightly saturated
    track:        "hsl(42, 32%, 80%)",  // Neutral warm — path/trail
    university:   "hsl(44, 30%, 81%)",  // Matches college/school
    zoo:          "hsl(85, 24%, 72%)",  // Natural green, close to park
    default:      "hsl(40, 41%, 80%)",  // Base land color
  },
  
  // Water - grayscale based on #dadada
  water: {
    fill:       "hsl(72, 21%, 63%)",   // Base water
    line:       "hsl(0deg 0% 0%)",   // Darker stroke for water edges
    labelColor: "hsl(72, 28%, 32%)",   // Dark sage — readable on water
    labelHalo:  "hsl(40, 38%, 88%)",   // Warm parchment — echoes land color
  
    ocean:      "hsl(72, 21%, 65%)",   // Slightly lighter — vast open water
    sea:        "hsl(72, 21%, 64%)",   // Just above base
    bay:        "hsl(73, 21%, 63%)",   // Base
    gulf:       "hsl(73, 21%, 63%)",   // Matches bay
    lake:       "hsl(74, 22%, 61%)",   // Slightly darker — enclosed
    reservoir:  "hsl(74, 22%, 61%)",   // Matches lake
    pond:       "hsl(75, 22%, 59%)",   // Darker — smaller enclosed
    river:      "hsl(76, 23%, 57%)",   // Darker — flowing water
    canal:      "hsl(76, 23%, 57%)",   // Matches river
    stream:     "hsl(78, 22%, 55%)",   // Darker — smaller flow
    ditch:      "hsl(78, 20%, 52%)",   // Darkest — minor drainage
    drain:      "hsl(78, 20%, 52%)",   // Matches ditch
    default:    "hsl(72, 21%, 63%)",   // Base water
  },
  
  // Boundaries - warm brown tones
  boundary: {
    country: "hsl(40, 22%, 52%)",   // Warm mid-brown — clear but not harsh
    state:   "hsl(40, 18%, 66%)",   // Lighter, less saturated — subordinate
  },
  
  // Roads - warm brown tones
  road: {
    motorway:    "hsl(38, 28%, 62%)",   // Darkest, most saturated — major arterial
    trunk:       "hsl(38, 24%, 66%)",   // Slightly lighter
    primary:     "hsl(38, 20%, 70%)",   // Medium
    secondary:   "hsl(38, 16%, 74%)",   // Lighter
    tertiary:    "hsl(38, 16%, 74%)",   // Matches secondary
    residential: "hsl(38, 13%, 77%)",   // Light — local streets
    service:     "hsl(38, 11%, 79%)",   // Very light — driveways/alleys
    parkingAisle:"hsl(38, 11%, 78%)",   // Slightly darker than service
    other:       "hsl(38, 11%, 79%)",   // Matches service
    casing:      "hsl(38, 32%, 48%)",   // Warm brown — clear edge definition
  
    // Tunnel colors - warm brown tones
    tunnel: {
      motorway:    "hsl(38, 18%, 56%)",  // Muted, darker — underground feel
      trunk:       "hsl(38, 15%, 60%)",
      primary:     "hsl(38, 13%, 64%)",
      secondary:   "hsl(38, 11%, 67%)",
      tertiary:    "hsl(38, 11%, 67%)",
      residential: "hsl(38, 10%, 70%)",
      service:     "hsl(38, 10%, 72%)",
      default:     "hsl(38, 10%, 72%)",
    },
  
    // Bridge colors - warm brown tones
    bridge: {
      motorway:    "hsl(38, 28%, 62%)",  // Matches road
      trunk:       "hsl(38, 24%, 66%)",
      primary:     "hsl(38, 20%, 70%)",
      secondary:   "hsl(38, 16%, 74%)",
      tertiary:    "hsl(38, 16%, 74%)",
      residential: "hsl(38, 13%, 77%)",
      default:     "hsl(38, 13%, 77%)",
      casing:      "hsl(38, 34%, 42%)",  // Darker than road casing — bridge edge pops
    },
  
    tunnelCasing: "hsl(38, 22%, 54%)",  // Between tunnel fill and road casing
  },
  
  path:    "hsl(40, 16%, 72%)",   // Subtle warm trace — footpaths and trails
  railway: "hsl(38, 20%, 50%)",   // Noticeably darker — distinct from all road classes
  
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
      color: "hsl(38, 28%, 28%)",    // Warm dark brown — strong, readable over land
      halo:  "hsl(40, 38%, 90%)",    // Warm parchment — softer than white
      // haloWidth: 2,        // Optional: override place label halo width
      // haloBlur: 1,         // Optional: override place label halo blur
    },
    // Optional: place label display config (uncomment to customize)
    // placeLabels: { suburbMaxRank: 8, villageMaxRank: 15, minZoom: 8 },
    road: {
      major:     { color: "hsl(38, 24%, 34%)", opacity: 0.9  },  // Dark warm brown
      secondary: { color: "hsl(38, 20%, 42%)", opacity: 0.85 },  // Slightly lighter
      tertiary:  { color: "hsl(38, 16%, 50%)", opacity: 0.8  },  // Mid warm
      other:     { color: "hsl(38, 13%, 58%)", opacity: 0.75 },  // Lightest — minor roads
      halo:      "hsl(40, 38%, 90%)",  // Matches place halo
    },
    water: {
      color: "hsl(72, 30%, 28%)",    // Deep sage — reads on water without clashing
      halo:  "hsl(72, 18%, 72%)",    // Water-toned halo — stays in the water family
      // haloWidth: 2,        // Optional: override water label halo width
      // haloBlur: 1,         // Optional: override water label halo blur
    },
    poi: {
      iconColor:      "hsl(38, 22%, 44%)",   // Warm mid-brown — unobtrusive
      iconSize:       0.8,
      textColor:      "hsl(38, 24%, 34%)",   // Matches place label color
      textHalo:       "hsl(40, 38%, 90%)",   // Matches place halo
      textHaloWidth:  1.5,
    },
  },
};

// ============================================================================
// LINE WIDTHS (at different zoom levels)
// ============================================================================

export const vintageGreenWidths: ThemeWidths = {
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

export const vintageGreenOpacities: ThemeOpacities = {
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

export const vintageGreenShields = {
  /** Whether to show highway shields */
  enabled: true,
  
  /** Global minimum zoom for all shields */
  minZoom: 6,
  
  /** Interstate shield settings */
  interstate: {
    enabled: true,
    sprite: "shield-interstate-custom",
    textColor: "hsl(40, 38%, 92%)",        // Warm off-white — easier on the eye than pure white
    minZoom: 6,
    textPadding: [5, 5, 5, 5] as [number, number, number, number],
    textSize: [6, 9, 14, 13] as [number, number, number, number],
    textFont: ["Noto Sans SemiBold"],
    upperBackground: "hsl(38, 28%, 38%)",  // Dark warm brown — strong top band
    lowerBackground: "hsl(38, 22%, 48%)",  // Lighter warm brown — two-tone separation reads clearly
    strokeColor:     "hsl(38, 32%, 30%)",  // Darker border — anchors the shield
    strokeWidth: 2,
  },
  
  /** US Highway shield settings */
  usHighway: {
    enabled: true,
    sprite: "shield-ushighway-custom",
    textColor: "hsl(38, 30%, 22%)",        // Very dark warm brown — high contrast on light bg
    minZoom: 7,
    textPadding: [5, 5, 5, 5] as [number, number, number, number],
    textSize: [6, 9, 14, 13] as [number, number, number, number],
    textFont: ["Noto Sans SemiBold"],
    background:  "hsl(40, 38%, 90%)",      // Warm parchment — echoes land color
    strokeColor: "hsl(38, 28%, 40%)",      // Mid warm brown — clear pentagon outline
    strokeWidth: 2.5,
  },
  
  /** State Highway shield settings */
  stateHighway: {
    enabled: true,
    sprite: "shield-state-custom",
    textColor: "hsl(38, 30%, 22%)",        // Matches US Highway text — consistent family
    minZoom: 8,
    textPadding: [4, 4, 4, 4] as [number, number, number, number],
    textSize: [8, 8, 14, 12] as [number, number, number, number],
    textFont: ["Noto Sans SemiBold"],
    background:  "hsl(40, 32%, 88%)",      // Slightly cooler than US Highway — subtle distinction
    strokeColor: "hsl(38, 22%, 52%)",      // Lighter than US Highway border — lower visual hierarchy
    strokeWidth: 2,
  },
};

// ============================================================================
// STARFIELD CONFIGURATION
// ============================================================================

export const vintageGreenStarfield = {
  /** Starfield glow colors - subtle gray scheme for vintage-green theme */
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

export const vintageGreenPOIs: ThemePOIs = {
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

export const vintageGreenBathymetry = {
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
    // shallow: "hsl(72, 21%, 63%)",   // 0m — base water, lightest
    shallow: "hsl(88deg 14% 51%)",   // 0m — base water, lightest
    // shelf:   "hsl(74, 23%, 58%)",   // 200m — slightly darker, more saturated
    shelf:   "hsl(78deg 17% 57%)",   // 200m — slightly darker, more saturated
    // slope:   "hsl(76, 25%, 53%)",   // 1000m — noticeably deeper
    slope:   "hsl(72deg 20% 61%)",   // 1000m — noticeably deeper
    // deep1:   "hsl(78, 27%, 47%)",   // 2000m — rich mid-depth
    // deep2:   "hsl(80, 29%, 41%)",   // 4000m — dark sage
    // abyss:   "hsl(82, 31%, 35%)",   // 6000m — very dark
    // trench:  "hsl(84, 33%, 28%)",   // 10000m — darkest, most saturated
  },
  
  // depthOpacities: {
  //   shallow: 0.3,
  //   shelf:   0.35,
  //   slope:   0.45,
  //   deep1:   0.55,
  //   deep2:   0.7,
  //   abyss:   0.85,
  //   trench:  1,
  // },
};

// ============================================================================
// CONTOURS CONFIGURATION
// ============================================================================

export const vintageGreenContours = {
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

export const vintageGreenIce = {
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

export const vintageGreenHillshade = {
  /** Whether to show hillshade at all */
  enabled: true,
  
  /** Minimum zoom level to show hillshade (TileJSON minzoom is 1; z0 has no tiles) */
  minZoom: 1,
  
  /** Maximum zoom level to show hillshade (fades out after this) */
  maxZoom: 12,

  /** Native tiles for world_mtn_hillshade only exist through z6 (see TileJSON maxzoom). */
  rasterSourceMaxZoom: 6,
  
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

export const vintageGreenGrid = {
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

export const vintageGreenBoundary = {
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

export const vintageGreenBuildings = {
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

export const vintageGreenLand = {
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

export const vintageGreenLanduse = {
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

export const vintageGreenWater = {
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

export const vintageGreenAeroway = {
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

export const vintageGreenTheme: Theme = {
  name: "Vintage Green Basemap",
  fonts,
  labelFonts: vintageGreenLabelFonts,
  colors: vintageGreenColors,
  widths: vintageGreenWidths,
  opacities: vintageGreenOpacities,
  settings: vintageGreenSettings,
  shields: vintageGreenShields,
  pois: vintageGreenPOIs,
  bathymetry: vintageGreenBathymetry,
  contours: vintageGreenContours,
  ice: vintageGreenIce,
  hillshade: vintageGreenHillshade,
  grid: vintageGreenGrid,
  boundary: vintageGreenBoundary,
  buildings: vintageGreenBuildings,
  land: vintageGreenLand,
  landuse: vintageGreenLanduse,
  water: vintageGreenWater,
  aeroway: vintageGreenAeroway,
  starfield: vintageGreenStarfield,
};
