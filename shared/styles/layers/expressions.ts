/**
 * Shared MapLibre expressions for layer styling
 * 
 * These functions generate MapLibre expression arrays based on theme values.
 */

import type {
  ExpressionSpecification,
  FilterSpecification,
} from "@maplibre/maplibre-gl-style-spec";
import type { ThemeColors, ZoomWidths, RoadClassWidths } from "../theme.js";

/** Fill/line color paint values: literal hex string or expression */
export type ColorPaintValue = string | ExpressionSpecification;

/**
 * Linear `["interpolate",["linear"],["zoom"], ...]` for numeric layout/paint (line-width, text-size, opacity, etc.).
 */
export function interpolateLinearZoomNumeric(
  ...zoomAndValues: number[]
): ExpressionSpecification {
  return ["interpolate", ["linear"], ["zoom"], ...zoomAndValues] as ExpressionSpecification;
}

/** @maplibre/maplibre-gl-style-spec ColorSpecification is `string` */
export type ThemeRoadTunnelPalette = NonNullable<ThemeColors["road"]["tunnel"]>;
export type ThemeRoadBridgePalette = NonNullable<ThemeColors["road"]["bridge"]>;

// ============================================================================
// WIDTH EXPRESSION HELPERS
// ============================================================================

const ZOOM_KEY_TO_LEVEL: Record<string, number> = {
  z0: 0, z3: 3, z6: 6, z8: 8, z10: 10, z12: 12, z14: 14, z15: 15,
};

/** Converts ZoomWidths to interpolate expression */
export function zoomWidthExpr(widths: ZoomWidths): ExpressionSpecification {
  const entries = Object.entries(widths)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => [ZOOM_KEY_TO_LEVEL[k]!, v as number] as [number, number])
    .sort((a, b) => a[0] - b[0]);
  const flatStops = entries.flatMap(([z, w]) => [z, w]);
  return ["interpolate", ["linear"], ["zoom"], ...flatStops] as ExpressionSpecification;
}

/** Creates road width expression based on class at a given zoom */
function roadClassWidthAtZoom(
  widths: RoadClassWidths,
  zoomKey: keyof ZoomWidths
): ExpressionSpecification {
  return ["match", ["get", "class"],
    "motorway", widths.motorway[zoomKey] ?? widths.default[zoomKey],
    "trunk", widths.trunk[zoomKey] ?? widths.default[zoomKey],
    "primary", widths.primary[zoomKey] ?? widths.default[zoomKey],
    "secondary", widths.secondary[zoomKey] ?? widths.default[zoomKey],
    "tertiary", widths.tertiary[zoomKey] ?? widths.default[zoomKey],
    "residential", widths.residential[zoomKey] ?? widths.default[zoomKey],
    "service", widths.service[zoomKey] ?? widths.default[zoomKey],
    "minor", widths.residential[zoomKey] ?? widths.default[zoomKey],  // minor roads use residential width
    "unclassified", widths.residential[zoomKey] ?? widths.default[zoomKey],  // unclassified roads use residential width
    widths.default[zoomKey] ?? 0.5
  ] as ExpressionSpecification;
}

/** Creates interpolated road width expression from theme */
export function roadWidthExpr(widths: RoadClassWidths): ExpressionSpecification {
  return [
    "interpolate",
    ["linear"],
    ["zoom"],
    6, roadClassWidthAtZoom(widths, "z6"),
    12, roadClassWidthAtZoom(widths, "z12"),
    15, roadClassWidthAtZoom(widths, "z15"),
  ] as ExpressionSpecification;
}

/**
 * Creates road width expression with real-world scaling at high zoom levels.
 * 
 * At zoom levels below minZoom, uses linear interpolation (fixed pixel sizes).
 * At zoom levels >= minZoom, uses exponential base 2 (widths double each zoom level).
 * This makes roads scale proportionally to buildings and other features at high zoom.
 * 
 * @param widths - Road class widths from theme
 * @param minZoom - Zoom level where real-world scaling begins (default: 15)
 */
