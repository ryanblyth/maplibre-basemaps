/**
 * Shared MapLibre expressions for layer styling
 * 
 * These functions generate MapLibre expression arrays based on theme values.
 */

import type { ThemeColors, ThemeWidths, ZoomWidths, RoadClassWidths } from "../theme.js";

// ============================================================================
// WIDTH EXPRESSION HELPERS
// ============================================================================

/** Converts ZoomWidths to interpolate expression */
export function zoomWidthExpr(widths: ZoomWidths): unknown {
  const stops: (string | number)[] = ["interpolate", ["linear"], ["zoom"]];
  
  // Map zoom keys to actual zoom values
  const zoomMap: Record<string, number> = {
    z0: 0, z3: 3, z6: 6, z8: 8, z10: 10, z12: 12, z14: 14, z15: 15
  };
  
  // Sort by zoom level and add stops
  const entries = Object.entries(widths)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => [zoomMap[k], v] as [number, number])
    .sort((a, b) => a[0] - b[0]);
  
  for (const [zoom, width] of entries) {
    stops.push(zoom, width);
  }
  
  return stops;
}

/** Creates road width expression based on class at a given zoom */
function roadClassWidthAtZoom(widths: RoadClassWidths, zoomKey: keyof ZoomWidths): unknown {
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
  ];
}

/** Creates interpolated road width expression from theme */
export function roadWidthExpr(widths: RoadClassWidths): unknown {
  return ["interpolate", ["linear"], ["zoom"],
    6, roadClassWidthAtZoom(widths, "z6"),
    12, roadClassWidthAtZoom(widths, "z12"),
    15, roadClassWidthAtZoom(widths, "z15")
  ];
}

/** Creates interpolated road casing width expression from theme */
export function roadCasingWidthExpr(widths: RoadClassWidths): unknown {
  return ["interpolate", ["linear"], ["zoom"],
    6, roadClassWidthAtZoom(widths, "z6"),
    12, roadClassWidthAtZoom(widths, "z12"),
    15, roadClassWidthAtZoom(widths, "z15")
  ];
}

// ============================================================================
// COLOR EXPRESSIONS
// ============================================================================

/** Creates landcover fill color expression */
export function landcoverFillColor(c: ThemeColors): unknown {
  return ["match", ["get", "class"], 
    "wood", c.land.wood, 
    "grass", c.land.grass, 
    "scrub", c.land.scrub, 
    "cropland", c.land.cropland, 
    c.land.default
  ];
}

/** Creates landuse fill color expression */
export function landuseFillColor(c: ThemeColors): unknown {
  return ["match", ["get", "class"], 
    "park", c.landuse.park, 
    "cemetery", c.landuse.cemetery, 
    "pitch", c.landuse.pitch, 
    "stadium", c.landuse.stadium, 
    "residential", c.landuse.residential, 
    c.landuse.default
  ];
}

/** Road color expression (motorway, trunk, primary, secondary) */
export function roadColorExpr(c: ThemeColors): unknown {
  return ["match", ["get", "class"], 
    "motorway", c.road.motorway, 
    "trunk", c.road.trunk, 
    "primary", c.road.primary, 
    "secondary", c.road.secondary, 
    c.road.other
  ];
}

/** Road color expression with tertiary */
export function roadColorWithTertiaryExpr(c: ThemeColors): unknown {
  return ["match", ["get", "class"], 
    "motorway", c.road.motorway, 
    "trunk", c.road.trunk, 
    "primary", c.road.primary, 
    "secondary", c.road.secondary, 
    "tertiary", c.road.tertiary, 
    "residential", c.road.residential, 
    "service", c.road.service, 
    "minor", c.road.residential,  // minor roads styled like residential
    "unclassified", c.road.residential,  // unclassified roads styled like residential
    c.road.other
  ];
}

/** Tunnel color expression */
export function tunnelColorExpr(c: ThemeColors): unknown {
  return ["match", ["get", "class"], 
    "motorway", c.road.tunnel.motorway, 
    "trunk", c.road.tunnel.trunk, 
    "primary", c.road.tunnel.primary, 
    "secondary", c.road.tunnel.secondary, 
    "tertiary", c.road.tunnel.tertiary, 
    "residential", c.road.tunnel.residential, 
    "service", c.road.tunnel.service, 
    "minor", c.road.tunnel.residential,
    "unclassified", c.road.tunnel.residential,
    c.road.tunnel.default
  ];
}

/** Bridge color expression */
export function bridgeColorExpr(c: ThemeColors): unknown {
  return ["match", ["get", "class"], 
    "motorway", c.road.bridge.motorway, 
    "trunk", c.road.bridge.trunk, 
    "primary", c.road.bridge.primary, 
    "secondary", c.road.bridge.secondary, 
    "tertiary", c.road.bridge.tertiary, 
    "residential", c.road.bridge.residential, 
    "minor", c.road.bridge.residential,
    "unclassified", c.road.bridge.residential,
    c.road.bridge.default
  ];
}

// ============================================================================
// COMMON FILTERS
// ============================================================================

export const filters = {
  hasName: ["any", ["has", "name"], ["has", "name:en"]],
  majorRoad: ["all", ["!=", ["get", "brunnel"], "tunnel"], ["!=", ["get", "brunnel"], "bridge"], ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary"], true, false]],
  // Normal roads excluding alleys and parking aisles (they have separate layers with higher minzoom)
  normalRoad: ["all", ["!=", ["get", "brunnel"], "tunnel"], ["!=", ["get", "brunnel"], "bridge"], ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary", "tertiary", "residential", "service", "minor", "unclassified"], true, false], ["!=", ["get", "service"], "alley"], ["!=", ["get", "service"], "parking_aisle"]],
  // Alleys only (service roads with service=alley)
  alley: ["all", ["!=", ["get", "brunnel"], "tunnel"], ["!=", ["get", "brunnel"], "bridge"], ["==", ["get", "class"], "service"], ["==", ["get", "service"], "alley"]],
  // Parking aisles only (service roads with service=parking_aisle)
  parkingAisle: ["all", ["!=", ["get", "brunnel"], "tunnel"], ["!=", ["get", "brunnel"], "bridge"], ["==", ["get", "class"], "service"], ["==", ["get", "service"], "parking_aisle"]],
  tunnel: ["==", ["get", "brunnel"], "tunnel"],
  bridge: ["==", ["get", "brunnel"], "bridge"],
  path: ["match", ["get", "class"], ["path", "track", "footway", "cycleway"], true, false],
  railway: ["==", ["get", "class"], "rail"],
  countryBoundary: ["all", ["==", ["get", "admin_level"], 2], ["!=", ["get", "maritime"], 1]],
  maritimeBoundary: ["all", ["==", ["get", "admin_level"], 2], ["==", ["get", "maritime"], 1]],
  stateBoundary: ["==", ["get", "admin_level"], 4],
  marineClass: ["any", ["match", ["get", "class"], ["ocean", "sea", "gulf", "bay"], true, false], ["==", ["get", "class"], "lake"]],
};
