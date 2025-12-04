/**
 * Dark Blue Basemap Style
 * 
 * A dark, blue-tinted basemap style for MapLibre GL.
 * 
 * This file is intentionally minimal - all layer logic lives in shared/styles/layers/.
 * To customize colors, fonts, or other visual properties, edit ./theme.ts
 */

import type { StyleSpecification } from "maplibre-gl";
import { createBasemapStyle } from "../../../shared/styles/layers/index.js";
import { type BaseStyleConfig, defaultConfig } from "../../../shared/styles/baseStyle.js";
import { darkBlueTheme } from "./theme.js";

/**
 * Creates the complete Dark Blue basemap style
 * 
 * @param config - Optional configuration for URLs (glyphs, sprites, data)
 * @returns Complete MapLibre StyleSpecification
 * 
 * @example
 * // Default configuration
 * const style = createDarkBlueStyle();
 * 
 * @example
 * // Custom data URL
 * const style = createDarkBlueStyle({ 
 *   dataBaseUrl: "https://my-cdn.com/tiles" 
 * });
 */
export function createDarkBlueStyle(config: BaseStyleConfig = defaultConfig): StyleSpecification {
  return createBasemapStyle(darkBlueTheme, config);
}
