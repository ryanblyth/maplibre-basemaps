/**
 * Vintage Green Basemap Style
 * 
 * A dark, blue-tinted basemap style for MapLibre GL.
 * 
 * This file is intentionally minimal - all layer logic lives in shared/styles/layers/.
 * To customize colors, fonts, or other visual properties, edit ./theme.ts
 */

import type { StyleSpecification } from "maplibre-gl";
import { createBasemapStyle } from "../../../shared/styles/layers/index.js";
import { type BaseStyleConfig, defaultConfig } from "../../../shared/styles/baseStyle.js";
import { vintageGreenTheme } from "./theme.js";

/**
 * Creates the complete Vintage Green basemap style
 * 
 * @param config - Optional configuration for URLs (glyphs, sprites, data)
 * @returns Complete MapLibre StyleSpecification
 * 
 * @example
 * // Default configuration
 * const style = createVintageGreenStyle();
 * 
 * @example
 * // Custom data URL
 * const style = createVintageGreenStyle({ 
 *   dataBaseUrl: "https://my-cdn.com/tiles" 
 * });
 */
export function createVintageGreenStyle(config: BaseStyleConfig = defaultConfig): StyleSpecification {
  // Use basemap-specific sprite path
  const basemapConfig: BaseStyleConfig = {
    ...config,
    spritePath: 'basemaps/vintage-green/sprites/basemap',
  };
  return createBasemapStyle(vintageGreenTheme, basemapConfig);
}
