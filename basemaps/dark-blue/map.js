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

map.addControl(new maplibregl.NavigationControl(), "top-right");

map.on("error", (e) => console.error("Map error:", e?.error || e));

