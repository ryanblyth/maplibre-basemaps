/**
 * Shared layer factory functions
 * 
 * All layer creation functions accept a Theme object and return LayerSpecification arrays.
 * This allows any basemap to use the same layer structure with different colors/styles.
 */

import type { LayerSpecification, SourceSpecification, StyleSpecification } from "maplibre-gl";
import type { Theme } from "../theme.js";
import type { BaseStyleConfig } from "../baseStyle.js";

// Re-export layer creators
export { createBasemapSources } from "./sources.js";
export { createBackgroundLayers } from "./background.js";
export { createLandcoverLayers, createUSLandLayers } from "./land.js";
export { createWaterLayers, createUSWaterLayers } from "./water.js";
export { createBathymetryLayers } from "./bathymetry.js";
export { createIceLayers } from "./ice.js";
export { createContourLayers } from "./contours.js";
export { createGridLayers } from "./grid.js";
export { createBoundaryLayers, createUSBoundaryLayers } from "./boundaries.js";
export { createWorldRoadLayers, createUSRoadLayers, createUSOverlayRoadLayers } from "./roads.js";
export { 
  createRoadLabelLayers,
  createHighwayShieldLayers,
  createWaterLabelLayersFromWorldLabels, 
  createWaterLabelLayersFromBasemapSources, 
  createWaterwayLabelLayers,
  createPlaceLabelLayers,
  createPOILayers
} from "./labels/index.js";

// Re-export expressions for custom layer builders
export * from "./expressions.js";

// Import for createAllLayers
import { createBasemapSources } from "./sources.js";
import { createBackgroundLayers } from "./background.js";
import { createLandcoverLayers, createUSLandLayers } from "./land.js";
import { createWaterLayers, createUSWaterLayers } from "./water.js";
import { createBathymetryLayers } from "./bathymetry.js";
import { createIceLayers } from "./ice.js";
import { createContourLayers } from "./contours.js";
import { createGridLayers } from "./grid.js";
import { createBoundaryLayers, createUSBoundaryLayers } from "./boundaries.js";
import { createWorldRoadLayers, createUSRoadLayers, createUSOverlayRoadLayers } from "./roads.js";
import { 
  createRoadLabelLayers,
  createHighwayShieldLayers,
  createWaterLabelLayersFromWorldLabels, 
  createWaterLabelLayersFromBasemapSources, 
  createWaterwayLabelLayers,
  createPlaceLabelLayers,
  createPOILayers
} from "./labels/index.js";
import { createBaseStyle } from "../baseStyle.js";

/**
 * Creates all layers for a basemap in the correct order
 * 
 * @param theme - Theme object with colors, widths, opacities, and fonts
 * @returns Array of LayerSpecification objects
 */
export function createAllLayers(theme: Theme): LayerSpecification[] {
  return [
    ...createBackgroundLayers(theme),
    ...createLandcoverLayers(theme),
    ...createWaterLayers(theme),
    ...createUSWaterLayers(theme),
    ...createBathymetryLayers(theme),
    ...createContourLayers(theme),
    ...createBoundaryLayers(theme),
    ...createIceLayers(theme),  // Render ice after boundaries so boundaries don't show through
    ...createGridLayers(theme),  // Grid lines render on top of all features
    ...createWorldRoadLayers(theme),
    ...createUSRoadLayers(theme),
    ...createUSLandLayers(theme),
    ...createUSBoundaryLayers(theme),
    ...createUSOverlayRoadLayers(theme),
    ...createRoadLabelLayers(theme),
    ...createHighwayShieldLayers(theme),
    ...createWaterLabelLayersFromWorldLabels(theme),
    ...createWaterLabelLayersFromBasemapSources(theme),
    ...createWaterwayLabelLayers(theme),
    ...createPlaceLabelLayers(theme),
    ...createPOILayers(theme),
  ];
}

/**
 * Creates a complete basemap style from a theme
 * 
 * @param theme - Theme object with colors, widths, opacities, and fonts
 * @param config - Optional configuration for URLs
 * @returns Complete StyleSpecification
 */
export function createBasemapStyle(theme: Theme, config: BaseStyleConfig): StyleSpecification {
  const base = createBaseStyle(config);
  const sources = createBasemapSources(config, theme);  // Pass theme to conditionally include bathymetry source
  const layers = createAllLayers(theme);
  
  return {
    ...base,
    name: theme.name,
    sources: {
      ...base.sources,
      ...sources,
    },
    layers,
  };
}
