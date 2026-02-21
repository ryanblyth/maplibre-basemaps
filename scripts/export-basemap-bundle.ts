/**
 * Export Basemap Bundle Script
 * 
 * Exports a basemap bundle with all necessary files for use in another codebase.
 * 
 * Usage: npx tsx scripts/export-basemap-bundle.ts <basemap-name>
 * Example: npx tsx scripts/export-basemap-bundle.ts dark-blue
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

function exportBasemapBundle(basemapName: string): void {
  const basemapDir = join(projectRoot, "basemaps", basemapName);
  const outputDir = join(basemapDir, "map-bundle");
  const spritesDir = join(basemapDir, "sprites");
  const outputSpritesDir = join(outputDir, "sprites");

  // Validate basemap exists
  if (!existsSync(basemapDir)) {
    console.error(`❌ Basemap directory not found: ${basemapDir}`);
    process.exit(1);
  }

  const styleJsonPath = join(basemapDir, "style.json");
  if (!existsSync(styleJsonPath)) {
    console.error(`❌ Style file not found: ${styleJsonPath}`);
    process.exit(1);
  }

  console.log(`📦 Exporting basemap bundle: ${basemapName}`);
  console.log(`   Output directory: ${outputDir}`);

  // Create output directory
  mkdirSync(outputDir, { recursive: true });
  mkdirSync(outputSpritesDir, { recursive: true });

  // 1. Copy and update style.json
  console.log(`   📄 Copying and updating style.json...`);
  const styleJson = JSON.parse(readFileSync(styleJsonPath, "utf8"));
  
  // Update sprite path to relative path
  if (styleJson.sprite) {
    const oldSpritePath = styleJson.sprite;
    styleJson.sprite = "./sprites/basemap";
    console.log(`      Updated sprite path: ${oldSpritePath} → ${styleJson.sprite}`);
  }

  const outputStylePath = join(outputDir, "style.json");
  writeFileSync(outputStylePath, JSON.stringify(styleJson, null, 2) + "\n", "utf8");
  console.log(`   ✓ Created ${outputStylePath}`);

  // 2. Copy sprite files
  console.log(`   🎨 Copying sprite files...`);
  const spriteFiles = [
    "basemap.json",
    "basemap.png",
    "basemap@2x.json",
    "basemap@2x.png"
  ];

  for (const spriteFile of spriteFiles) {
    const sourcePath = join(spritesDir, spriteFile);
    if (!existsSync(sourcePath)) {
      console.warn(`   ⚠️  Sprite file not found: ${sourcePath}`);
      continue;
    }
    const destPath = join(outputSpritesDir, spriteFile);
    copyFileSync(sourcePath, destPath);
    console.log(`      Copied ${spriteFile}`);
  }
  console.log(`   ✓ Sprite files copied to ${outputSpritesDir}`);

  // 3. Create map.js file
  console.log(`   📄 Creating map.js...`);
  const mapJsContent = `/* global maplibregl, pmtiles, MapLibreStarryBackground */

/**
 * Dark Blue Basemap - Map Initialization
 * 
 * This file contains the essential map initialization code.
 * For frameworks like Astro that load scripts dynamically, use this file.
 * 
 * Dependencies (must be loaded before this script):
 * - MapLibre GL JS: https://unpkg.com/maplibre-gl@5.13.0/dist/maplibre-gl.js
 * - PMTiles: https://unpkg.com/pmtiles@4.3.0/dist/pmtiles.js
 * - Starfield: https://data.storypath.studio/js/maplibre-gl-starfield.js
 */

// Configuration constants
const DEFAULT_PROJECTION = "globe";
const DEFAULT_MIN_ZOOM = { mercator: 0, globe: 2 };

// Get projection and minZoom from window overrides or use defaults
const projectionType = (typeof window !== 'undefined' && window.mapProjection) 
  ? window.mapProjection 
  : DEFAULT_PROJECTION;

const minZoomConfig = (typeof window !== 'undefined' && window.mapMinZoom)
  ? window.mapMinZoom
  : DEFAULT_MIN_ZOOM;

const minZoom = projectionType === 'mercator' 
  ? minZoomConfig.mercator 
  : minZoomConfig.globe;

