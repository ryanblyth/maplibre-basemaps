/**
 * Shared theme utilities for MapLibre basemaps
 * 
 * This file contains ONLY things shared across ALL basemaps:
 * - Font stack definitions
 * - TypeScript types for theme structure
 * 
 * Basemap-specific values belong in each basemap's own theme file:
 *   basemaps/<name>/styles/theme.ts
 */

/** Available font stacks (shared across all basemaps) */
export const fonts = {
  regular: ["Noto Sans Regular"] as [string],
  semibold: ["Noto Sans SemiBold"] as [string],
  italic: ["Noto Sans Italic"] as [string],
} as const;

export type FontStack = typeof fonts;

// ============================================================================
// COLOR TYPES
// ============================================================================

/** Type definition for a basemap color palette */
export interface ThemeColors {
  background: string;
  land: {
    wood: string;
    grass: string;
    scrub: string;
    cropland: string;
    default: string;
  };
  landuse: {
    park: string;
    cemetery: string;
    pitch: string;
    stadium: string;
    residential: string;
    default: string;
  };
  water: {
    fill: string;
    line: string;
    labelColor: string;
    labelHalo: string;
  };
  boundary: {
    country: string;
    state: string;
  };
  road: {
    motorway: string;
    trunk: string;
    primary: string;
    secondary: string;
    tertiary: string;
    residential: string;
    service: string;
    parkingAisle?: string;  // Optional - falls back to service if not set
    other: string;
    casing: string;
    // Tunnel colors - optional, inherit from road colors if not set
    tunnel?: {
      motorway: string;
      trunk: string;
      primary: string;
      secondary: string;
      tertiary: string;
      residential: string;
      service: string;
      default: string;
    };
    // Bridge colors - optional, inherit from road colors if not set
    bridge?: {
      motorway: string;
      trunk: string;
      primary: string;
      secondary: string;
      tertiary: string;
      residential: string;
      default: string;
      casing: string;
    };
    tunnelCasing?: string;  // Optional - falls back to casing if not set
  };
  path: string;
  railway: string;
  building: {
    fill: string;
    outline: string;
  };
  label: {
    place: {
      color: string;
      halo: string;
    };
    road: {
      major: { color: string; opacity: number };
      secondary: { color: string; opacity: number };
      tertiary: { color: string; opacity: number };
      other: { color: string; opacity: number };
      halo: string;
    };
    water: {
      color: string;
      halo: string;
    };
    /** POI icon and label styling */
    poi?: {
      iconColor: string;
      iconSize?: number;
      textColor: string;
      textHalo: string;
      textHaloWidth?: number;
    };
    /** Highway shield label styling */
    shield?: {
      interstate: { textColor: string; };
      usHighway: { textColor: string; };
      stateHighway: { textColor: string; };
    };
  };
}

// ============================================================================
// POI TYPES - Point of Interest configuration
// ============================================================================

/** POI visibility and styling configuration */
export interface ThemePOIs {
  /** Whether to show POIs at all */
  enabled: boolean;
  /** Global minimum zoom for all POIs */
  minZoom?: number;
  /** Airport POI settings */
  airport?: {
    enabled: boolean;
    minZoom?: number;
  };
  /** Airfield POI settings */
  airfield?: {
    enabled: boolean;
    minZoom?: number;
  };
  /** Hospital POI settings */
  hospital?: {
    enabled: boolean;
    minZoom?: number;
  };
  /** Museum POI settings */
  museum?: {
    enabled: boolean;
    minZoom?: number;
  };
  /** Zoo POI settings */
  zoo?: {
    enabled: boolean;
    minZoom?: number;
  };
  /** Stadium POI settings */
  stadium?: {
    enabled: boolean;
    minZoom?: number;
  };
  /** Park POI settings */
  park?: {
    enabled: boolean;
    minZoom?: number;
  };
  /** Railway station POI settings */
  rail?: {
    enabled: boolean;
    minZoom?: number;
  };
  /** School/College/University POI settings */
  school?: {
    enabled: boolean;
    minZoom?: number;
  };
}

// ============================================================================
// SHIELD TYPES - Highway shield configuration
// ============================================================================

