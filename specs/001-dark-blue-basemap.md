# Build Spec 001: Dark Blue Basemap - Initial Setup

## Objective
Get the `dark-blue` basemap working with shared assets and serving infrastructure.

## Current State
- Style file exists at: `basemaps/styles/dark-blue.json`
- Shared assets located at:
  - Glyphs: `shared/assets/glyphs/Noto Sans Regular/`
  - Sprites: `shared/assets/sprites/basemap.{json,png}` (and @2x variants)
- PMTiles sources are on Cloudflare CDN (already configured in style)
- Basic serving infrastructure exists: `serve.js`

## Target Structure
```
/basemaps
  /dark-blue
    style.json      # Moved from basemaps/styles/dark-blue.json
    preview.html    # New preview page for this basemap
    docs.md         # Documentation (optional, can be added later)

/shared
  /assets
    /glyphs/        # Shared across all basemaps
    /sprites/       # Shared across all basemaps
```

## Build Steps

### 1. Create Directory Structure
- Create `/basemaps/dark-blue/` directory

### 2. Move and Update Style File
- Copy `basemaps/styles/dark-blue.json` to `basemaps/dark-blue/style.json`
- Update the style.json to reference shared assets:
  - **Glyphs**: Update `glyphs` property (if present) to: `"glyphs": "/shared/assets/glyphs/{fontstack}/{range}.pbf"`
  - **Sprites**: Update `sprite` property (if present) to: `"sprite": "/shared/assets/sprites/basemap"`
  - Note: Current `dark-blue.json` may not have glyphs/sprite properties - add them if needed for future label/icon support

### 3. Create Preview HTML
Create `basemaps/dark-blue/preview.html` with:
- MapLibre GL JS (v3.6.0) from CDN
- PMTiles library (v4.3.0) from CDN
- Map initialization pointing to `style.json`
- Basic map controls (navigation)
- Center/zoom appropriate for the basemap
- PMTiles protocol registration before map creation

### 4. Update Serve Script (if needed)
- Ensure `serve.js` can serve files from:
  - `/basemaps/*` (for style.json and preview.html)
  - `/shared/*` (for assets)
- Current `serve.js` serves from `public/` - may need to update to serve from project root or configure symlinks

### 5. Asset Path Configuration
- Verify glyph paths work: `/shared/assets/glyphs/Noto Sans Regular/{range}.pbf`
- Verify sprite paths work: `/shared/assets/sprites/basemap.json` and `/shared/assets/sprites/basemap.png`
- Ensure CORS headers if serving from different origins

## Technical Details

### Style JSON Updates Required
The style.json needs these properties at the root level (if not already present):
```json
{
  "version": 8,
  "name": "Dark Blue Basemap",
  "glyphs": "/shared/assets/glyphs/{fontstack}/{range}.pbf",
  "sprite": "/shared/assets/sprites/basemap",
  "sources": { ... },
  "layers": [ ... ]
}
```

### Preview HTML Template
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Dark Blue Basemap Preview</title>
  <link href="https://unpkg.com/maplibre-gl@3.6.0/dist/maplibre-gl.css" rel="stylesheet" />
  <style>
    html, body { height: 100%; margin: 0; }
    #map { height: 100vh; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/maplibre-gl@3.6.0/dist/maplibre-gl.js"></script>
  <script src="https://unpkg.com/pmtiles@4.3.0/dist/pmtiles.js"></script>
  <script>
    // Register PMTiles protocol
    const protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    // Initialize map
    const map = new maplibregl.Map({
      container: "map",
      style: "./style.json",
      center: [-105.7821, 39.5501], // Adjust as needed
      zoom: 8,
      hash: false
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
  </script>
</body>
</html>
```

### Serving Considerations
- If `serve.js` only serves from `public/`, options:
  1. Update `serve.js` to serve from project root with path routing
  2. Create symlinks in `public/` pointing to `basemaps/` and `shared/`
  3. Copy files to `public/` during build process

## Success Criteria
- [ ] `basemaps/dark-blue/style.json` exists and references shared assets correctly
- [ ] `basemaps/dark-blue/preview.html` loads and displays the map
- [ ] Map renders with all layers visible
- [ ] Glyphs load correctly (if labels are present)
- [ ] Sprites load correctly (if icons are present)
- [ ] PMTiles sources load from Cloudflare CDN
- [ ] No console errors in browser

## Dependencies
- MapLibre GL JS v3.6.0
- PMTiles library v4.3.0
- Node.js (for serve.js)
- Shared assets in `/shared/assets/`

## Notes
- PMTiles sources are already configured for Cloudflare CDN - no changes needed
- This spec focuses on local development/serving setup
- Production deployment may require different asset paths (CDN URLs)

