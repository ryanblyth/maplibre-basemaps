/* global maplibregl, pmtiles */

/**
 * Dark Blue Basemap - Map Initialization
 * 
 * This map uses the generated style.json which is built from TypeScript:
 *   npm run build:styles
 * 
 * For programmatic usage (e.g., in a bundled application), you can import directly:
 * 
 *   import { createDarkBlueStyle } from './styles/darkBlueStyle.js';
 *   
 *   const map = new maplibregl.Map({
 *     container: "map-container",
 *     style: createDarkBlueStyle(),
 *     // ... other options
 *   });
 * 
 * For static hosting or simple HTML pages, use the generated JSON:
 *   style: "./style.json"  // or "./style.generated.json"
 */

// Register PMTiles protocol
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

// Initialize map (disable default attribution control)
// maxZoom set high to allow overzooming beyond source limits (6 for world, 15 for US)
const map = new maplibregl.Map({
  container: "map-container",
  style: "./style.json?v=" + Date.now(),  // Cache-bust to ensure latest style
  center: [-105.7821, 39.5501],
  zoom: 8,
  minZoom: 2,
  maxZoom: 22,
  hash: false,
  attributionControl: false,
  canvasContextAttributes: { antialias: true }
});

// Add navigation control
map.addControl(new maplibregl.NavigationControl(), "top-right");

// Add attribution control with custom attribution
const attributionControl = new maplibregl.AttributionControl({
  compact: false,
  customAttribution: "<a href='https://maplibre.org/'>MapLibre</a> | © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, © <a href='https://openmaptiles.org/'>OpenMapTiles</a> | <a href='https://www.naturalearthdata.com/'>Natural Earth</a>"
});
map.addControl(attributionControl);

// Create and attach the starry background
// Configuration is now contained in shared/js/maplibre-gl-starfield.js
// You can override defaults by passing options here if needed
const starryBg = new MapLibreStarryBackground();

// Set globe projection and attach starfield when style loads
map.on('style.load', () => {
  map.setProjection({
    type: 'globe'
  });
  starryBg.attachToMap(map, "starfield-container", "globe-glow");
});

// Error handling
map.on("error", (e) => console.error("Map error:", e?.error || e));

// ============================================================================
// Debug: Log zoom level changes
// ============================================================================
let lastZoom = null;
let zoomInterval = null;

function setupZoomLogging() {
  if (zoomInterval) return; // Already set up
  
  // Log initial zoom
  try {
    const z = map.getZoom();
    console.log(`[Zoom] Initial: ${z.toFixed(2)}`);
    lastZoom = z;
  } catch (e) {
    // Map not ready yet
  }
  
  // Poll zoom level (more reliable than events in some cases)
  zoomInterval = setInterval(() => {
    try {
      const currentZoom = map.getZoom();
      if (lastZoom === null || Math.abs(currentZoom - lastZoom) >= 0.05) {
        console.log(`[Zoom] ${currentZoom.toFixed(2)}`);
        lastZoom = currentZoom;
      }
    } catch (e) {
      // Silently fail if map not ready
    }
  }, 500);
}

// Setup when map is ready
map.on('load', setupZoomLogging);
map.on('style.load', setupZoomLogging);

// Also try immediately if map is already loaded
setTimeout(() => {
  if (map.loaded()) {
    setupZoomLogging();
  }
}, 1000);

// ============================================================================
// Debug: Show road/street information on click
// ============================================================================
function setupRoadClickHandler() {
  map.on('click', function(e) {
    // Use a bounding box for easier clicking on thin roads
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5]
    ];
    
    const features = map.queryRenderedFeatures(bbox, {
      layers: [
        'road-world',
        'road-world-mid',
        'road-tunnel-casing',
        'road-tunnel',
        'road-casing',
        'road-bridge-casing',
        'road-bridge',
        'road-casing-us',
        'road-us',
        'road-alley',
        'road-parking-aisle',
        'road-other',
        'road-bridge-us',
        'paths',
        'railway'
      ]
    });

    if (features.length > 0) {
      const feature = features[0];
      const props = feature.properties;
      const layerId = feature.layer?.id;
      const currentZoom = map.getZoom();
      
      // Get the line-width from the layer's paint properties
      let lineWidth = 'N/A';
      try {
        const paintWidth = map.getPaintProperty(layerId, 'line-width');
        if (typeof paintWidth === 'number') {
          lineWidth = paintWidth.toFixed(2) + 'px';
        } else if (Array.isArray(paintWidth)) {
          // It's an expression - try to evaluate at current zoom
          lineWidth = evaluateWidthExpression(paintWidth, currentZoom, props.class);
        }
      } catch (err) {
        lineWidth = 'Error: ' + err.message;
      }
      
      // Get the line-color from the layer's paint properties
      let lineColor = 'N/A';
      try {
        const paintColor = map.getPaintProperty(layerId, 'line-color');
        if (typeof paintColor === 'string') {
          lineColor = paintColor;
        } else if (Array.isArray(paintColor)) {
          lineColor = evaluateColorExpression(paintColor, props.class);
        }
      } catch (err) {
        lineColor = 'Error: ' + err.message;
      }
      
      console.group('🛣️  Street/Road Information');
      console.log('Road Class:', props.class || 'N/A');
      console.log('Road Type:', getRoadTypeName(props.class));
      console.log('Name:', props.name || props['name:en'] || 'Unnamed');
      console.log('Brunnel:', props.brunnel || 'none (surface road)');
      console.log('Current Zoom:', currentZoom.toFixed(2));
      console.log('Line Width:', lineWidth);
      console.log('Line Color:', lineColor);
      console.log('Layer:', layerId || 'N/A');
      console.log('Network:', props.network || 'N/A');
      console.log('Ref:', props.ref || 'N/A');
      console.log('All Properties:', props);
      console.groupEnd();
    } else {
      // Query ALL features at this point to see what's there
      const allFeatures = map.queryRenderedFeatures(bbox);
      if (allFeatures.length > 0) {
        console.group('🔍 No road layer found, but found other features:');
        console.log('Current Zoom:', map.getZoom().toFixed(2));
        allFeatures.slice(0, 5).forEach((f, i) => {
          console.log(`Feature ${i + 1}:`, {
            layer: f.layer?.id,
            source: f.source,
            sourceLayer: f.sourceLayer,
            type: f.layer?.type,
            class: f.properties?.class,
            name: f.properties?.name || f.properties?.['name:en'],
            properties: f.properties
          });
        });
        if (allFeatures.length > 5) {
          console.log(`... and ${allFeatures.length - 5} more features`);
        }
        console.groupEnd();
      } else {
        console.log('ℹ️  Clicked location has no features at all');
      }
    }
  });
}

