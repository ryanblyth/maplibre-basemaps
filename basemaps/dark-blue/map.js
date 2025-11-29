/* global maplibregl, pmtiles */

// Register PMTiles protocol
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

// Initialize map (disable default attribution control)
const map = new maplibregl.Map({
  container: "map-container",
  style: "./style.json",
  center: [-105.7821, 39.5501],
  zoom: 8,
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

// Log zoom level changes (useful for debugging)
map.on('zoom', () => {
  const zoom = map.getZoom();
  console.log(`Zoom level: ${zoom.toFixed(2)}`);
});

// Error handling
map.on("error", (e) => console.error("Map error:", e?.error || e));
