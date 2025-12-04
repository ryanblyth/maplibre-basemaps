/**
 * Road layers (world, US, tunnels, bridges)
 */

import type { LayerSpecification } from "maplibre-gl";
import type { Theme } from "../theme.js";
import { 
  roadColorExpr, 
  roadColorWithTertiaryExpr, 
  tunnelColorExpr, 
  bridgeColorExpr, 
  filters,
  roadWidthExpr,
  roadCasingWidthExpr,
  zoomWidthExpr
} from "./expressions.js";

export function createWorldRoadLayers(theme: Theme): LayerSpecification[] {
  const c = theme.colors;
  const roadColor = roadColorExpr(c);
  
  return [
    { id: "road-world", type: "line", source: "world_low", "source-layer": "transportation", minzoom: 0, maxzoom: 6.5, filter: filters.majorRoad, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": roadColor, "line-width": ["interpolate", ["linear"], ["zoom"], 0, 0.2, 6, 0.6] } },
    { id: "road-world-mid", type: "line", source: "world_mid", "source-layer": "transportation", minzoom: 6, filter: filters.majorRoad, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": roadColor, "line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.6, 10, 1.0] } },
  ];
}

export function createUSRoadLayers(theme: Theme): LayerSpecification[] {
  const c = theme.colors;
  const w = theme.widths;
  const o = theme.opacities;
  const tunnelColor = tunnelColorExpr(c);
  const bridgeColor = bridgeColorExpr(c);
  
  return [
    // Tunnel layers
    { id: "road-tunnel-casing", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.tunnel, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.road.tunnelCasing, "line-width": zoomWidthExpr(w.tunnelCasing), "line-opacity": o.tunnel } },
    { id: "road-tunnel", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.tunnel, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": tunnelColor, "line-width": zoomWidthExpr(w.tunnel), "line-dasharray": [2, 2] } },
    
    // Road casing
    { id: "road-casing", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.normalRoad, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.road.casing, "line-width": roadCasingWidthExpr(w.roadCasing) } },
    
    // Paths
    { id: "paths", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.path, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.path, "line-width": zoomWidthExpr(w.path) } },
    
    // Bridge layers
    { id: "road-bridge-casing", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.bridge, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.road.bridge.casing, "line-width": zoomWidthExpr(w.bridgeCasing) } },
    { id: "road-bridge", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.bridge, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": bridgeColor, "line-width": zoomWidthExpr(w.bridge) } },
    
    // Railway
    { id: "railway", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.railway, paint: { "line-color": c.railway, "line-width": zoomWidthExpr(w.railway) } },
    
    // Building
    { id: "building", type: "fill", source: "us_high", "source-layer": "building", minzoom: 6, paint: { "fill-color": c.building.fill, "fill-outline-color": c.building.outline, "fill-opacity": o.building } },
  ];
}

export function createUSOverlayRoadLayers(theme: Theme): LayerSpecification[] {
  const c = theme.colors;
  const w = theme.widths;
  const o = theme.opacities;
  const roadColor = roadColorWithTertiaryExpr(c);
  
  return [
    // US buildings (high zoom)
    { id: "building-us", type: "fill", source: "us_high", "source-layer": "building", minzoom: 13, paint: { "fill-color": c.building.fill, "fill-outline-color": c.building.outline, "fill-opacity": o.building } },
    
    // US roads
    { id: "road-casing-us", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.normalRoad, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.road.casing, "line-width": roadCasingWidthExpr(w.roadCasing) } },
    { id: "road-us", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.normalRoad, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": roadColor, "line-width": roadWidthExpr(w.road) } },
    { id: "road-other", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 14, filter: ["all", ["!=", ["get", "brunnel"], "tunnel"], ["!=", ["get", "brunnel"], "bridge"], ["!", ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary", "tertiary", "residential", "service"], true, false]]], layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.road.other, "line-width": ["interpolate", ["linear"], ["zoom"], 14, 0.3, 15, 0.5] } },
  ];
}
