/**
 * Ice layers (glaciers, ice sheets, and ice shelves)
 */

import type { LayerSpecification } from "maplibre-gl";
import type { Theme } from "../theme.js";

/**
 * Creates ice fill and line layers for glaciated areas, ice shelves, and ice edges
 * 
 * @param theme - Theme object with ice configuration
 * @returns Array of LayerSpecification objects, or empty array if ice is disabled
 */
export function createIceLayers(theme: Theme): LayerSpecification[] {
  // Return empty array if ice is disabled
  if (!theme.ice?.enabled) {
    return [];
  }
  
  const ice = theme.ice;
  const layers: LayerSpecification[] = [];
  
  // Default colors - use light blue/white tones for ice
  const defaultGlaciatedColor = "#e8f4f8";  // Light blue-white
  const defaultIceShelvesColor = "#d0e8f0";  // Slightly darker blue-white
  const defaultIceEdgeColor = "#a0c8d8";    // Medium blue-gray
  
  // Base opacity settings
  const baseOpacityMin = ice.opacity?.min ?? 0.7;
  const baseOpacityMax = ice.opacity?.max ?? 0.9;
  const iceMinZoom = ice.minZoom ?? 0;
  const iceMaxZoom = ice.maxZoom ?? 6;
  
  // Glaciated areas (glaciers, ice caps) - fill layer
  const glaciatedColor = ice.glaciated?.color ?? defaultGlaciatedColor;
  const glaciatedOpacity = ice.glaciated?.opacity ?? baseOpacityMax;
  
  layers.push({
    id: "ice-glaciated",
    type: "fill",
    source: "ne-ice",
    "source-layer": "glaciated",
    minzoom: iceMinZoom,
    maxzoom: iceMaxZoom + 1,  // Add 1 for fade-out
    paint: {
      "fill-color": glaciatedColor,
      "fill-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        iceMinZoom, glaciatedOpacity * (baseOpacityMin / baseOpacityMax),
        iceMaxZoom, glaciatedOpacity,
        iceMaxZoom + 1, 0.0  // Fade out
      ]
    }
  });
  
  // Ice shelves - fill layer
  const iceShelvesColor = ice.iceShelves?.color ?? defaultIceShelvesColor;
  const iceShelvesOpacity = ice.iceShelves?.opacity ?? baseOpacityMax;
  
  layers.push({
    id: "ice-shelves",
    type: "fill",
    source: "ne-ice",
    "source-layer": "ice_shelves",
    minzoom: iceMinZoom,
    maxzoom: iceMaxZoom + 1,  // Add 1 for fade-out
    paint: {
      "fill-color": iceShelvesColor,
      "fill-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        iceMinZoom, iceShelvesOpacity * (baseOpacityMin / baseOpacityMax),
        iceMaxZoom, iceShelvesOpacity,
        iceMaxZoom + 1, 0.0  // Fade out
      ]
    }
  });
  
  // Ice edge (outline) - line layer
  const iceEdgeColor = ice.iceEdge?.color ?? defaultIceEdgeColor;
  const iceEdgeWidth = ice.iceEdge?.width ?? 0.5;
  const iceEdgeOpacity = ice.iceEdge?.opacity ?? 0.6;
  
  layers.push({
    id: "ice-edge",
    type: "line",
    source: "ne-ice",
    "source-layer": "ice_edge",
    minzoom: iceMinZoom,
    maxzoom: iceMaxZoom + 1,  // Add 1 for fade-out
    paint: {
      "line-color": iceEdgeColor,
      "line-width": iceEdgeWidth,
      "line-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        iceMinZoom, iceEdgeOpacity * (baseOpacityMin / baseOpacityMax),
        iceMaxZoom, iceEdgeOpacity,
        iceMaxZoom + 1, 0.0  // Fade out
      ]
    }
  });
  
  return layers;
}