// Register PMTiles protocol (REQUIRED)
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

// Initialize map
const map = new maplibregl.Map({
  container: "map-container",
  style: "./style.json",
  center: [-98.0, 39.0],
  zoom: 3.5,
  minZoom: minZoom,
  maxZoom: 22,
  hash: false,
  attributionControl: false,
  canvasContextAttributes: { antialias: true }
});

// Add navigation control
map.addControl(new maplibregl.NavigationControl(), "top-right");

// Add attribution control
const attributionControl = new maplibregl.AttributionControl({
  compact: false,
  customAttribution: "<a href='https://maplibre.org/'>MapLibre</a> | © <a href='https://storypath.studio/'>StoryPath Studio</a> | © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors | © <a href='https://openmaptiles.org/'>OpenMapTiles</a> | <a href='https://www.naturalearthdata.com/'>Natural Earth</a>"
});
map.addControl(attributionControl);

// Setup globe projection and starfield
const starryBg = new MapLibreStarryBackground();
map.on('style.load', () => {
  map.setProjection({ type: projectionType });
  if (projectionType === 'globe') {
    starryBg.attachToMap(map, "starfield-container", "globe-glow");
  }
});

// Error handling
map.on("error", (e) => console.error("Map error:", e?.error || e));

// Make map available globally for debugging (optional)
if (typeof window !== 'undefined') {
  window.map = map;
}
`;

  const mapJsPath = join(outputDir, "map.js");
  writeFileSync(mapJsPath, mapJsContent, "utf8");
  console.log(`   ✓ Created ${mapJsPath}`);

  // 4. Create CSS file
  console.log(`   📄 Creating style.css...`);
  const cssContent = `/**
 * Dark Blue Basemap Styles
 * 
 * Base styles for the map container and starfield effects.
 * Adapt these styles for your layout (e.g., Astro with header).
 */

/* Base styles - assumes full viewport (for standalone use) */
html, body {
  height: 100%;
  margin: 0;
  background-color: #27313f;
}

/* Map container - full viewport by default */
#map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 3;
}

/* Starfield background container */
#starfield-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* Globe glow effect container */
#globe-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

/* ============================================================================
 * Adaptation for Astro/Frameworks with Headers
 * ============================================================================
 * 
 * If your layout has a header (e.g., 70px), adapt the map container:
 * 
 * .map-container {
 *   height: calc(100vh - 70px);  /* Account for header */
 *   position: relative;          /* Change from absolute if needed */
 * }
 * 
 * Or use a wrapper:
 * 
 * .map-wrapper {
 *   position: relative;
 *   height: calc(100vh - 70px);
 *   width: 100%;
 * }
 * 
 * #map-container {
 *   position: absolute;
 *   top: 0;
 *   bottom: 0;
 *   left: 0;
 *   right: 0;
 * }
 * 
 * The starfield-container and globe-glow should match the map-container
 * dimensions and positioning.
 */
