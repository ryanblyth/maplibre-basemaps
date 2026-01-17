# Exporting Basemaps

This guide explains how to export a basemap bundle for use in other codebases (Astro, static sites, or other frameworks).

## Overview

The bundle export feature creates a self-contained package with all the essential files needed to render a basemap in another project. The bundle includes:

- **style.json** - MapLibre style definition (sprite path updated to relative)
- **map.js** - Map initialization script (for frameworks that load scripts dynamically)
- **style.css** - Map container and starfield styles (adaptable for different layouts)
- **sprites/** - Sprite files (PNG + JSON, regular + @2x)
- **index.html** - Standalone HTML example
- **README.md** - Usage instructions

External dependencies (glyphs, starfield script, PMTiles data) are loaded from CDN, so only the bundle files need to be included in your project.

## Exporting a Bundle

### Using npm script (recommended)

```bash
npm run export:bundle
```

This exports the `dark-blue` basemap by default.

### Using the script directly

```bash
npx tsx scripts/export-basemap-bundle.ts <basemap-name>
```

Example:
```bash
npx tsx scripts/export-basemap-bundle.ts dark-blue
```

### Output Location

The bundle is created at:
```
basemaps/<basemap-name>/map-bundle/
```

For example: `basemaps/dark-blue/map-bundle/`

## What Gets Exported

### Files Included

1. **style.json**
   - Complete MapLibre style definition
   - Sprite path updated from `http://localhost:8080/...` to `./sprites/basemap` (relative path)
   - Glyphs path already points to CDN: `https://data.storypath.studio/glyphs/...`
   - All PMTiles sources use external CDN URLs

2. **map.js**
   - Essential map initialization code
   - PMTiles protocol registration
   - Globe projection setup
   - Starfield attachment
   - Navigation and attribution controls
   - Configuration constants (projection, minZoom) with window override support

3. **style.css**
   - Map container styles (full viewport by default)
   - Starfield container styles
   - Globe glow container styles
   - Comments showing how to adapt for different layouts (e.g., Astro with header)

4. **sprites/** directory
   - `basemap.json` - Sprite metadata
   - `basemap.png` - Sprite image (1x)
   - `basemap@2x.json` - Sprite metadata (retina)
   - `basemap@2x.png` - Sprite image (retina)

5. **index.html**
   - Standalone HTML example
   - References `map.js` and `style.css`
   - Includes all CDN dependencies
   - Can be opened directly in a browser or served locally

6. **README.md**
   - Detailed usage instructions
   - Framework integration examples
   - Customization guide

### External Dependencies (CDN)

These are loaded from CDN and do not need to be bundled:

- **MapLibre GL JS**: `https://unpkg.com/maplibre-gl@5.13.0/dist/maplibre-gl.js`
- **MapLibre GL CSS**: `https://unpkg.com/maplibre-gl@5.13.0/dist/maplibre-gl.css`
- **PMTiles library**: `https://unpkg.com/pmtiles@4.3.0/dist/pmtiles.js`
- **Starfield script**: `https://data.storypath.studio/js/maplibre-gl-starfield.js`
- **Glyphs**: `https://data.storypath.studio/glyphs/{fontstack}/{range}.pbf` (referenced in style.json)
- **PMTiles data**: All data sources use external URLs (referenced in style.json)

## Using the Bundle

### Option 1: Standalone HTML

Simply open `index.html` in a browser or serve it with a local web server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node
npx serve -p 8080
```

Then open: `http://localhost:8080/index.html`

### Option 2: Astro Framework

1. Copy the bundle files to your Astro project (e.g., `public/maps/dark-blue/`)

2. Create an Astro component:

```astro
---
// MapContent.astro
---

<div id="starfield-container"></div>
<div id="globe-glow"></div>
<div id="map-container"></div>

<link rel="stylesheet" href="/maps/dark-blue/style.css" />
<script>
  import MapScriptLoader from './MapScriptLoader.astro';
</script>

<MapScriptLoader scriptPath="/maps/dark-blue/map.js" />
```

3. Adapt the CSS for your layout (if you have a header):

```css
/* In your component or global CSS */
.map-container {
  height: calc(100vh - 70px);  /* Account for header */
  position: relative;
}
```

### Option 3: Static HTML Site

1. Copy `style.json`, `map.js`, `style.css`, and `sprites/` to your project

2. Include in your HTML:

```html
<!doctype html>
<html>
<head>
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
  <script src="./map.js"></script>
