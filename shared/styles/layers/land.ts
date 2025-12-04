/**
 * Land layers (landcover, landuse)
 */

import type { LayerSpecification } from "maplibre-gl";
import type { Theme } from "../theme.js";
import { landcoverFillColor, landuseFillColor } from "./expressions.js";

export function createLandcoverLayers(theme: Theme): LayerSpecification[] {
  const c = theme.colors;
  const o = theme.opacities;
  const lcFill = landcoverFillColor(c);
  const luFill = landuseFillColor(c);
  
  return [
    { id: "landcover-world", type: "fill", source: "world_low", "source-layer": "landcover", minzoom: 0, maxzoom: 6.5, paint: { "fill-color": lcFill, "fill-opacity": o.landcover } },
    { id: "landcover-world-mid", type: "fill", source: "world_mid", "source-layer": "landcover", minzoom: 6, paint: { "fill-color": lcFill, "fill-opacity": o.landcover } },
    { id: "landuse-world", type: "fill", source: "world_low", "source-layer": "landuse", minzoom: 0, maxzoom: 6.5, paint: { "fill-color": luFill, "fill-opacity": o.landuse } },
    { id: "landuse-world-mid", type: "fill", source: "world_mid", "source-layer": "landuse", minzoom: 6, paint: { "fill-color": luFill, "fill-opacity": o.landuse } },
  ];
}

export function createUSLandLayers(theme: Theme): LayerSpecification[] {
  const c = theme.colors;
  const o = theme.opacities;
  const lcFill = landcoverFillColor(c);
  const luFill = landuseFillColor(c);
  
  return [
    { id: "landcover-us", type: "fill", source: "us_high", "source-layer": "landcover", minzoom: 6, paint: { "fill-color": lcFill, "fill-opacity": o.landcover } },
    { id: "landuse-us", type: "fill", source: "us_high", "source-layer": "landuse", minzoom: 6, paint: { "fill-color": luFill, "fill-opacity": o.landuse } },
  ];
}
