/**
 * Road label layers
 */

import type { LayerSpecification } from "maplibre-gl";
import type { Theme } from "../../theme.js";
import { createAbbreviatedTextField } from "../../baseStyle.js";

export function createRoadLabelLayers(theme: Theme): LayerSpecification[] {
  const c = theme.colors;
  const majorFilter = ["all", ["!=", ["get", "brunnel"], "tunnel"], ["!=", ["get", "brunnel"], "bridge"], ["match", ["get", "class"], ["motorway", "trunk", "primary"], true, false], ["has", "name"]];
  const secondaryFilter = ["all", ["!=", ["get", "brunnel"], "tunnel"], ["!=", ["get", "brunnel"], "bridge"], ["==", ["get", "class"], "secondary"], ["has", "name"]];
  const tertiaryFilter = ["all", ["!=", ["get", "brunnel"], "tunnel"], ["!=", ["get", "brunnel"], "bridge"], ["match", ["get", "class"], ["tertiary", "residential"], true, false], ["has", "name"]];
  const otherFilter = ["all", ["!=", ["get", "brunnel"], "tunnel"], ["!=", ["get", "brunnel"], "bridge"], ["!", ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary", "tertiary", "residential"], true, false]], ["has", "name"]];
  
  const baseLabelLayout = { 
    "text-font": theme.fonts.regular, 
    "symbol-placement": "line" as const, 
    "text-rotation-alignment": "map" as const, 
    "text-pitch-alignment": "viewport" as const, 
    "symbol-spacing": 150 
  };
  const baseLabelPaint = { 
    "text-halo-color": c.label.road.halo, 
    "text-halo-width": 1.5, 
    "text-halo-blur": 1 
  };
  
  return [
    { id: "road-label-major", type: "symbol", source: "us_high", "source-layer": "transportation_name", minzoom: 8, filter: majorFilter, layout: { ...baseLabelLayout, "text-field": createAbbreviatedTextField(), "text-size": ["interpolate", ["linear"], ["zoom"], 8, 9, 12, 11, 15, 13] }, paint: { ...baseLabelPaint, "text-color": c.label.road.major.color, "text-opacity": c.label.road.major.opacity } },
    { id: "road-label-secondary", type: "symbol", source: "us_high", "source-layer": "transportation_name", minzoom: 10, filter: secondaryFilter, layout: { ...baseLabelLayout, "text-field": createAbbreviatedTextField(), "text-size": ["interpolate", ["linear"], ["zoom"], 10, 8, 12, 10, 15, 12] }, paint: { ...baseLabelPaint, "text-color": c.label.road.secondary.color, "text-opacity": c.label.road.secondary.opacity } },
    { id: "road-label-tertiary", type: "symbol", source: "us_high", "source-layer": "transportation_name", minzoom: 12, filter: tertiaryFilter, layout: { ...baseLabelLayout, "text-field": createAbbreviatedTextField(), "text-size": ["interpolate", ["linear"], ["zoom"], 12, 8, 15, 10] }, paint: { ...baseLabelPaint, "text-color": c.label.road.tertiary.color, "text-opacity": c.label.road.tertiary.opacity } },
    { id: "road-label-other", type: "symbol", source: "us_high", "source-layer": "transportation_name", minzoom: 14, filter: otherFilter, layout: { ...baseLabelLayout, "text-field": createAbbreviatedTextField(), "text-size": ["interpolate", ["linear"], ["zoom"], 14, 7, 15, 8] }, paint: { ...baseLabelPaint, "text-color": c.label.road.other.color, "text-opacity": c.label.road.other.opacity } },
  ];
}