</body>
</html>
```

### Option 4: Other Frameworks

The bundle works with any framework that can:
- Serve static files (style.json, sprites, CSS, JS)
- Load external scripts from CDN
- Include HTML elements for map containers

Key requirements:
- Load MapLibre GL JS, PMTiles, and starfield script before `map.js`
- Include the three container divs (starfield-container, globe-glow, map-container)
- Reference `style.css` or adapt the styles for your layout

## Customization

### Changing Initial View

Edit `map.js` and update the map initialization:

```javascript
const map = new maplibregl.Map({
  container: "map-container",
  style: "./style.json",
  center: [-98.0, 39.0],  // Change to your desired center
  zoom: 3.5,              // Change to your desired zoom
  // ...
});
```

### Changing Projection

To use mercator (flat) instead of globe:

1. Edit `map.js` and change:
   ```javascript
   const DEFAULT_PROJECTION = "mercator";
   ```

2. Or set before the script loads:
   ```javascript
   window.mapProjection = "mercator";
   ```

3. Remove starfield containers from HTML (not needed for mercator)

### Adapting CSS for Different Layouts

The `style.css` file includes comments showing how to adapt for different layouts. For example, with a header:

```css
.map-container {
  height: calc(100vh - 70px);  /* Account for header */
  position: relative;
}
```

### Changing Container IDs

If you need different container IDs, update both:
1. The HTML element IDs
2. The IDs in `map.js` (map-container, starfield-container, globe-glow)

## File Structure in Your Project

Recommended structure:

```
your-project/
├── maps/
│   └── dark-blue/
│       ├── style.json
│       ├── map.js
│       ├── style.css
│       └── sprites/
│           ├── basemap.json
│           ├── basemap.png
│           ├── basemap@2x.json
│           └── basemap@2x.png
└── your-html-or-component-files
```

## Troubleshooting

### Map not rendering

1. **Check console errors** - Look for missing files or CDN issues
2. **Verify sprite path** - Ensure `style.json` sprite path matches your file structure
3. **Check container IDs** - Ensure HTML element IDs match those in `map.js`
4. **Verify dependencies** - Ensure MapLibre, PMTiles, and starfield scripts load before `map.js`

### Sprites not showing

1. **Check sprite path in style.json** - Should be relative to `style.json` location
2. **Verify sprite files exist** - Check that all 4 sprite files are in the `sprites/` directory
3. **Check file permissions** - Ensure sprite files are readable

### Starfield not showing

1. **Verify starfield script loads** - Check that `maplibre-gl-starfield.js` loads from CDN
2. **Check container divs** - Ensure `starfield-container` and `globe-glow` divs exist
3. **Verify globe projection** - Starfield only works with globe projection

### Styles not applying

1. **Check CSS file path** - Ensure `style.css` is loaded correctly
2. **Verify container dimensions** - Map container needs explicit height
3. **Check z-index** - Ensure proper stacking order (starfield: 1, glow: 2, map: 3)

## When to Re-export

Re-export the bundle when:
- You've made changes to the basemap style (run `npm run build:styles` first)
- You've updated sprite files
- You want to update the bundle with latest changes

The bundle is a snapshot at export time. If you make changes to the basemap, re-export to get the updated files.

## Notes

- The `map-bundle` directory is temporary - delete it after copying to your project
- The bundle uses relative paths for local files and CDN URLs for external dependencies
- All PMTiles data sources are external and don't need to be bundled
- Glyphs are loaded on-demand from CDN as needed by the map