`;

  const cssPath = join(outputDir, "style.css");
  writeFileSync(cssPath, cssContent, "utf8");
  console.log(`   ✓ Created ${cssPath}`);

  // 5. Create minimal HTML example
  console.log(`   📄 Creating index.html...`);
  const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Dark Blue Basemap</title>
  <link href="https://unpkg.com/maplibre-gl@5.13.0/dist/maplibre-gl.css" rel="stylesheet" />
  <link href="./style.css" rel="stylesheet" />
</head>
<body>
  <div id="starfield-container"></div>
  <div id="globe-glow"></div>
  <div id="map-container"></div>
  
  <script src="https://unpkg.com/maplibre-gl@5.13.0/dist/maplibre-gl.js"></script>
  <script src="https://unpkg.com/pmtiles@4.3.0/dist/pmtiles.js"></script>
  <script src="https://data.storypath.studio/js/maplibre-gl-starfield.js"></script>
  <!-- Option 1: Use separate map.js file (recommended for frameworks like Astro) -->
  <script src="./map.js"></script>
  
  <!-- Option 2: Inline script (alternative, kept for standalone use) -->
  <!--
  <script>
    // Register PMTiles protocol (REQUIRED)
    const protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    // Initialize map
    const map = new maplibregl.Map({
      container: "map-container",
      style: "./style.json",
      center: [-98.0, 39.0],
      zoom: 3.5,
      minZoom: 2,  // For globe projection
      maxZoom: 22,
      hash: false,
      attributionControl: false,
      canvasContextAttributes: { antialias: true }
    });

    // Add navigation control
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add attribution control
    const attributionControl = new maplibregl.AttributionControl({
      compact: false,
      customAttribution: "<a href='https://maplibre.org/'>MapLibre</a> | © <a href='https://storypath.studio/'>StoryPath Studio</a> | © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors | © <a href='https://openmaptiles.org/'>OpenMapTiles</a> | <a href='https://www.naturalearthdata.com/'>Natural Earth</a>"
    });
    map.addControl(attributionControl);

    // Setup globe projection and starfield
    const starryBg = new MapLibreStarryBackground();
    map.on('style.load', () => {
      map.setProjection({ type: 'globe' });
      starryBg.attachToMap(map, "starfield-container", "globe-glow");
    });

    // Error handling
    map.on("error", (e) => console.error("Map error:", e?.error || e));
  </script>
  -->
</body>
</html>
`;

  const htmlPath = join(outputDir, "index.html");
  writeFileSync(htmlPath, htmlContent, "utf8");
  console.log(`   ✓ Created ${htmlPath}`);

  // 4. Create README
  console.log(`   📄 Creating README.md...`);
  const readmeContent = `# Dark Blue Basemap Bundle

This bundle contains all the essential files needed to render the dark-blue basemap in another codebase.

## Files Included

- \`style.json\` - MapLibre style definition (sprite path updated to relative)
- \`sprites/\` - Sprite files (PNG + JSON, regular + @2x)
  - \`basemap.json\`
  - \`basemap.png\`
  - \`basemap@2x.json\`
  - \`basemap@2x.png\`
- \`map.js\` - Map initialization script (for frameworks like Astro that load scripts dynamically)
- \`style.css\` - Map container and starfield styles (adaptable for different layouts)
- \`index.html\` - Minimal HTML example (uses map.js and style.css)

## External Dependencies (CDN)

The following are loaded from CDN and do not need to be bundled:

- **MapLibre GL JS**: \`https://unpkg.com/maplibre-gl@5.13.0/dist/maplibre-gl.js\`
- **MapLibre GL CSS**: \`https://unpkg.com/maplibre-gl@5.13.0/dist/maplibre-gl.css\`
- **PMTiles library**: \`https://unpkg.com/pmtiles@4.3.0/dist/pmtiles.js\`
- **Starfield script**: \`https://data.storypath.studio/js/maplibre-gl-starfield.js\`
- **Glyphs**: \`https://data.storypath.studio/glyphs/{fontstack}/{range}.pbf\` (referenced in style.json)
- **PMTiles data**: All data sources use external URLs (referenced in style.json)

## Usage

### Option 1: Use the provided HTML file

Simply open \`index.html\` in a browser or serve it with a local web server:

\`\`\`bash
# Using Python
python3 -m http.server 8080

# Using Node
npx serve -p 8080
\`\`\`

Then open: \`http://localhost:8080/index.html\`

### Option 2: Integrate into your project

1. Copy \`style.json\`, \`map.js\`, \`style.css\`, and \`sprites/\` directory to your project
2. Update the \`style\` path in \`map.js\` if needed (default: \`./style.json\`)
3. Ensure sprite files are accessible at the path specified in \`style.json\` (default: \`./sprites/basemap\`)
4. Include \`style.css\` in your HTML/framework:
   - **For frameworks like Astro**: \`<link rel="stylesheet" href="/maps/dark-blue/style.css" />\`
   - **For static HTML**: \`<link href="./style.css" rel="stylesheet" />\`
   - Adapt the CSS for your layout (see "Styling" section below)
5. Load \`map.js\` in your HTML/framework:
   - **For frameworks like Astro**: Use \`MapScriptLoader\` or similar to load \`map.js\` dynamically
   - **For static HTML**: Include \`<script src="./map.js"></script>\` after loading dependencies

## Using map.js with Frameworks

### Astro Example

\`map.js\` is designed to work with frameworks like Astro that use \`MapScriptLoader\`:

\`\`\`astro
---
// MapContent.astro
---

<div id="starfield-container"></div>
<div id="globe-glow"></div>
<div id="map-container"></div>

<script>
  import MapScriptLoader from './MapScriptLoader.astro';
</script>

<MapScriptLoader scriptPath="/maps/dark-blue/map.js" />
\`\`\`

### Static HTML Example

For static HTML, simply include the script after dependencies:

\`\`\`html
<script src="https://unpkg.com/maplibre-gl@5.13.0/dist/maplibre-gl.js"></script>
<script src="https://unpkg.com/pmtiles@4.3.0/dist/pmtiles.js"></script>
<script src="https://data.storypath.studio/js/maplibre-gl-starfield.js"></script>
<script src="./map.js"></script>
\`\`\`

## Essential Map Initialization Code

The \`map.js\` file contains all the essential initialization code. If you need to customize it, the key parts are:

\`\`\`javascript
// 1. Register PMTiles protocol (REQUIRED)
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

// 2. Initialize map
const map = new maplibregl.Map({
  container: "map-container",  // Your container ID
  style: "./style.json",        // Path to style.json
  center: [-98.0, 39.0],        // Initial view (continental US)
  zoom: 3.5,
  minZoom: 2,                   // For globe projection
  maxZoom: 22
});

// 3. Setup globe projection and starfield (REQUIRED for exact appearance)
const starryBg = new MapLibreStarryBackground();
map.on('style.load', () => {
  map.setProjection({ type: 'globe' });
  starryBg.attachToMap(map, "starfield-container", "globe-glow");
});
\`\`\`

## HTML Structure

If using globe projection with starfield, your HTML needs these containers:

\`\`\`html
<div id="starfield-container"></div>
<div id="globe-glow"></div>
<div id="map-container"></div>
\`\`\`

## Styling

### Using style.css

The \`style.css\` file contains base styles that assume a full viewport. For frameworks like Astro with headers, adapt the styles:

**For Astro with header (e.g., 70px):**

\`\`\`css
/* Override in your component or add to style.css */
.map-container {
  height: calc(100vh - 70px);  /* Account for header */
  position: relative;
}

/* Or use a wrapper approach */
.map-wrapper {
  position: relative;
  height: calc(100vh - 70px);
  width: 100%;
}

#map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
\`\`\`

The \`style.css\` file includes comments with examples for adapting to different layouts.

## Customization

- **Initial view**: Change \`center\` and \`zoom\` in map initialization
- **Projection**: Change \`type: 'globe'\` to \`type: 'mercator'\` for flat map (and remove starfield)
- **Container ID**: Change \`map-container\` to match your HTML element ID
- **Sprite path**: Update \`sprite\` property in \`style.json\` if you move sprite files

## Notes

- The sprite path in \`style.json\` is set to \`./sprites/basemap\` (relative path)
- All glyphs, starfield script, and PMTiles data are loaded from CDN
- The map uses globe projection by default with starfield background
- Minimum zoom is set to 2 for globe projection (can be 0 for mercator)
`;

  const readmePath = join(outputDir, "README.md");
  writeFileSync(readmePath, readmeContent, "utf8");
  console.log(`   ✓ Created ${readmePath}`);

  console.log(`\n✅ Basemap bundle exported successfully!`);
  console.log(`   Location: ${outputDir}`);
  console.log(`\n   Files created:`);
  console.log(`   - style.json`);
  console.log(`   - map.js`);
  console.log(`   - style.css`);
  console.log(`   - sprites/ (4 files)`);
  console.log(`   - index.html`);
  console.log(`   - README.md`);
}

// Main execution
const basemapName = process.argv[2] || "dark-blue";

if (!basemapName) {
  console.error("Usage: npx tsx scripts/export-basemap-bundle.ts <basemap-name>");
  console.error("Example: npx tsx scripts/export-basemap-bundle.ts dark-blue");
  process.exit(1);
}

exportBasemapBundle(basemapName);
