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
    other: string;
    casing: string;
    tunnel: {
      motorway: string;
      trunk: string;
      primary: string;
      secondary: string;
      tertiary: string;
      residential: string;
      service: string;
      default: string;
    };
    bridge: {
      motorway: string;
      trunk: string;
      primary: string;
      secondary: string;
      tertiary: string;
      residential: string;
      default: string;
      casing: string;
    };
    tunnelCasing: string;
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
  tunnel: ZoomWidths;
  tunnelCasing: ZoomWidths;
  bridge: ZoomWidths;
  bridgeCasing: ZoomWidths;
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
// COMPLETE THEME TYPE
// ============================================================================

/** Type definition for a complete basemap theme */
export interface Theme {
  name: string;
  fonts: FontStack;
  colors: ThemeColors;
  widths: ThemeWidths;
  opacities: ThemeOpacities;
}
