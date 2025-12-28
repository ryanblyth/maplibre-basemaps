/**
 * Shared source definitions for basemaps
 */

import type { SourceSpecification } from "maplibre-gl";
import type { BaseStyleConfig } from "../baseStyle.js";
import type { Theme } from "../theme.js";

/**
 * Creates the standard basemap sources (world_low, world_mid, us_high)
 * These are used by all basemaps that follow the same tile structure.
 * 
 * @param config - Base style configuration
 * @param theme - Theme object (optional, used to check if bathymetry is enabled)
 */
export function createBasemapSources(config: BaseStyleConfig, theme?: Theme): Record<string, SourceSpecification> {
  const sources: Record<string, SourceSpecification> = {
    world_low: {
      type: "vector",
      url: `pmtiles://${config.dataBaseUrl}/pmtiles/world_z0-6.pmtiles`,
      minzoom: 0,
    },
    world_mid: {
      type: "vector",
      url: `pmtiles://${config.dataBaseUrl}/pmtiles/world_z6-10.pmtiles`,
      minzoom: 6,
    },
    us_high: {
      type: "vector",
      url: `pmtiles://${config.dataBaseUrl}/pmtiles/us_z0-15.pmtiles`,
      minzoom: 6,
      maxzoom: 15,
    },
    poi_us: {
      type: "vector",
      url: `pmtiles://${config.dataBaseUrl}/pmtiles/poi_us_z12-15.pmtiles`,
      minzoom: 12,
      maxzoom: 15,
    },
  };
  
  // Only add bathymetry source if enabled in theme
  if (theme?.bathymetry?.enabled) {
    sources["ne-bathy"] = {
      type: "vector",
      url: `pmtiles://${config.dataBaseUrl}/pmtiles/ne_bathy_z0-6.pmtiles`,
      minzoom: 0,
      maxzoom: 6,
    };
  }
  
  return sources;
}