/**
 * Evaluate a MapLibre line-width expression at a given zoom level
 * Handles interpolate and match expressions
 */
function evaluateWidthExpression(expr, zoom, roadClass) {
  if (!Array.isArray(expr)) {
    return typeof expr === 'number' ? expr.toFixed(2) + 'px' : String(expr);
  }
  
  const exprType = expr[0];
  
  // Handle interpolate expressions: ["interpolate", ["linear"], ["zoom"], z1, v1, z2, v2, ...]
  if (exprType === 'interpolate') {
    const stops = expr.slice(3); // Skip ["interpolate", ["linear"], ["zoom"]]
    let prevZoom = null, prevValue = null;
    
    for (let i = 0; i < stops.length; i += 2) {
      const stopZoom = stops[i];
      let stopValue = stops[i + 1];
      
      // If the value is itself an expression (like match), try to evaluate it
      if (Array.isArray(stopValue)) {
        stopValue = evaluateWidthExpression(stopValue, zoom, roadClass);
        if (typeof stopValue === 'string') {
          stopValue = parseFloat(stopValue);
        }
      }
      
      if (zoom <= stopZoom) {
        if (prevZoom === null) {
          return stopValue.toFixed(2) + 'px';
        }
        // Linear interpolation
        const t = (zoom - prevZoom) / (stopZoom - prevZoom);
        const interpolated = prevValue + t * (stopValue - prevValue);
        return interpolated.toFixed(2) + 'px';
      }
      
      prevZoom = stopZoom;
      prevValue = stopValue;
    }
    
    // Beyond last stop
    return prevValue ? prevValue.toFixed(2) + 'px' : 'N/A';
  }
  
  // Handle match expressions: ["match", ["get", "class"], "motorway", 1.2, "trunk", 1.0, ...]
  if (exprType === 'match') {
    const matchOn = expr[1]; // ["get", "class"]
    const cases = expr.slice(2);
    const defaultValue = cases[cases.length - 1];
    
    for (let i = 0; i < cases.length - 1; i += 2) {
      const matchValue = cases[i];
      const resultValue = cases[i + 1];
      
      if (matchValue === roadClass || (Array.isArray(matchValue) && matchValue.includes(roadClass))) {
        if (Array.isArray(resultValue)) {
          return evaluateWidthExpression(resultValue, zoom, roadClass);
        }
        return typeof resultValue === 'number' ? resultValue.toFixed(2) + 'px' : String(resultValue);
      }
    }
    
    if (Array.isArray(defaultValue)) {
      return evaluateWidthExpression(defaultValue, zoom, roadClass);
    }
    return typeof defaultValue === 'number' ? defaultValue.toFixed(2) + 'px' : String(defaultValue);
  }
  
  return JSON.stringify(expr).substring(0, 50) + '...';
}

function evaluateColorExpression(expr, roadClass) {
  if (!Array.isArray(expr)) return String(expr);
  if (expr[0] === 'match') {
    const cases = expr.slice(2);
    for (let i = 0; i < cases.length - 1; i += 2) {
      if (cases[i] === roadClass || (Array.isArray(cases[i]) && cases[i].includes(roadClass))) {
        return String(cases[i + 1]);
      }
    }
    return String(cases[cases.length - 1]) + ' (default)';
  }
  return JSON.stringify(expr).substring(0, 60) + '...';
}

// Setup when map is ready
map.on('load', setupRoadClickHandler);
map.on('style.load', setupRoadClickHandler);

// Also try immediately if map is already loaded
setTimeout(() => {
  if (map.loaded()) {
    setupRoadClickHandler();
  }
}, 1000);

/**
 * Get human-readable road type name
 */
function getRoadTypeName(roadClass) {
  const roadTypes = {
    'motorway': 'Motorway/Freeway/Interstate',
    'trunk': 'Trunk Highway/Major Highway',
    'primary': 'Primary Road/State Highway',
    'secondary': 'Secondary Road/County Highway',
    'tertiary': 'Tertiary Road',
    'residential': 'Residential Street',
    'service': 'Service Road/Alley',
    'path': 'Path/Footway',
    'track': 'Track',
    'footway': 'Footway/Sidewalk',
    'cycleway': 'Cycleway/Bike Path',
    'rail': 'Railway',
  };
  return roadTypes[roadClass] || roadClass || 'Unknown';
}
