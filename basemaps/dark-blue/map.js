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

// Feature inspection on click
map.on('click', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: [
      'city-label-world-rank1-2',
      'city-label-world-rank3-6',
      'city-label-world-mid-rank1-2',
      'city-label-world-mid-rank3-6',
      'city-label-world-mid-rank7-10',
      'city-label-world-mid-all',
      'city-label-us-rank1-2',
      'city-label-us-rank3-6',
      'city-label-us-rank7-10',
      'city-label-us-all',
      'city-label-us-small'
    ]
  });
  
  if (features.length > 0) {
    console.log(`📍 Features at (${e.lngLat.lng.toFixed(4)}, ${e.lngLat.lat.toFixed(4)})`);
    features.forEach((feature, i) => {
      console.log(`Feature ${i + 1}:`, feature.layer.id);
      console.log(`  Layer ID: ${feature.layer.id}`);
      console.log(`  Source: ${feature.source}`);
      console.log(`  Source Layer: ${feature.sourceLayer}`);
      console.log(`  Name: ${feature.properties.name || feature.properties['name:en'] || 'N/A'}`);
      console.log(`  Class: ${feature.properties.class || 'N/A'}`);
      console.log(`  Rank: ${feature.properties.rank !== undefined ? feature.properties.rank : 'N/A (missing)'}`);
      console.log(`  Has rank property: ${feature.properties.hasOwnProperty('rank')}`);
      console.log(`  All Properties:`, feature.properties);
      console.log(`  Geometry Type: ${feature.geometry.type}`);
      console.log(`  Zoom Level: ${map.getZoom().toFixed(2)}`);
      
      // Check which layer's text-size would apply
      const layer = map.getLayer(feature.layer.id);
      if (layer && layer.layout && layer.layout['text-size']) {
        console.log(`  Text-size expression:`, JSON.stringify(layer.layout['text-size'], null, 2));
        
        // Try to evaluate what size would be applied
        const props = feature.properties;
        const zoom = map.getZoom();
        const hasRank = props.hasOwnProperty('rank');
        const rank = props.rank;
        const cityClass = props.class;
        
        console.log(`  📏 Font-size analysis:`);
        console.log(`     Current zoom: ${zoom.toFixed(2)}`);
        console.log(`     Has rank: ${hasRank}`);
        console.log(`     Rank value: ${rank !== undefined ? rank : 'undefined'}`);
        console.log(`     Class: ${cityClass}`);
        
        // Determine which branch of the expression would be used
        if (hasRank) {
          if (rank <= 1) {
            console.log(`     → Would use rank 1 size`);
          } else if (rank <= 2) {
            console.log(`     → Would use rank 2 size`);
          } else if (rank <= 4) {
            console.log(`     → Would use rank 3-4 size`);
          } else if (rank <= 6) {
            console.log(`     → Would use rank 5-6 size`);
          } else if (rank <= 10) {
            console.log(`     → Would use rank 7-10 size`);
          } else {
            console.log(`     → Rank > 10, would use default size`);
          }
        } else {
          console.log(`     → No rank, would use class-based size (${cityClass})`);
        }
      }
    });
    
    // Quick summary
    const summary = features.map(f => {
      const props = f.properties;
      return `${f.layer.id}: ${props.name || props['name:en'] || 'Unknown'} (class: ${props.class}, rank: ${props.rank || 'N/A'})`;
    });
    console.log(`📋 Quick Summary:`, summary.join(' | '));
  }
});

// Auto-inspect Aurora, CO when map loads (for debugging)
map.on('style.load', () => {
  // Wait a moment for tiles to load, then inspect Aurora
  setTimeout(() => {
    const auroraLng = -104.8;
    const auroraLat = 39.7;
    const point = map.project([auroraLng, auroraLat]);
    
    const features = map.queryRenderedFeatures(point, {
      layers: [
        'city-label-world-rank1-2',
        'city-label-world-rank3-6',
        'city-label-world-mid-rank1-2',
        'city-label-world-mid-rank3-6',
        'city-label-world-mid-rank7-10',
        'city-label-world-mid-all',
        'city-label-us-rank1-2',
        'city-label-us-rank3-6',
        'city-label-us-rank7-10',
        'city-label-us-all',
        'city-label-us-small'
      ]
    });
    
    const auroraFeatures = features.filter(f => {
      const name = (f.properties.name || f.properties['name:en'] || '').toLowerCase();
      return name.includes('aurora');
    });
    
    if (auroraFeatures.length > 0) {
      console.log('🔍 Aurora, CO Inspection:');
      auroraFeatures.forEach((feature, i) => {
        console.log(`  Layer: ${feature.layer.id}`);
        console.log(`  Source: ${feature.source}`);
        console.log(`  Properties:`, feature.properties);
        console.log(`  Rank: ${feature.properties.rank || 'N/A'}`);
        console.log(`  Class: ${feature.properties.class || 'N/A'}`);
        console.log(`  Current Zoom: ${map.getZoom().toFixed(2)}`);
      });
    } else {
      console.log('🔍 Aurora, CO not found at current zoom level. Try zooming to level 7-8.');
    }
  }, 2000);
});

// Error handling
map.on("error", (e) => console.error("Map error:", e?.error || e));

// Expose inspection function to global scope for console debugging
window.inspectAurora = function() {
  const auroraLng = -104.8;
  const auroraLat = 39.7;
  
  // Try to find Aurora at the current view
  const point = map.project([auroraLng, auroraLat]);
  
  const features = map.queryRenderedFeatures(point, {
    layers: [
      'city-label-world-rank1-2',
      'city-label-world-rank3-6',
      'city-label-world-mid-rank1-2',
      'city-label-world-mid-rank3-6',
      'city-label-world-mid-rank7-10',
      'city-label-world-mid-all',
      'city-label-us-rank1-2',
      'city-label-us-rank3-6',
      'city-label-us-rank7-10',
      'city-label-us-all',
      'city-label-us-small'
    ]
  });
  
  const auroraFeatures = features.filter(f => {
    const name = (f.properties.name || f.properties['name:en'] || '').toLowerCase();
    return name.includes('aurora');
  });
  
  if (auroraFeatures.length > 0) {
    console.log('🔍 Aurora, CO Inspection:');
    console.log(`  Current Zoom: ${map.getZoom().toFixed(2)}`);
    auroraFeatures.forEach((feature, i) => {
      console.log(`\n  Feature ${i + 1}:`);
      console.log(`    Layer ID: ${feature.layer.id}`);
      console.log(`    Source: ${feature.source}`);
      console.log(`    Source Layer: ${feature.sourceLayer}`);
      console.log(`    Name: ${feature.properties.name || feature.properties['name:en'] || 'N/A'}`);
      console.log(`    Class: ${feature.properties.class || 'N/A'}`);
      console.log(`    Rank: ${feature.properties.rank !== undefined ? feature.properties.rank : 'N/A'}`);
      console.log(`    All Properties:`, feature.properties);
      
      // Get the layer's text-size expression
      const layer = map.getLayer(feature.layer.id);
      if (layer && layer.layout && layer.layout['text-size']) {
        console.log(`    Text-size expression:`, JSON.stringify(layer.layout['text-size'], null, 2));
      }
    });
  } else {
    console.log('🔍 Aurora, CO not found at current zoom/view. Try:');
    console.log('  1. Zoom to level 7-8');
    console.log('  2. Pan to Aurora, CO (approximately -104.8, 39.7)');
    console.log('  3. Run inspectAurora() again');
  }
  
  return auroraFeatures;
};