/** Highway shield visibility and styling */
export interface ThemeShields {
  /** Whether to show highway shields at all */
  enabled: boolean;
  /** Minimum zoom level to show shields */
  minZoom?: number;
  /** Interstate shield settings */
  interstate: {
    enabled: boolean;
    sprite: string;
    textColor: string;
    minZoom?: number;
    /** Text padding [top, right, bottom, left] in pixels */
    textPadding?: [number, number, number, number];
    /** Font size at different zoom levels [minZoom, minSize, maxZoom, maxSize] */
    textSize?: [number, number, number, number];
    /** Font family (e.g., "Noto Sans Bold") */
    textFont?: string[];
    /** Custom shield colors (only for shield-interstate-custom sprite) */
    upperBackground?: string;
    lowerBackground?: string;
    strokeColor?: string;
    strokeWidth?: number;
  };
  /** US Highway shield settings */
  usHighway: {
    enabled: boolean;
    sprite: string;
    textColor: string;
    minZoom?: number;
    /** Text padding [top, right, bottom, left] in pixels */
    textPadding?: [number, number, number, number];
    /** Font size at different zoom levels [minZoom, minSize, maxZoom, maxSize] */
    textSize?: [number, number, number, number];
    /** Font family (e.g., "Noto Sans Bold") */
    textFont?: string[];
    /** Custom shield colors (only for shield-ushighway-custom sprite) */
    background?: string;
    strokeColor?: string;
    strokeWidth?: number;
  };
  /** State Highway shield settings */
  stateHighway: {
    enabled: boolean;
    sprite: string;
    textColor: string;
    minZoom?: number;
    /** Text padding [top, right, bottom, left] in pixels */
    textPadding?: [number, number, number, number];
    /** Font size at different zoom levels [minZoom, minSize, maxZoom, maxSize] */
    textSize?: [number, number, number, number];
    /** Font family (e.g., "Noto Sans Bold") */
    textFont?: string[];
    /** Custom shield colors (only for shield-state-custom sprite) */
    background?: string;
    strokeColor?: string;
    strokeWidth?: number;
  };
}

// ============================================================================
// WIDTH TYPES - Line widths at different zoom levels
// ============================================================================

/** Zoom-based width stops: [zoom, width] pairs */
export interface ZoomWidths {
  z0?: number;
  z3?: number;
  z6?: number;
  z8?: number;
  z10?: number;
  z12?: number;
  z14?: number;
  z15?: number;
}

/** Road class widths at different zoom levels */
export interface RoadClassWidths {
  motorway: ZoomWidths;
  trunk: ZoomWidths;
  primary: ZoomWidths;
  secondary: ZoomWidths;
  tertiary: ZoomWidths;
  residential: ZoomWidths;
  service: ZoomWidths;
  default: ZoomWidths;
}

/** Theme widths configuration */
export interface ThemeWidths {
  boundary: {
    country: ZoomWidths;
    state: ZoomWidths;
  };
  water: {
    line: ZoomWidths;
  };
  road: RoadClassWidths;
  roadCasing: RoadClassWidths;
  // Tunnel/bridge widths - optional, inherit from road if not set
  tunnel?: ZoomWidths;
  tunnelCasing?: ZoomWidths;
  bridge?: ZoomWidths;
  bridgeCasing?: ZoomWidths;
  // Tunnel/bridge road class widths - optional, inherit from road if not set
  tunnelRoad?: RoadClassWidths;
  bridgeRoad?: RoadClassWidths;
  path: ZoomWidths;
  railway: ZoomWidths;
}

// ============================================================================
// OPACITY TYPES
// ============================================================================

/** Theme opacities configuration */
export interface ThemeOpacities {
  landcover: number;
  landuse: number;
  building: number;
  boundary: {
    country: ZoomWidths;  // Can vary by zoom
    state: number;
    maritime: number;
  };
  tunnel: number;
  label: {
    place: number;
    water: number;
    waterway: number;
  };
}

// ============================================================================
// THEME SETTINGS
// ============================================================================

/** Theme settings for behavior configuration */
export interface ThemeSettings {
  /** 
   * When true, road widths scale proportionally to real-world sizes at zoom 15+.
   * Roads will double in pixel width with each zoom level to match map scale.
   * Default: false (uses fixed pixel widths that don't scale with zoom)
   */
  realWorldScale?: boolean;
  
  /**
   * The zoom level at which real-world scaling begins.
   * Below this zoom, roads use fixed pixel widths.
   * Default: 15
   */
  realWorldScaleMinZoom?: number;
  
  /**
   * Map projection type.
   * - "mercator" - Standard Web Mercator projection (flat map)
   * - "globe" - 3D globe projection
   * Default: "globe"
   */
  projection?: "mercator" | "globe";
  
  /**
   * Minimum zoom level for the map.
   * Can be different for globe vs mercator projections.
   * Default: { mercator: 0, globe: 2 }
   */
  minZoom?: {
    mercator?: number;
    globe?: number;
  } | number; // Also supports a single number for both projections
}

// ============================================================================
// BATHYMETRY TYPES - Ocean depth visualization
// ============================================================================

/** Bathymetry color configuration - colors for each depth level */
export interface ThemeBathymetryColors {
  /** Color for 0m depth (shallowest) */
  shallow?: string;
  /** Color for 200m depth (shelf) */
  shelf?: string;
  /** Color for 1000m depth (slope) */
  slope?: string;
  /** Color for 2000m depth (deep1) */
  deep1?: string;
  /** Color for 4000m depth (deep2) */
  deep2?: string;
  /** Color for 6000m depth (abyss) */
  abyss?: string;
  /** Color for 10000m depth (trench/deepest) */
  trench?: string;
}