export function roadWidthExprRealWorld(
  widths: RoadClassWidths,
  minZoom: number = 15
): ExpressionSpecification {
  // Get the width at the transition zoom level
  const baseWidth = roadClassWidthAtZoom(widths, "z15");
  
  // Calculate width at zoom 20 (5 zoom levels = 2^5 = 32x the base width)
  // We need to create a match expression for z20 widths
  const z20Multiplier = Math.pow(2, 20 - minZoom); // 2^5 = 32 for minZoom=15
  
  const z20Width = [
    "match",
    ["get", "class"],
    "motorway", (widths.motorway.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "trunk", (widths.trunk.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "primary", (widths.primary.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "secondary", (widths.secondary.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "tertiary", (widths.tertiary.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "residential", (widths.residential.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "service", (widths.service.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "minor", (widths.residential.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "unclassified", (widths.residential.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    (widths.default.z15 ?? 1) * z20Multiplier,
  ] as ExpressionSpecification;

  // Use exponential interpolation with base 2 for real-world scaling
  return [
    "interpolate",
    ["exponential", 2],
    ["zoom"],
    6, roadClassWidthAtZoom(widths, "z6"),
    12, roadClassWidthAtZoom(widths, "z12"),
    minZoom, baseWidth,
    20, z20Width,
  ] as ExpressionSpecification;
}

/** Creates interpolated road casing width expression from theme */
export function roadCasingWidthExpr(widths: RoadClassWidths): ExpressionSpecification {
  return [
    "interpolate",
    ["linear"],
    ["zoom"],
    6, roadClassWidthAtZoom(widths, "z6"),
    12, roadClassWidthAtZoom(widths, "z12"),
    15, roadClassWidthAtZoom(widths, "z15"),
  ] as ExpressionSpecification;
}

/**
 * Creates road casing width expression with real-world scaling.
 * Casings scale the same as roads to maintain proportional outlines at high zoom.
 */
export function roadCasingWidthExprRealWorld(
  widths: RoadClassWidths,
  minZoom: number = 15
): ExpressionSpecification {
  const baseWidth = roadClassWidthAtZoom(widths, "z15");
  const z20Multiplier = Math.pow(2, 20 - minZoom);
  
  const z20Width = [
    "match",
    ["get", "class"],
    "motorway", (widths.motorway.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "trunk", (widths.trunk.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "primary", (widths.primary.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "secondary", (widths.secondary.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "tertiary", (widths.tertiary.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "residential", (widths.residential.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "service", (widths.service.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "minor", (widths.residential.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    "unclassified", (widths.residential.z15 ?? widths.default.z15 ?? 1) * z20Multiplier,
    (widths.default.z15 ?? 1) * z20Multiplier,
  ] as ExpressionSpecification;

  return [
    "interpolate",
    ["exponential", 2],
    ["zoom"],
    6, roadClassWidthAtZoom(widths, "z6"),
    12, roadClassWidthAtZoom(widths, "z12"),
    minZoom, baseWidth,
    20, z20Width,
  ] as ExpressionSpecification;
}

// ============================================================================
// COLOR EXPRESSIONS
// ============================================================================

/** Creates landcover fill color expression */
export function landcoverFillColor(
  c: ThemeColors,
  landConfig?: { useOverrideColor?: boolean; overrideColor?: string }
): ColorPaintValue {
  // If override color is enabled, use it for all land types
  if (landConfig?.useOverrideColor && landConfig?.overrideColor) {
    return landConfig.overrideColor;
  }

  return [
    "match",
    ["get", "class"],
    "wood", c.land.wood,
    "grass", c.land.grass,
    "scrub", c.land.scrub,
    "scrubland", c.land.scrub, // Alternative name for scrub
    "cropland", c.land.cropland,
    "farmland", c.land.farmland ?? c.land.cropland,
    "rock", c.land.rock ?? c.land.scrub,
    "sand", c.land.sand ?? c.land.default,
    "wetland", c.land.wetland ?? c.land.default,
    c.land.default,
  ] as ExpressionSpecification;
}

/** Creates landuse fill color expression */
export function landuseFillColor(
  c: ThemeColors,
  landConfig?: { useOverrideColor?: boolean; overrideColor?: string }
): ColorPaintValue {
  // If override color is enabled, use it for all land types
  if (landConfig?.useOverrideColor && landConfig?.overrideColor) {
    return landConfig.overrideColor;
  }

  return [
    "match",
    ["get", "class"],
    "park", c.landuse.park ?? c.landuse.default,
    "cemetery", c.landuse.cemetery,
    "pitch", c.landuse.pitch,
    "stadium", c.landuse.stadium ?? c.landuse.default,
    "residential", c.landuse.residential,
    "college", c.landuse.college ?? c.landuse.default,
    "commercial", c.landuse.commercial ?? c.landuse.default,
    "construction", c.landuse.construction ?? c.landuse.default,
    "dam", c.landuse.dam ?? c.landuse.default,
    "farmland", c.landuse.farmland ?? c.landuse.default,
    "grass", c.landuse.grass ?? c.landuse.default,
    "hospital", c.landuse.hospital ?? c.landuse.default,
    "industrial", c.landuse.industrial ?? c.landuse.default,
    "military", c.landuse.military ?? c.landuse.default,
    "neighbourhood", c.landuse.neighbourhood ?? c.landuse.default,
    "quarry", c.landuse.quarry ?? c.landuse.default,
    "quarter", c.landuse.quarter ?? c.landuse.default,
    "railway", c.landuse.railway ?? c.landuse.default,
    "retail", c.landuse.retail ?? c.landuse.default,
    "school", c.landuse.school ?? c.landuse.default,
    "suburb", c.landuse.suburb ?? c.landuse.default,
    "theme_park", c.landuse.theme_park ?? c.landuse.default,
    "track", c.landuse.track ?? c.landuse.default,
    "university", c.landuse.university ?? c.landuse.default,
    "zoo", c.landuse.zoo ?? c.landuse.default,
    c.landuse.default,
  ] as ExpressionSpecification;
}

/** Road color expression (motorway, trunk, primary, secondary) */
export function roadColorExpr(c: ThemeColors): ColorPaintValue {
  return [
    "match",
    ["get", "class"],
    "motorway", c.road.motorway,
    "trunk", c.road.trunk,
    "primary", c.road.primary,
    "secondary", c.road.secondary,
    c.road.other,
  ] as ExpressionSpecification;
}

/** Road color expression with tertiary */
export function roadColorWithTertiaryExpr(c: ThemeColors): ColorPaintValue {
  return [
    "match",
    ["get", "class"],
    "motorway", c.road.motorway,
    "trunk", c.road.trunk,
    "primary", c.road.primary,
    "secondary", c.road.secondary,
    "tertiary", c.road.tertiary,
    "residential", c.road.residential,
    "service", c.road.service,
    "minor", c.road.residential, // minor roads styled like residential
    "unclassified", c.road.residential, // unclassified roads styled like residential
    c.road.other,
  ] as ExpressionSpecification;
}

/** Tunnel color expression (pass `theme.colors.road.tunnel` when defined) */
export function tunnelColorExpr(tunnel: ThemeRoadTunnelPalette): ColorPaintValue {
  return [
    "match",
    ["get", "class"],
    "motorway", tunnel.motorway,
    "trunk", tunnel.trunk,
    "primary", tunnel.primary,
    "secondary", tunnel.secondary,
    "tertiary", tunnel.tertiary,
    "residential", tunnel.residential,
    "service", tunnel.service,
    "minor", tunnel.residential,
    "unclassified", tunnel.residential,
    tunnel.default,
  ] as ExpressionSpecification;
}

/** Bridge color expression (pass `theme.colors.road.bridge` when defined) */
export function bridgeColorExpr(bridge: ThemeRoadBridgePalette): ColorPaintValue {
  return [
    "match",
    ["get", "class"],
    "motorway", bridge.motorway,
    "trunk", bridge.trunk,
    "primary", bridge.primary,
    "secondary", bridge.secondary,
    "tertiary", bridge.tertiary,
    "residential", bridge.residential,
    "minor", bridge.residential,
    "unclassified", bridge.residential,
    bridge.default,
  ] as ExpressionSpecification;
}

// ============================================================================
// WATER COLOR EXPRESSIONS
// ============================================================================

/** Creates water fill color expression */
export function waterFillColor(
  c: ThemeColors,
  waterConfig?: { useOverrideColor?: boolean; overrideColor?: string }
): ColorPaintValue {
  // If override color is enabled, use it for all water types
  if (waterConfig?.useOverrideColor && waterConfig?.overrideColor) {
    return waterConfig.overrideColor;
  }

  return [
    "match",
    ["get", "class"],
    "ocean", c.water.ocean ?? c.water.fill,
    "sea", c.water.sea ?? c.water.fill,
    "lake", c.water.lake ?? c.water.fill,
    "pond", c.water.pond ?? c.water.fill,
    "river", c.water.river ?? c.water.fill,
    "reservoir", c.water.reservoir ?? c.water.fill,
    "bay", c.water.bay ?? c.water.fill,
    "gulf", c.water.gulf ?? c.water.fill,
    c.water.default ?? c.water.fill,
  ] as ExpressionSpecification;
}

/** Creates waterway line color expression */
export function waterwayLineColor(
  c: ThemeColors,
  waterConfig?: { useOverrideColorWaterway?: boolean; overrideColorWaterway?: string }
): ColorPaintValue {
  // If override color is enabled, use it for all waterway types
  if (waterConfig?.useOverrideColorWaterway && waterConfig?.overrideColorWaterway) {
    return waterConfig.overrideColorWaterway;
  }

  return [
    "match",
    ["get", "class"],
    "river", c.water.river ?? c.water.line,
    "canal", c.water.canal ?? c.water.line,
    "stream", c.water.stream ?? c.water.line,
    "ditch", c.water.ditch ?? c.water.line,
    "drain", c.water.drain ?? c.water.line,
    c.water.default ?? c.water.line,
  ] as ExpressionSpecification;
}

// ============================================================================
// BUILDING COLOR EXPRESSIONS
// ============================================================================

/** Creates building fill color expression */
export function buildingFillColor(
  c: ThemeColors,
  heightColorsMinZoom?: number
): ColorPaintValue {
  // Buildings don't have a "class" property in the source data
  // They only have: colour, render_height, render_min_height, hide_3d
  // Use height-based coloring (taller buildings = different colors)
  // This creates a gradient based on render_height

  const heightBasedColor = [
    "interpolate",
    ["linear"],
    ["coalesce", ["get", "render_height"], 0], // Use render_height, default to 0 if missing
    0, c.building.short ?? c.building.fill,
    10, c.building.medium ?? c.building.fill,
    50, c.building.tall ?? c.building.fill,
    150, c.building.skyscraper ?? c.building.fill,
    300, c.building.supertall ?? c.building.fill,
    600, c.building.megatall ?? c.building.fill,
  ] as ExpressionSpecification;

  // If heightColorsMinZoom is set, use default color below that zoom, height-based above
  // Must use "step" with zoom at top level (MapLibre requirement)
  // Note: step uses "less than" for first output, "greater than or equal" for subsequent outputs
  // Using heightColorsMinZoom - 0.001 ensures height-based colors start exactly at heightColorsMinZoom
  if (heightColorsMinZoom !== undefined) {
    const defaultColor = c.building.default ?? c.building.fill;
    return [
      "step",
      ["zoom"],
      defaultColor,
      heightColorsMinZoom - 0.001, heightBasedColor,
    ] as ExpressionSpecification;
  }

  // Otherwise always use height-based colors
  return heightBasedColor;
}

// ============================================================================
// COMMON FILTERS
// ============================================================================

export const filters = {
  hasName: ["any", ["has", "name"], ["has", "name:en"]],
  majorRoad: [
    "all",
    ["!=", ["get", "brunnel"], "tunnel"],
    ["!=", ["get", "brunnel"], "bridge"],
    ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary"], true, false],
  ],
  // Normal roads excluding alleys and parking aisles (they have separate layers with higher minzoom)
  normalRoad: [
    "all",
    ["!=", ["get", "brunnel"], "tunnel"],
    ["!=", ["get", "brunnel"], "bridge"],
    [
      "match",
      ["get", "class"],
      ["motorway", "trunk", "primary", "secondary", "tertiary", "residential", "service", "minor", "unclassified"],
      true,
      false,
    ],
    ["!=", ["get", "service"], "alley"],
    ["!=", ["get", "service"], "parking_aisle"],
  ],
  // Alleys only (service roads with service=alley)
  alley: [
    "all",
    ["!=", ["get", "brunnel"], "tunnel"],
    ["!=", ["get", "brunnel"], "bridge"],
    ["==", ["get", "class"], "service"],
    ["==", ["get", "service"], "alley"],
  ],
  // Parking aisles only (service roads with service=parking_aisle)
  parkingAisle: [
    "all",
    ["!=", ["get", "brunnel"], "tunnel"],
    ["!=", ["get", "brunnel"], "bridge"],
    ["==", ["get", "class"], "service"],
    ["==", ["get", "service"], "parking_aisle"],
  ],
  tunnel: ["==", ["get", "brunnel"], "tunnel"],
  bridge: ["==", ["get", "brunnel"], "bridge"],
  path: ["match", ["get", "class"], ["path", "track", "footway", "cycleway"], true, false],
  railway: ["==", ["get", "class"], "rail"],
  countryBoundary: ["all", ["==", ["get", "admin_level"], 2], ["!=", ["get", "maritime"], 1]],
  maritimeBoundary: ["all", ["==", ["get", "admin_level"], 2], ["==", ["get", "maritime"], 1]],
  stateBoundary: ["==", ["get", "admin_level"], 4],
  marineClass: [
    "any",
    ["match", ["get", "class"], ["ocean", "sea", "gulf", "bay"], true, false],
    ["==", ["get", "class"], "lake"],
  ],
} as const satisfies Record<string, FilterSpecification>;
