/**
 * Dark Gray Basemap Style
 * 
 * A dark, blue-tinted basemap style for MapLibre GL.
 * 
 * This file is intentionally minimal - all layer logic lives in shared/styles/layers/.
 * To customize colors, fonts, or other visual properties, edit ./theme.ts
 */

import type { StyleSpecification } from "maplibre-gl";
import { createBasemapStyle } from "../../../shared/styles/layers/index.js";
import { type BaseStyleConfig, defaultConfig } from "../../../shared/styles/baseStyle.js";
import { darkGrayTheme } from "./theme.js";

/**
 * Creates the complete Dark Gray basemap style
 * 
 * @param config - Optional configuration for URLs (glyphs, sprites, data)
 * @returns Complete MapLibre StyleSpecification
 * 
 * @example
 * // Default configuration
 * const style = createDarkGrayStyle();
 * 
 * @example
 * // Custom data URL
 * const style = createDarkGrayStyle({ 
 *   dataBaseUrl: "https://my-cdn.com/tiles" 
 * });
 */
export function createDarkGrayStyle(config: BaseStyleConfig = defaultConfig): StyleSpecification {
  // Use basemap-specific sprite path
  const basemapConfig: BaseStyleConfig = {
    ...config,
    spritePath: 'basemaps/dark-gray/sprites/basemap',
  };
  return createBasemapStyle(darkGrayTheme, basemapConfig);
}
