/* global maplibregl, pmtiles */

// Register PMTiles protocol
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

// Initialize map (disable default attribution control)
// maxZoom set high to allow overzooming beyond source limits (6 for world, 15 for US)
const map = new maplibregl.Map({
  container: "map-container",
  style: "./style.json",
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

// Log zoom level changes
map.on('zoom', () => {
  const zoom = map.getZoom();
  console.log(`Zoom level: ${zoom.toFixed(2)}`);
});

// Water feature inspection on click
map.on('click', (e) => {
  const zoom = map.getZoom();
  const clickLng = e.lngLat.lng;
  const clickLat = e.lngLat.lat;
  
  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(`🌊 WATER FEATURE INSPECTION`);
  console.log(`   Location: (${clickLng.toFixed(4)}, ${clickLat.toFixed(4)})`);
  console.log(`   Zoom Level: ${zoom.toFixed(2)}`);
  console.log(`═══════════════════════════════════════════════════════════`);
  
  // 1. Check rendered features at click point AND in a much wider area (for large lakes)
  const allRendered = map.queryRenderedFeatures(e.point);
  const allRenderedWide = map.queryRenderedFeatures([
    [e.point.x - 50, e.point.y - 50],
    [e.point.x + 50, e.point.y + 50]
  ]);
  // Query a very large area to find labels that might be far from the click point
  const allRenderedVeryWide = map.queryRenderedFeatures([
    [e.point.x - 500, e.point.y - 500],
    [e.point.x + 500, e.point.y + 500]
  ]);
  
  // Filter for water-related layers
  const waterLabels = allRendered.filter(f => {
    const layerId = f.layer?.id || '';
    return layerId.includes('water-label') || 
           layerId.includes('marine-label') ||
           layerId.includes('waterway-label');
  });
  
  const waterLabelsWide = allRenderedWide.filter(f => {
    const layerId = f.layer?.id || '';
    return layerId.includes('water-label') || 
           layerId.includes('marine-label') ||
           layerId.includes('waterway-label');
  });
  
  const waterLabelsVeryWide = allRenderedVeryWide.filter(f => {
    const layerId = f.layer?.id || '';
    return layerId.includes('water-label') || 
           layerId.includes('marine-label') ||
           layerId.includes('waterway-label');
  });
  
  // Check for water fill layers (to see what source layers are available)
  const waterFills = allRendered.filter(f => {
    const layerId = f.layer?.id || '';
    return (layerId.includes('water') || layerId.includes('marine')) && !layerId.includes('label') && !layerId.includes('way');
  });
  
  // Also check ALL rendered features to see if there are any place features
  const placeFeatures = allRendered.filter(f => {
    const sourceLayer = f.sourceLayer || '';
    return sourceLayer === 'place';
  });
  
  console.log(`\n📋 RENDERED FEATURES:`);
  console.log(`   At click point: ${allRendered.length} total, ${waterLabels.length} water labels`);
  console.log(`   In nearby area (100px): ${waterLabelsWide.length} water labels`);
  console.log(`   In large area (1000px): ${waterLabelsVeryWide.length} water labels`);
  
  if (waterFills.length > 0) {
    console.log(`\n   💧 WATER FILL LAYERS (showing available source data):`);
    waterFills.forEach((fill, i) => {
      const props = fill.properties || {};
      const layerId = fill.layer?.id || 'unknown';
      const source = fill.source || 'unknown';
      const sourceLayer = fill.sourceLayer || 'unknown';
      console.log(`      ${i + 1}. Layer: "${layerId}"`);
      console.log(`         Source: ${source}`);
      console.log(`         Source Layer: ${sourceLayer}`);
      console.log(`         Properties:`, Object.keys(props).length > 0 ? props : 'No properties');
    });
  }
  
  if (placeFeatures.length > 0) {
    console.log(`\n   📍 PLACE FEATURES (from place source layer):`);
    placeFeatures.forEach((feature, i) => {
      const props = feature.properties || {};
      const layerId = feature.layer?.id || 'unknown';
      const name = props.name || props['name:en'] || 'NO NAME';
      console.log(`      ${i + 1}. Layer: "${layerId}"`);
      console.log(`         Name: "${name}"`);
      console.log(`         Class: ${props.class || 'N/A'}`);
      console.log(`         Rank: ${props.rank !== undefined ? props.rank : 'N/A'}`);
      console.log(`         All Properties:`, props);
    });
  }
  
  if (waterLabels.length > 0) {
    console.log(`\n   ✅ WATER LABEL AT CLICK POINT:`);
    waterLabels.forEach((label, i) => {
      const props = label.properties;
      const name = props.name || props['name:en'] || 'NO NAME';
      const layerId = label.layer?.id || 'unknown';
      console.log(`\n      Label ${i + 1}:`);
      console.log(`         Layer: "${layerId}"`);
      console.log(`         Name: "${name}"`);
      console.log(`         Source: ${label.source || 'N/A'}`);
      console.log(`         Source Layer: ${label.sourceLayer || 'N/A'}`);
      console.log(`         Rank: ${props.rank !== undefined ? props.rank : 'N/A'}`);
      console.log(`         Class: ${props.class || 'N/A'}`);
      console.log(`         Has 'name': ${props.hasOwnProperty('name')}`);
      console.log(`         Has 'name:en': ${props.hasOwnProperty('name:en')}`);
      
      // Analyze why this label is showing
      console.log(`\n         Why this label is showing:`);
      if (layerId.includes('water-label-us-major')) {
        console.log(`         ✅ In 'water-label-us-major' layer`);
        console.log(`            - Source: us_high, minzoom: 6`);
        console.log(`            - Filter: rank <= 4 (or no rank)`);
        console.log(`            - Current zoom: ${zoom.toFixed(2)} (${zoom >= 6 ? '✅' : '❌'})`);
        console.log(`            - Rank: ${props.rank !== undefined ? props.rank : 'N/A'} (${!props.hasOwnProperty('rank') || props.rank <= 4 ? '✅' : '❌'})`);
      } else if (layerId.includes('water-label-us')) {
        console.log(`         ✅ In 'water-label-us' layer`);
        console.log(`            - Source: us_high, minzoom: 10`);
        console.log(`            - Filter: rank > 4`);
        console.log(`            - Current zoom: ${zoom.toFixed(2)} (${zoom >= 10 ? '✅' : '❌'})`);
        console.log(`            - Rank: ${props.rank !== undefined ? props.rank : 'N/A'} (${props.hasOwnProperty('rank') && props.rank > 4 ? '✅' : '❌'})`);
      } else if (layerId.includes('water-label-world-major')) {
        console.log(`         ✅ In 'water-label-world-major' layer`);
        console.log(`            - Source: world_low, minzoom: 2, maxzoom: 6.5`);
        console.log(`            - Filter: rank <= 2 (or no rank)`);
        console.log(`            - Current zoom: ${zoom.toFixed(2)} (${zoom >= 2 && zoom <= 6.5 ? '✅' : '❌'})`);
        console.log(`            - Rank: ${props.rank !== undefined ? props.rank : 'N/A'} (${!props.hasOwnProperty('rank') || props.rank <= 2 ? '✅' : '❌'})`);
      } else if (layerId.includes('water-label-world')) {
        console.log(`         ✅ In 'water-label-world' layer`);
        console.log(`            - Source: world_low, minzoom: 4, maxzoom: 6.5`);
        console.log(`            - Filter: rank > 2`);
        console.log(`            - Current zoom: ${zoom.toFixed(2)} (${zoom >= 4 && zoom <= 6.5 ? '✅' : '❌'})`);
        console.log(`            - Rank: ${props.rank !== undefined ? props.rank : 'N/A'} (${props.hasOwnProperty('rank') && props.rank > 2 ? '✅' : '❌'})`);
      }
    });
  } else {
    console.log(`\n   ⚠️  NO water label at exact click point`);
    
    // Check if there are labels nearby or in a large area
    if (waterLabelsWide.length > 0) {
      console.log(`\n   📍 But found ${waterLabelsWide.length} water label(s) nearby:`);
      waterLabelsWide.forEach((label, i) => {
        const props = label.properties;
        const name = props.name || props['name:en'] || 'NO NAME';
        console.log(`      ${i + 1}. "${name}" (layer: ${label.layer?.id || 'unknown'})`);
      });
      console.log(`\n   💡 The label might be slightly offset from the click point.`);
    } else if (waterLabelsVeryWide.length > 0) {
      console.log(`\n   📍 Found ${waterLabelsVeryWide.length} water label(s) in large area (but not nearby):`);
      waterLabelsVeryWide.forEach((label, i) => {
        const props = label.properties;
        const name = props.name || props['name:en'] || 'NO NAME';
        const layerId = label.layer?.id || 'unknown';
        console.log(`      ${i + 1}. "${name}" (layer: ${layerId})`);
        console.log(`         Source: ${label.source || 'N/A'}, Source Layer: ${label.sourceLayer || 'N/A'}`);
        console.log(`         Rank: ${props.rank !== undefined ? props.rank : 'N/A'}, Class: ${props.class || 'N/A'}`);
      });
      console.log(`\n   💡 Large lakes often have labels placed far from the edges. The label exists but is not near your click point.`);
    } else {
      console.log(`\n   ❌ NO water labels found in nearby area either.`);
      console.log(`\n   🔍 Analyzing why no label is showing:`);
      console.log(`      Current zoom: ${zoom.toFixed(2)}`);
      
      // Check which layers should be active at this zoom
      if (zoom < 2) {
        console.log(`      ⚠️  Zoom too low - water labels start at zoom 2`);
      } else if (zoom >= 2 && zoom <= 6.5) {
        console.log(`      ✅ Should show 'water-label-world-major' (rank <= 2) or 'water-label-world' (rank > 2)`);
        console.log(`      ✅ Should show 'marine-label-world' (oceans/seas)`);
      } else if (zoom >= 6 && zoom < 10) {
        console.log(`      ✅ Should show 'water-label-world-mid-major' (rank <= 3) or 'water-label-world-mid' (rank > 3)`);
        console.log(`      ✅ Should show 'water-label-us-major' (rank <= 4) if in US`);
        console.log(`      ✅ Should show 'marine-label-world-mid' (oceans/seas)`);
      } else if (zoom >= 10) {
        console.log(`      ✅ Should show 'water-label-us' (rank > 4) if in US`);
        console.log(`      ✅ Should show 'water-label-world-mid' (rank > 3) for world`);
      }
      
      console.log(`\n   💡 Possible reasons no label is showing:`);
      console.log(`      1. The water body has no name in the source data`);
      console.log(`      2. The water body's rank doesn't match the filter criteria`);
      console.log(`      3. The label is being filtered out by the layer's filter`);
      console.log(`      4. The label is being hidden by collision detection`);
      console.log(`      5. The water_name source layer doesn't contain this feature`);
    }
  }
  
  // 2. Note about source features (PMTiles limitation)
  console.log(`\n📊 NOTE:`);
  console.log(`   querySourceFeatures() doesn't work well with PMTiles.`);
  console.log(`   Analysis is based on rendered features only.`);
  
  // Final check: Query ALL visible water labels on the entire map
  const bounds = map.getBounds();
  const visibleWaterLabels = map.queryRenderedFeatures([
    [0, 0],
    [map.getContainer().clientWidth, map.getContainer().clientHeight]
  ]).filter(f => {
    const layerId = f.layer?.id || '';
    return layerId.includes('water-label') || 
           layerId.includes('marine-label') ||
           layerId.includes('waterway-label');
  });
  
  if (visibleWaterLabels.length > 0 && waterLabels.length === 0) {
    console.log(`\n   🌍 VISIBLE WATER LABELS ON MAP: ${visibleWaterLabels.length} total`);
    console.log(`   Sample labels (first 10):`);
    visibleWaterLabels.slice(0, 10).forEach((label, i) => {
      const props = label.properties;
      const name = props.name || props['name:en'] || 'NO NAME';
      console.log(`      ${i + 1}. "${name}" (layer: ${label.layer?.id || 'unknown'}, source: ${label.source || 'N/A'})`);
    });
    console.log(`\n   💡 There ARE water labels visible on the map, but none at/near your click point.`);
    console.log(`   This suggests the Great Lakes might not have labels, or labels are placed elsewhere.`);
  } else if (visibleWaterLabels.length === 0) {
    console.log(`\n   ⚠️  NO water labels visible anywhere on the map!`);
    console.log(`   This suggests:`);
    console.log(`   1. The water_name/place source layers might be empty in your PMTiles`);
    console.log(`   2. The label layers might not be rendering due to filter/zoom issues`);
    console.log(`   3. The font might not be loading correctly`);
  }
  
  console.log(`\n═══════════════════════════════════════════════════════════\n`);
});

// Error handling
map.on("error", (e) => console.error("Map error:", e?.error || e));
