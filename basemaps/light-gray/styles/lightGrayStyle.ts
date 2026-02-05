/**
 * Light Gray Basemap Style
 * 
 * A dark, blue-tinted basemap style for MapLibre GL.
 * 
 * This file is intentionally minimal - all layer logic lives in shared/styles/layers/.
 * To customize colors, fonts, or other visual properties, edit ./theme.ts
 */

import type { StyleSpecification } from "maplibre-gl";
import { createBasemapStyle } from "../../../shared/styles/layers/index.js";
import { type BaseStyleConfig, defaultConfig } from "../../../shared/styles/baseStyle.js";
import { lightGrayTheme } from "./theme.js";

/**
 * Creates the complete Light Gray basemap style
 * 
 * @param config - Optional configuration for URLs (glyphs, sprites, data)
 * @returns Complete MapLibre StyleSpecification
 * 
 * @example
 * // Default configuration
 * const style = createLightGrayStyle();
 * 
 * @example
 * // Custom data URL
 * const style = createLightGrayStyle({ 
 *   dataBaseUrl: "https://my-cdn.com/tiles" 
 * });
 */
export function createLightGrayStyle(config: BaseStyleConfig = defaultConfig): StyleSpecification {
  // Use basemap-specific sprite path
  const basemapConfig: BaseStyleConfig = {
    ...config,
    spritePath: 'basemaps/light-gray/sprites/basemap',
  };
  return createBasemapStyle(lightGrayTheme, basemapConfig);
}
