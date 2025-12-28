/**
 * Bathymetry layers (ocean depth visualization)
 */

import type { LayerSpecification } from "maplibre-gl";
import type { Theme } from "../theme.js";

/**
 * Converts hex color to HSL
 */
function hexToHsl(hex: string): [number, number, number] {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return [h * 360, s * 100, l * 100];
}

/**
 * Converts HSL to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generates a bathymetry color ramp from a base water color
 * Returns an array of hex colors from shallow to deep
 */
function generateBathymetryRamp(baseWaterColor: string): string[] {
  const [h, s, l] = hexToHsl(baseWaterColor);
  
  // Create a ramp: shallow (MUCH lighter than water for visibility) to deep (darker, richer)
  // Keep the same hue, reduce lightness as depth increases
  // Making colors EXTREMELY distinct - shallow areas need to be very visible through 95% opaque water
  const stops = [
    Math.min(100, l * 1.80),  // 0m - shallow (80% lighter - very bright to show through water)
    l * 1.50,                  // 200m - shelf (50% lighter)
    l * 1.20,                  // 1000m - slope (20% lighter)
    l * 1.00,                  // 2000m - deep1 (same as water)
    l * 0.75,                  // 4000m - deep2 (25% darker)
    l * 0.50,                  // 6000m - abyss (50% darker)
    l * 0.30,                  // 10000m - trench (70% darker)
  ];
  
  // Increase saturation significantly for deeper colors to make them richer and more visible
  const saturations = [
    Math.min(100, s * 1.3),   // 0m - more saturated for visibility
    s * 1.35,                  // 200m
    s * 1.40,                  // 1000m
    s * 1.45,                  // 2000m
    s * 1.50,                  // 4000m
    s * 1.55,                  // 6000m
    s * 1.60,                  // 10000m
  ];
  
  return stops.map((lightness, i) => 
    hslToHex(h, Math.min(100, saturations[i]), Math.max(5, Math.min(100, lightness)))
  );
}

/**
 * Creates bathymetry fill layers for all source-layers
 * The PMTiles has 12 source-layers (A_10000 through L_0), each representing a depth band
 * 
 * @param theme - Theme object with bathymetry configuration
 * @returns Array of LayerSpecification objects, or empty array if bathymetry is disabled
 */
export function createBathymetryLayers(theme: Theme): LayerSpecification[] {
  // Return empty array if bathymetry is disabled
  if (!theme.bathymetry?.enabled) {
    return [];
  }
  
  const c = theme.colors;
  const bathy = theme.bathymetry;
  
  // Depth stops for color interpolation (in meters)
  const depthStops = [0, 200, 1000, 2000, 4000, 6000, 10000];
  
  // Use custom colors if provided, otherwise generate from water color
  let ramp: string[];
  if (bathy.colors) {
    // Use custom colors from theme
    ramp = [
      bathy.colors.shallow || c.water.fill,
      bathy.colors.shelf || c.water.fill,
      bathy.colors.slope || c.water.fill,
      bathy.colors.deep1 || c.water.fill,
      bathy.colors.deep2 || c.water.fill,
      bathy.colors.abyss || c.water.fill,
      bathy.colors.trench || c.water.fill,
    ];
  } else {
    // Auto-generate colors from water color
    ramp = generateBathymetryRamp(c.water.fill);
  }
  
  // Create color stops array for MapLibre expression
  const colorStops: unknown[] = [];
  for (let i = 0; i < depthStops.length; i++) {
    colorStops.push(depthStops[i]);
    colorStops.push(ramp[i]);
  }
  
  // All 12 source-layers from the PMTiles metadata
  const sourceLayers = [
    "ne_10m_bathymetry_A_10000",
    "ne_10m_bathymetry_B_9000",
    "ne_10m_bathymetry_C_8000",
    "ne_10m_bathymetry_D_7000",
    "ne_10m_bathymetry_E_6000",
    "ne_10m_bathymetry_F_5000",
    "ne_10m_bathymetry_G_4000",
    "ne_10m_bathymetry_H_3000",
    "ne_10m_bathymetry_I_2000",
    "ne_10m_bathymetry_J_1000",
    "ne_10m_bathymetry_K_200",
    "ne_10m_bathymetry_L_0",
  ];
  
  const layers: LayerSpecification[] = [];
  
  // Render layers in reverse order (deepest first) so shallow layers render on top
  // This allows proper blending where shallow areas show on top of deep areas
  const reversedSourceLayers = [...sourceLayers].reverse();
  
  for (const sourceLayer of reversedSourceLayers) {
    layers.push({
      id: `bathymetry-fill-${sourceLayer}`,
      type: "fill",
      source: "ne-bathy",
      "source-layer": sourceLayer,
      minzoom: bathy.minZoom ?? 0,
      maxzoom: (bathy.maxZoom ?? 6) + 1,  // Add 1 for fade-out
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          [
            "case",
            ["has", "depth"],
            [
              "case",
              [">=", ["get", "depth"], 0],
              ["get", "depth"],
              ["*", ["get", "depth"], -1]
            ],
            0  // Fallback if depth property doesn't exist
          ],
          ...colorStops  // Using theme-based colors
        ],
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          bathy.minZoom ?? 0, bathy.opacity?.min ?? 0.7,  // Opacity at minZoom
          bathy.maxZoom ?? 6, bathy.opacity?.max ?? 0.9,  // Opacity at maxZoom
          (bathy.maxZoom ?? 6) + 1, 0.0   // Fade out after maxZoom
        ]
      }
    });
  }
  
  // Skip line layers - they're too complex and cause vertex limit warnings
  // If contours are needed, they should be simplified or rendered differently
  
  return layers;
}

