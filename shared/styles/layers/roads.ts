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
  
  // Use road colors by default for tunnels/bridges, with optional overrides
  const roadColor = roadColorWithTertiaryExpr(c);
  const tunnelColor = c.road.tunnel ? tunnelColorExpr(c) : roadColor;
  const bridgeColor = c.road.bridge ? bridgeColorExpr(c) : roadColor;
  
  // Use road casing color for tunnel/bridge casings, or override if specified
  const tunnelCasingColor = c.road.tunnelCasing || c.road.casing;
  const bridgeCasingColor = c.road.bridge?.casing || c.road.casing;
  
  // Use tunnel/bridge-specific widths if defined, otherwise inherit from road
  const tunnelWidths = w.tunnelRoad || w.road;
  const bridgeWidths = w.bridgeRoad || w.road;
  
  return [
    // Tunnel layers - inherit road widths and colors (can be overridden in theme)
    { id: "road-tunnel-casing", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.tunnel, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": tunnelCasingColor, "line-width": roadCasingWidthExpr(w.roadCasing), "line-opacity": o.tunnel } },
    { id: "road-tunnel", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.tunnel, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": tunnelColor, "line-width": roadWidthExpr(tunnelWidths), "line-dasharray": [2, 2] } },
    
    // Road casing
    { id: "road-casing", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.normalRoad, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.road.casing, "line-width": roadCasingWidthExpr(w.roadCasing) } },
    
    // Paths
    { id: "paths", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.path, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.path, "line-width": zoomWidthExpr(w.path) } },
    
    // Bridge layers - inherit road widths and colors (can be overridden in theme)
    // Bridge casing removed - bridges now look identical to roads
    // To re-enable bridge casing, uncomment the line below:
    // { id: "road-bridge-casing", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.bridge, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": bridgeCasingColor, "line-width": roadCasingWidthExpr(w.roadCasing) } },
    { id: "road-bridge", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.bridge, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": bridgeColor, "line-width": roadWidthExpr(bridgeWidths) } },
    
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
  
  // Use road colors by default for bridges, with optional overrides
  const bridgeColor = c.road.bridge ? bridgeColorExpr(c) : roadColor;
  
  // Use bridge-specific widths if defined, otherwise inherit from road
  const bridgeWidths = w.bridgeRoad || w.road;
  
  return [
    // US buildings (high zoom)
    { id: "building-us", type: "fill", source: "us_high", "source-layer": "building", minzoom: 13, paint: { "fill-color": c.building.fill, "fill-outline-color": c.building.outline, "fill-opacity": o.building } },
    
    // US roads (excluding alleys, tunnels, bridges - they have their own layers)
    { id: "road-casing-us", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.normalRoad, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.road.casing, "line-width": roadCasingWidthExpr(w.roadCasing) } },
    { id: "road-us", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.normalRoad, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": roadColor, "line-width": roadWidthExpr(w.road) } },
    
    // Alleys - only appear at zoom 14+
    { id: "road-alley", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 14, filter: filters.alley, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.road.service, "line-width": ["interpolate", ["linear"], ["zoom"], 14, 0.3, 15, 0.6, 18, 1.2] } },
    
    // Parking aisles - only appear at zoom 15+ (even later than alleys)
    { id: "road-parking-aisle", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 15, filter: filters.parkingAisle, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.road.parkingAisle || c.road.service, "line-width": ["interpolate", ["linear"], ["zoom"], 15, 0.2, 16, 0.4, 18, 0.8] } },
    
    // Other roads (catch-all for unhandled road classes)
    { id: "road-other", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 14, filter: ["all", ["!=", ["get", "brunnel"], "tunnel"], ["!=", ["get", "brunnel"], "bridge"], ["!", ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary", "tertiary", "residential", "service", "minor", "unclassified"], true, false]]], layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": c.road.other, "line-width": ["interpolate", ["linear"], ["zoom"], 14, 0.3, 15, 0.5] } },
    
    // US Bridges - rendered on TOP of everything (uses bridge colors/widths if defined, else road colors/widths)
    { id: "road-bridge-us", type: "line", source: "us_high", "source-layer": "transportation", minzoom: 6, filter: filters.bridge, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": bridgeColor, "line-width": roadWidthExpr(bridgeWidths) } },
  ];
}
