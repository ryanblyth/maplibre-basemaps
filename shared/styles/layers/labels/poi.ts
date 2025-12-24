/**
 * POI (Point of Interest) icon layers
 * 
 * Displays icons for various POI categories at zoom 12+
 */

import type { LayerSpecification } from "maplibre-gl";
import type { Theme } from "../../theme.js";
import { createTextField } from "../../baseStyle.js";
import { filters } from "../expressions.js";

/**
 * Creates POI icon layers for various categories
 * 
 * POIs appear at zoom 12+ and include:
 * - Airports
 * - Hospitals
 * - Museums
 * - Zoos
 * - Parks (national parks, national monuments, state parks only)
 * - Railway stations
 * - Colleges and universities (including community colleges)
 * 
 * Icons are sourced from shared/assets/sprites/icons/
 */
export function createPOILayers(theme: Theme): LayerSpecification[] {
  const c = theme.colors;
  const poiConfig = c.label.poi || {
    iconColor: "#7a8ba3",
    iconSize: 0.8,
    textColor: "#a8b8d0",
    textHalo: "#0b0f14",
    textHaloWidth: 1.5,
  };
  
  const poiPaint = {
    "icon-color": poiConfig.iconColor,
    "icon-opacity": 0.9,
    "text-color": poiConfig.textColor,
    "text-halo-color": poiConfig.textHalo,
    "text-halo-width": poiConfig.textHaloWidth || 1.5,
    "text-halo-blur": 1,
  };
  
  // Base layout for POI icons
  const baseLayout = {
    "icon-size": poiConfig.iconSize || 0.8,
    "icon-allow-overlap": false,
    "icon-ignore-placement": false,
    "text-field": createTextField(),
    "text-font": theme.fonts.regular,
    "text-size": ["interpolate", ["linear"], ["zoom"], 12, 10, 14, 12, 16, 14],
    "text-offset": [0, 1.2],
    "text-anchor": "top",
    "text-optional": true,
    "text-allow-overlap": false,
    "symbol-placement": "point" as const,
  };
  
  const layers: LayerSpecification[] = [];
  
  // Primary POI source (dedicated POI PMTiles) and fallback sources
  const sources = [
    { name: "poi_us", minZoom: 12 },      // Dedicated POI source (z12-15)
    { name: "us_high", minZoom: 12 },     // Fallback: US high detail tiles
    { name: "world_mid", minZoom: 12 },   // Fallback: World mid detail tiles
    { name: "world_low", minZoom: 12 },   // Fallback: World low detail tiles
  ];
  
  // Park sources - only use us_high which has the park layer with national/state parks
  // Using only one source prevents duplicate labels
  const parkSources = [
    { name: "us_high", minZoom: 12 },     // US high detail tiles have park layer
  ];
  
  
  for (const source of sources) {
    // Airport POIs from POI layer
    layers.push({
      id: `poi-airport-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: source.minZoom,
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          [
            "all",
            ["match", ["get", "class"], ["transport"], true, false],
            ["==", ["get", "subclass"], "airport"],
          ],
          ["==", ["get", "class"], "airport"],
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "airport",
      },
      paint: poiPaint,
    });
    
    // Airfield POIs from POI layer
    layers.push({
      id: `poi-airfield-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: source.minZoom,
      filter: [
        "all",
        ["has", "name"],
        [
          "all",
          ["match", ["get", "class"], ["transport"], true, false],
          ["==", ["get", "subclass"], "airfield"],
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "airfield",
      },
      paint: poiPaint,
    });
    
    // Airport POIs from PLACE layer
    layers.push({
      id: `place-airport-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "place",
      minzoom: source.minZoom,
      filter: [
        "all",
        ["has", "name"],
        [
          "match",
          ["get", "place"],
          ["airport", "aerodrome"],
          true,
          false,
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "airport",
      },
      paint: poiPaint,
    });
    
    // Airport POIs from AERODROME_LABEL layer
    layers.push({
      id: `aerodrome-label-airport-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "aerodrome_label",
      minzoom: source.minZoom,
      filter: [
        "all",
        ["has", "name"],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "airport",
      },
      paint: poiPaint,
    });
    
    // Hospital POIs - Rank 1 (major hospitals only) at zoom 12+
    // Only show actual hospitals, not clinics or doctors
    layers.push({
      id: `poi-hospital-rank1-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: source.minZoom,
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          // Try class='healthcare' with hospital subclass ONLY (no clinic/doctors)
          [
            "all",
            ["match", ["get", "class"], ["healthcare"], true, false],
            ["==", ["get", "subclass"], "hospital"], // Only "hospital", not "clinic" or "doctors"
            // Only rank 1 hospitals (major hospitals)
            [
              "any",
              ["!", ["has", "rank"]], // No rank = rank 1
              ["==", ["get", "rank"], 1], // Rank 1
            ],
          ],
          // Try class='hospital' directly, but exclude clinics
          [
            "all",
            ["==", ["get", "class"], "hospital"],
            // Exclude clinics - subclass must be 'hospital' or not exist
            [
              "any",
              ["!", ["has", "subclass"]], // No subclass = hospital
              ["==", ["get", "subclass"], "hospital"], // Subclass is 'hospital'
            ],
            // Only rank 1 hospitals
            [
              "any",
              ["!", ["has", "rank"]],
              ["==", ["get", "rank"], 1],
            ],
          ],
          // Try class='amenity' with hospital subclass
          [
            "all",
            ["match", ["get", "class"], ["amenity"], true, false],
            ["==", ["get", "subclass"], "hospital"],
            // Only rank 1 hospitals
            [
              "any",
              ["!", ["has", "rank"]],
              ["==", ["get", "rank"], 1],
            ],
          ],
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "hospital",
        "icon-size": 0.9,
      },
      paint: poiPaint,
    });
    
    // Hospital POIs - Rank 2 hospitals at zoom 14.5+
    layers.push({
      id: `poi-hospital-rank2-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: 14.5,
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          // Try class='healthcare' with hospital subclass ONLY
          [
            "all",
            ["match", ["get", "class"], ["healthcare"], true, false],
            ["==", ["get", "subclass"], "hospital"], // Only "hospital"
            // Only rank 2 hospitals
            ["==", ["get", "rank"], 2],
          ],
          // Try class='hospital' directly, but exclude clinics
          [
            "all",
            ["==", ["get", "class"], "hospital"],
            // Exclude clinics - subclass must be 'hospital' or not exist
            [
              "any",
              ["!", ["has", "subclass"]], // No subclass = hospital
              ["==", ["get", "subclass"], "hospital"], // Subclass is 'hospital'
            ],
            // Only rank 2 hospitals
            ["==", ["get", "rank"], 2],
          ],
          // Try class='amenity' with hospital subclass
          [
            "all",
            ["match", ["get", "class"], ["amenity"], true, false],
            ["==", ["get", "subclass"], "hospital"],
            // Only rank 2 hospitals
            ["==", ["get", "rank"], 2],
          ],
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "hospital",
        "icon-size": 0.85,
      },
      paint: poiPaint,
    });
    
    // Hospital POIs - Rank > 2 hospitals at zoom 15+
    layers.push({
      id: `poi-hospital-rank3plus-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: 15,
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          // Try class='healthcare' with hospital subclass ONLY
          [
            "all",
            ["match", ["get", "class"], ["healthcare"], true, false],
            ["==", ["get", "subclass"], "hospital"], // Only "hospital"
            // Only rank > 2 hospitals
            [
              "all",
              ["has", "rank"],
              [">", ["get", "rank"], 2],
            ],
          ],
          // Try class='hospital' directly, but exclude clinics
          [
            "all",
            ["==", ["get", "class"], "hospital"],
            // Exclude clinics - subclass must be 'hospital' or not exist
            [
              "any",
              ["!", ["has", "subclass"]], // No subclass = hospital
              ["==", ["get", "subclass"], "hospital"], // Subclass is 'hospital'
            ],
            // Only rank > 2 hospitals
            [
              "all",
              ["has", "rank"],
              [">", ["get", "rank"], 2],
            ],
          ],
          // Try class='amenity' with hospital subclass
          [
            "all",
            ["match", ["get", "class"], ["amenity"], true, false],
            ["==", ["get", "subclass"], "hospital"],
            // Only rank > 2 hospitals
            [
              "all",
              ["has", "rank"],
              [">", ["get", "rank"], 2],
            ],
          ],
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "hospital",
        "icon-size": 0.75,
      },
      paint: poiPaint,
    });
    
    // Museum POIs - Rank 1 museums at zoom 14+
    layers.push({
      id: `poi-museum-rank1-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: 14, // Rank 1 museums appear at zoom 14
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          // Try multiple possible class/subclass combinations
          [
            "all",
            ["match", ["get", "class"], ["entertainment", "tourism"], true, false],
            ["match", ["get", "subclass"], ["museum", "gallery"], true, false],
            // Only rank 1 museums (or no rank which defaults to rank 1)
            [
              "any",
              ["!", ["has", "rank"]], // No rank = rank 1
              ["==", ["get", "rank"], 1], // Rank 1
            ],
          ],
          // Also try class='museum' directly
          [
            "all",
            ["==", ["get", "class"], "museum"],
            // Only rank 1 museums
            [
              "any",
              ["!", ["has", "rank"]], // No rank = rank 1
              ["==", ["get", "rank"], 1], // Rank 1
            ],
          ],
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "museum",
        "icon-size": 0.9,
      },
      paint: poiPaint,
    });
    
    // Museum POIs - Rank 2 museums at zoom 14.5+
    layers.push({
      id: `poi-museum-rank2-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: 14.5, // Rank 2 museums appear at zoom 14.5
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          // Try multiple possible class/subclass combinations
          [
            "all",
            ["match", ["get", "class"], ["entertainment", "tourism"], true, false],
            ["match", ["get", "subclass"], ["museum", "gallery"], true, false],
            // Only rank 2 museums
            ["==", ["get", "rank"], 2],
          ],
          // Also try class='museum' directly
          [
            "all",
            ["==", ["get", "class"], "museum"],
            // Only rank 2 museums
            ["==", ["get", "rank"], 2],
          ],
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "museum",
        "icon-size": 0.85,
      },
      paint: poiPaint,
    });
    
    // Museum POIs - Rank > 2 museums at zoom 15+
    layers.push({
      id: `poi-museum-rank3plus-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: 15, // Rank > 2 museums appear at zoom 15
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          // Try multiple possible class/subclass combinations
          [
            "all",
            ["match", ["get", "class"], ["entertainment", "tourism"], true, false],
            ["match", ["get", "subclass"], ["museum", "gallery"], true, false],
            // Only rank > 2 museums
            [
              "all",
              ["has", "rank"], // Must have rank property
              [">", ["get", "rank"], 2], // Rank > 2
            ],
          ],
          // Also try class='museum' directly
          [
            "all",
            ["==", ["get", "class"], "museum"],
            // Only rank > 2 museums
            [
              "all",
              ["has", "rank"], // Must have rank property
              [">", ["get", "rank"], 2], // Rank > 2
            ],
          ],
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "museum",
        "icon-size": 0.75, // Smaller for lower rank museums
      },
      paint: poiPaint,
    });
    
    // Zoo POIs
    // Zoos have class='zoo' with subclass='zoo'
    layers.push({
      id: `poi-zoo-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: source.minZoom,
      filter: [
        "all",
        ["has", "name"],
        ["==", ["get", "class"], "zoo"],
        ["==", ["get", "subclass"], "zoo"],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "zoo",
      },
      paint: poiPaint,
    });
    
    // Stadium POIs
    // Stadiums typically have class='stadium' or class='entertainment' with subclass='stadium'
    layers.push({
      id: `poi-stadium-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: source.minZoom,
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          // Try class='stadium' directly
          ["==", ["get", "class"], "stadium"],
          // Or class='entertainment'/'sport' with subclass='stadium'
          [
            "all",
            ["match", ["get", "class"], ["entertainment", "sport"], true, false],
            ["==", ["get", "subclass"], "stadium"],
          ],
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "stadium",
      },
      paint: poiPaint,
    });
    
    // Park POIs from POI layer (if parks are stored as points in POI layer)
    layers.push({
      id: `poi-park-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: source.minZoom,
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          // Match class=park/leisure with specific subclasses
          [
            "all",
            ["match", ["get", "class"], ["leisure", "park"], true, false],
            ["match", ["get", "subclass"], ["national_park", "national_monument", "state_park"], true, false],
          ],
          // Match tourism property (OpenMapTiles style)
          ["match", ["get", "tourism"], ["national_park", "national_monument"], true, false],
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "park",
      },
      paint: poiPaint,
    });
    
    
    // Railway station POIs - Rank 1 stations at zoom 14+
    layers.push({
      id: `poi-rail-rank1-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: 14, // Rank 1 stations appear at zoom 14
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          // Match class='railway' with subclass='station' (most common)
          [
            "all",
            ["==", ["get", "class"], "railway"],
            ["==", ["get", "subclass"], "station"],
            // Only rank 1 stations (or no rank which defaults to rank 1)
            [
              "any",
              ["!", ["has", "rank"]], // No rank = rank 1
              ["==", ["get", "rank"], 1], // Rank 1
            ],
          ],
          // Also try class='transport' with various station subclasses (fallback)
          [
            "all",
            ["match", ["get", "class"], ["transport"], true, false],
            ["match", ["get", "subclass"], ["railway_station", "station", "subway", "train_station"], true, false],
            // Only rank 1 stations
            [
              "any",
              ["!", ["has", "rank"]], // No rank = rank 1
              ["==", ["get", "rank"], 1], // Rank 1
            ],
          ],
        ],
      ],
      layout: {
        "icon-image": "rail",
        "icon-size": 0.9,
        "icon-allow-overlap": true,
        "icon-ignore-placement": false,
        "icon-optional": false,
        "text-field": createTextField(),
        "text-font": theme.fonts.regular,
        "text-size": ["interpolate", ["linear"], ["zoom"], 14, 10, 15, 12, 16, 14],
        "text-offset": [0, 1.2],
        "text-anchor": "top",
        "text-optional": true,
        "text-allow-overlap": false,
        "symbol-placement": "point" as const,
      },
      paint: {
        "icon-color": poiConfig.iconColor || "#7a8ba3",
        "icon-opacity": 0.9,
        "text-color": poiConfig.textColor,
        "text-halo-color": poiConfig.textHalo,
        "text-halo-width": poiConfig.textHaloWidth || 1.5,
        "text-halo-blur": 1,
      },
    });
    
    // Railway station POIs - Rank 2 stations at zoom 14.5+
    layers.push({
      id: `poi-rail-rank2-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: 14.5, // Rank 2 stations appear at zoom 14.5
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          // Match class='railway' with subclass='station' (most common)
          [
            "all",
            ["==", ["get", "class"], "railway"],
            ["==", ["get", "subclass"], "station"],
            // Only rank 2 stations
            ["==", ["get", "rank"], 2],
          ],
          // Also try class='transport' with various station subclasses (fallback)
          [
            "all",
            ["match", ["get", "class"], ["transport"], true, false],
            ["match", ["get", "subclass"], ["railway_station", "station", "subway", "train_station"], true, false],
            // Only rank 2 stations
            ["==", ["get", "rank"], 2],
          ],
        ],
      ],
      layout: {
        "icon-image": "rail",
        "icon-size": 0.85,
        "icon-allow-overlap": true,
        "icon-ignore-placement": false,
        "icon-optional": false,
        "text-field": createTextField(),
        "text-font": theme.fonts.regular,
        "text-size": ["interpolate", ["linear"], ["zoom"], 14.5, 10, 15, 12, 16, 14],
        "text-offset": [0, 1.2],
        "text-anchor": "top",
        "text-optional": true,
        "text-allow-overlap": false,
        "symbol-placement": "point" as const,
      },
      paint: {
        "icon-color": poiConfig.iconColor || "#7a8ba3",
        "icon-opacity": 0.85,
        "text-color": poiConfig.textColor,
        "text-halo-color": poiConfig.textHalo,
        "text-halo-width": poiConfig.textHaloWidth || 1.5,
        "text-halo-blur": 1,
      },
    });
    
    // Railway station POIs - Rank > 2 stations at zoom 15+
    layers.push({
      id: `poi-rail-rank3plus-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: 15, // Rank > 2 stations appear at zoom 15
      filter: [
        "all",
        ["has", "name"],
        [
          "any",
          // Match class='railway' with subclass='station' (most common)
          [
            "all",
            ["==", ["get", "class"], "railway"],
            ["==", ["get", "subclass"], "station"],
            // Only rank > 2 stations
            [
              "all",
              ["has", "rank"], // Must have rank property
              [">", ["get", "rank"], 2], // Rank > 2
            ],
          ],
          // Also try class='transport' with various station subclasses (fallback)
          [
            "all",
            ["match", ["get", "class"], ["transport"], true, false],
            ["match", ["get", "subclass"], ["railway_station", "station", "subway", "train_station"], true, false],
            // Only rank > 2 stations
            [
              "all",
              ["has", "rank"], // Must have rank property
              [">", ["get", "rank"], 2], // Rank > 2
            ],
          ],
        ],
      ],
      layout: {
        "icon-image": "rail",
        "icon-size": 0.75, // Smaller for lower rank stations
        "icon-allow-overlap": true,
        "icon-ignore-placement": false,
        "icon-optional": false,
        "text-field": createTextField(),
        "text-font": theme.fonts.regular,
        "text-size": ["interpolate", ["linear"], ["zoom"], 15, 9, 16, 12],
        "text-offset": [0, 1.2],
        "text-anchor": "top",
        "text-optional": true,
        "text-allow-overlap": false,
        "symbol-placement": "point" as const,
      },
      paint: {
        "icon-color": poiConfig.iconColor || "#7a8ba3",
        "icon-opacity": 0.8, // More transparent for lower rank stations
        "text-color": poiConfig.textColor,
        "text-halo-color": poiConfig.textHalo,
        "text-halo-width": poiConfig.textHaloWidth || 1.5,
        "text-halo-blur": 1,
      },
    });
    
    // School/Educational institution POIs - Rank 1 colleges/universities at zoom 14+
    // Colleges/universities have class='college' with subclass='university' or 'college'
    layers.push({
      id: `poi-school-rank1-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: 14, // Rank 1 colleges/universities appear at zoom 14
      filter: [
        "all",
        ["has", "name"],
        ["==", ["get", "class"], "college"],
        ["match", ["get", "subclass"], ["university", "college"], true, false],
        // Only rank 1 colleges/universities (or no rank which defaults to rank 1)
        [
          "any",
          ["!", ["has", "rank"]], // No rank = rank 1
          ["==", ["get", "rank"], 1], // Rank 1
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "school",
        "icon-size": 0.9,
      },
      paint: poiPaint,
    });
    
    // School/Educational institution POIs - Rank 2 colleges/universities at zoom 14.5+
    layers.push({
      id: `poi-school-rank2-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: 14.5, // Rank 2 colleges/universities appear at zoom 14.5
      filter: [
        "all",
        ["has", "name"],
        ["==", ["get", "class"], "college"],
        ["match", ["get", "subclass"], ["university", "college"], true, false],
        // Only rank 2 colleges/universities
        ["==", ["get", "rank"], 2],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "school",
        "icon-size": 0.85,
      },
      paint: poiPaint,
    });
    
    // School/Educational institution POIs - Rank > 2 colleges/universities at zoom 15+
    layers.push({
      id: `poi-school-rank3plus-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "poi",
      minzoom: 15, // Rank > 2 colleges/universities appear at zoom 15
      filter: [
        "all",
        ["has", "name"],
        ["==", ["get", "class"], "college"],
        ["match", ["get", "subclass"], ["university", "college"], true, false],
        // Only rank > 2 colleges/universities
        [
          "all",
          ["has", "rank"], // Must have rank property
          [">", ["get", "rank"], 2], // Rank > 2
        ],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "school",
        "icon-size": 0.75, // Smaller for lower rank colleges/universities
      },
      paint: poiPaint,
    });
  }
  
  // Park labels from PARK layer (separate from POI sources)
  // Only use sources that have park data to avoid duplicates
  for (const source of parkSources) {
    layers.push({
      id: `park-label-${source.name}`,
      type: "symbol",
      source: source.name,
      "source-layer": "park",
      minzoom: source.minZoom,
      filter: [
        "all",
        ["has", "name"],
        ["match", ["get", "class"], ["national_park", "national_monument", "state_park"], true, false],
        // Only show Point geometries (not Polygons) to avoid duplicate labels
        // Point features typically have rank=1 and are the main label location
        ["==", ["geometry-type"], "Point"],
      ],
      layout: {
        ...baseLayout,
        "icon-image": "park",
        "symbol-placement": "point",
        // Prevent duplicate labels by requiring minimum distance
        "symbol-spacing": 250, // Minimum distance between symbols in pixels
        "text-optional": true,
      },
      paint: poiPaint,
    });
  }
  
  return layers;
}

