/* global maplibregl, pmtiles */

// Register PMTiles protocol
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

// Initialize map
const map = new maplibregl.Map({
  container: "map",
  style: "./style.json",
  center: [-105.7821, 39.5501],
  zoom: 8,
  hash: false
});

// Set globe projection when style loads
map.on('style.load', () => {
  map.setProjection({
    type: 'globe'
  });
});

// Add navigation control
map.addControl(new maplibregl.NavigationControl(), "top-right");

// Log zoom level changes (useful for debugging)
map.on('zoom', () => {
  const zoom = map.getZoom();
  console.log(`Zoom level: ${zoom.toFixed(2)}`);
});

// Error handling
map.on("error", (e) => console.error("Map error:", e?.error || e));
