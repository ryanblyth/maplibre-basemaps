/**
 * Shared source definitions for basemaps
 */

import type { SourceSpecification } from "maplibre-gl";
import type { BaseStyleConfig } from "../baseStyle.js";

/**
 * Creates the standard basemap sources (world_low, world_mid, us_high)
 * These are used by all basemaps that follow the same tile structure.
 */
export function createBasemapSources(config: BaseStyleConfig): Record<string, SourceSpecification> {
  return {
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
  };
}

