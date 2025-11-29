/* global maplibregl, pmtiles */

// Register PMTiles protocol
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

// Initialize map (disable default attribution control)
const map = new maplibregl.Map({
  container: "map",
  style: "./style.json",
  center: [-105.7821, 39.5501],
  zoom: 8,
  hash: false,
  attributionControl: false
});

// Add navigation control
map.addControl(new maplibregl.NavigationControl(), "top-right");

// Add attribution control with custom attribution
const attributionControl = new maplibregl.AttributionControl({
  compact: false,
  customAttribution: "<a href='https://maplibre.org/'>MapLibre</a> | © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, © <a href='https://openmaptiles.org/'>OpenMapTiles</a> | <a href='https://www.naturalearthdata.com/'>Natural Earth</a>"
});
map.addControl(attributionControl);

// Set globe projection when style loads
map.on('style.load', () => {
  map.setProjection({
    type: 'globe'
  });
});

// Log zoom level changes (useful for debugging)
map.on('zoom', () => {
  const zoom = map.getZoom();
  console.log(`Zoom level: ${zoom.toFixed(2)}`);
});

// Error handling
map.on("error", (e) => console.error("Map error:", e?.error || e));