/** Bathymetry opacity configuration - opacity for each depth level */
export interface ThemeBathymetryOpacities {
  /** Opacity for 0m depth (shallowest) - typically highest */
  shallow?: number;
  /** Opacity for 200m depth (shelf) */
  shelf?: number;
  /** Opacity for 1000m depth (slope) */
  slope?: number;
  /** Opacity for 2000m depth (deep1) */
  deep1?: number;
  /** Opacity for 4000m depth (deep2) */
  deep2?: number;
  /** Opacity for 6000m depth (abyss) */
  abyss?: number;
  /** Opacity for 10000m depth (trench/deepest) - typically lowest */
  trench?: number;
}

/** Bathymetry visibility and styling configuration */
export interface ThemeBathymetry {
  /** Whether to show bathymetry at all */
  enabled: boolean;
  /** Minimum zoom level to show bathymetry */
  minZoom?: number;
  /** Maximum zoom level to show bathymetry (fades out after this) */
  maxZoom?: number;
  /** Base opacity range: [minZoom opacity, maxZoom opacity] - used if depth opacities not specified */
  opacity?: {
    min: number;
    max: number;
  };
  /** Custom colors for each depth level. If not provided, colors are auto-generated from water color */
  colors?: ThemeBathymetryColors;
  /** Custom opacity for each depth level. If not provided, opacities are auto-generated (shallow=high, deep=low) */
  depthOpacities?: ThemeBathymetryOpacities;
}

// ============================================================================
// CONTOURS TYPES - Topographic contour lines
// ============================================================================

/** Contours visibility and styling configuration */
export interface ThemeContours {
  /** Whether to show contours at all */
  enabled: boolean;
  /** Minimum zoom level to show contours */
  minZoom?: number;
  /** Maximum zoom level to show contours (fades out after this) */
  maxZoom?: number;
  /** Major contour line styling */
  major?: {
    /** Line color for major contours */
    color?: string;
    /** Line width for major contours */
    width?: {
      min: number;
      max: number;
    };
    /** Line opacity for major contours */
    opacity?: number;
    /** Minimum zoom for major contours */
    minZoom?: number;
  };
  /** Minor contour line styling */
  minor?: {
    /** Line color for minor contours */
    color?: string;
    /** Line width for minor contours */
    width?: {
      min: number;
      max: number;
    };
    /** Line opacity for minor contours */
    opacity?: number;
    /** Minimum zoom for minor contours */
    minZoom?: number;
  };
}

// ============================================================================
// ICE TYPES - Ice sheets, glaciers, and ice shelves
// ============================================================================

/** Ice visibility and styling configuration */
export interface ThemeIce {
  /** Whether to show ice at all */
  enabled: boolean;
  /** Minimum zoom level to show ice */
  minZoom?: number;
  /** Maximum zoom level to show ice (fades out after this) */
  maxZoom?: number;
  /** Base opacity range: [minZoom opacity, maxZoom opacity] */
  opacity?: {
    min: number;
    max: number;
  };
  /** Glaciated areas (glaciers, ice caps) styling */
  glaciated?: {
    /** Fill color for glaciated areas */
    color?: string;
    /** Fill opacity for glaciated areas */
    opacity?: number;
  };
  /** Ice shelves styling */
  iceShelves?: {
    /** Fill color for ice shelves */
    color?: string;
    /** Fill opacity for ice shelves */
    opacity?: number;
  };
  /** Ice edge (outline) styling */
  iceEdge?: {
    /** Line color for ice edges */
    color?: string;
    /** Line width for ice edges */
    width?: number;
    /** Line opacity for ice edges */
    opacity?: number;
    /** Whether to show ice edge lines. Set to false to disable. */
    enabled?: boolean;
  } | null; // Set to null to disable ice edge layer completely
}

// ============================================================================
// COMPLETE THEME TYPE
// ============================================================================

/** Type definition for a complete basemap theme */
export interface Theme {
  name: string;
  fonts: FontStack;
  colors: ThemeColors;
  widths: ThemeWidths;
  opacities: ThemeOpacities;
  settings?: ThemeSettings;
  /** Highway shield configuration - optional, defaults to enabled with standard sprites */
  shields?: ThemeShields;
  /** POI configuration - optional, defaults to all enabled */
  pois?: ThemePOIs;
  /** Bathymetry configuration - optional, defaults to disabled */
  bathymetry?: ThemeBathymetry;
  /** Contours configuration - optional, defaults to disabled */
  contours?: ThemeContours;
  /** Ice configuration - optional, defaults to disabled */
  ice?: ThemeIce;
}
