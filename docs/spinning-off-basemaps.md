# Spinning Off Basemaps

This guide explains how to create a fully independent, standalone project from an existing basemap for use in another repository.

## Overview

The spinoff feature creates a complete, self-contained development project that can be moved to another repository. Unlike the export bundle (which provides minimal runtime files), a spinoff includes:

- **Full TypeScript source files** - Complete theme.ts, style definitions, and all utilities
- **Build scripts** - Tools to rebuild styles and shields from source
- **Development server** - Local HTTP server for testing
- **All dependencies** - Complete package.json with all necessary packages
- **Documentation** - Comprehensive guides for customization and deployment
- **No parent dependencies** - All shared utilities are copied locally

**When to use spinoff:**
- Creating a custom map for another repository
- Need to add custom data layers on top of the basemap
- Want full development environment with build tools
- Plan to heavily customize the map style (colors, layers, features)
- Need ongoing development capabilities

**When NOT to use spinoff:**
- Just need a static map display → Use `export:bundle` instead
- No customization needed → Use `export:bundle` instead
- Want minimal bundle size → Use `export:bundle` instead

## Quick Start

```bash
npm run spinoff -- <source-basemap> <spinoff-name>
```

Example:
```bash
npm run spinoff -- dark-gray my-custom-map
```

**Available source basemaps:**
- `dark-blue` - Dark blue ocean theme
- `dark-gray` - Dark gray neutral theme
- `light-gray` - Light gray neutral theme

**Naming conventions:**
- Use kebab-case (lowercase with hyphens): `my-custom-map`, `city-explorer`, `route-planner`
- Avoid spaces, underscores, or special characters

## Comparison with Other Workflows

| Feature | create:basemap | export:bundle | spinoff |
|---------|---------------|---------------|---------|
| **Location** | `basemaps/` in this repo | `map-bundle/` subfolder | `spinoffs/` folder |
| **Purpose** | New basemap in parent repo | Static deployment files | Standalone project |
| **Source files** | Yes (in parent repo) | No | Yes (copied locally) |
| **Build tools** | Uses parent scripts | No | Includes own scripts |
| **Dependencies** | Shared with parent | None needed | Own package.json |
| **Can move to another repo** | No (part of parent) | Yes (runtime only) | Yes (full project) |
| **Development environment** | Parent repo tools | No | Complete standalone |

## What's Created

When you run `npm run spinoff -- dark-gray my-custom-map`, the script creates:

```
spinoffs/my-custom-map/
├── package.json              # Full dependencies, npm scripts
├── tsconfig.json             # TypeScript configuration
├── .gitignore                # Ignore node_modules, generated files
├── serve.js                  # Development HTTP server
│
├── styles/
│   ├── myCustomMapStyle.ts   # Main style definition (PascalCase)
│   └── theme.ts              # Theme configuration (colors, widths)
│
├── scripts/
│   ├── build-styles.ts       # Rebuilds style.json from TypeScript
│   ├── build-shields.ts      # Generates custom highway shields
│   └── format-json.ts        # Formats JSON output
│
├── shared/
│   └── styles/               # All shared utilities (copied locally)
│       ├── theme.ts
│       ├── baseStyle.ts
│       └── layers/           # All layer factory functions
│
├── sprites/
│   ├── basemap.json          # Sprite metadata (1x)
│   ├── basemap.png           # Sprite atlas (1x)
│   ├── basemap@2x.json       # Sprite metadata (2x retina)
│   ├── basemap@2x.png        # Sprite atlas (2x retina)
│   └── shields/              # Shield SVG templates
│       ├── shield-interstate-custom.svg
│       ├── shield-ushighway-custom.svg
│       └── shield-state-custom.svg
│
├── docs/
│   ├── README.md             # Overview and quick start
│   ├── customizing.md        # How to customize the map
│   ├── building.md           # Build system documentation
│   └── deploying.md          # Deployment guide
│
├── preview.html              # Standalone HTML preview
├── map.js                    # MapLibre initialization script
├── style.json                # Generated MapLibre style (created by build:styles)
├── style.generated.json      # Formatted style (created by build:styles)
└── map-config.js             # Map configuration (created by build:styles)
```

## Step-by-Step Workflow

### 1. Create the Spinoff

From the parent repository:

```bash
npm run spinoff -- dark-gray my-custom-map
```

This creates `spinoffs/my-custom-map/` with all necessary files.

### 2. Install Dependencies

Navigate to the spinoff and install packages:

```bash
cd spinoffs/my-custom-map
npm install
```

### 3. Build Styles

Generate the MapLibre style JSON from TypeScript source:

```bash
npm run build:styles
```

This creates:
- `style.json` - MapLibre style definition
- `style.generated.json` - Formatted version
- `map-config.js` - Map projection and initial view configuration

### 4. Test Locally

Start the development server:

```bash
npm run serve
```

Open http://localhost:8080/preview.html to view your map.

**Development tip:** Use `npm run dev` to rebuild styles and start the server in one command.

### 5. Customize (Optional)

Before moving to another repository, you can customize:

**Edit colors and styles:**
```bash
# Edit styles/theme.ts
npm run build:styles
npm run serve
```

**Customize highway shields:**
```bash
# Edit sprites/shields/*.svg
npm run build:shields
npm run serve
```

See the [Customization](#customization) section below for details.

### 6. Move to Target Repository

Once satisfied with your customizations:

```bash
# From outside the spinoff directory
cp -r spinoffs/my-custom-map /path/to/target-repo/
cd /path/to/target-repo/my-custom-map
npm install
npm run build:styles
npm run serve
```

### 7. Clean Up

After successfully moving the spinoff to another repository:

```bash
# From the parent repo
rm -rf spinoffs/my-custom-map
```

The `spinoffs/` directory is in `.gitignore`, so spinoffs are never committed to the parent repo.

## Assets Strategy

The spinoff uses a hybrid approach for assets:

### Local Assets (Bundled)

**Sprites** - Included in the spinoff
- POI icons (hospital, school, park, etc.)
- Custom highway shields (interstate, US highway, state routes)
- Located in `sprites/` directory
- Generated PNG+JSON atlases at 1x and 2x resolutions

### CDN Assets (External)

**Glyphs** (fonts) - Loaded from CDN
```
https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf
```

**Starfield script** - Loaded from CDN
```
https://unpkg.com/@maplibre/maplibre-gl-starfield@0.1.1/dist/index.js
```

**PMTiles data** (vector tiles) - Loaded from CDN
```
https://data.source.coop/cholmes/overture/overture-2024-11-13.1.pmtiles
```

**Why this approach?**
- Sprites are small and customizable → bundle locally
- Glyphs are large and rarely change → use CDN
- Map data is very large (50+ GB) → use CDN
- Starfield is a small external library → use CDN

## Build Commands

The spinoff includes these npm scripts:

### `npm run build:styles`

Generates MapLibre style JSON from TypeScript source files.

**Input:**
- `styles/myCustomMapStyle.ts` - Main style definition
- `styles/theme.ts` - Theme configuration
- `shared/styles/` - Layer factory functions

**Output:**
- `style.json` - MapLibre style (with relative sprite paths)
- `style.generated.json` - Formatted version for readability
- `map-config.js` - Map projection, initial zoom, center, starfield config

**When to run:**
- After editing theme colors in `styles/theme.ts`
- After modifying layer visibility or order
- After changing map projection or initial view

### `npm run build:shields`

Generates custom highway shield sprites from SVG templates.

**Input:**
- `sprites/shields/*.svg` - Shield templates with `{{text}}` placeholders
- `scripts/build-shields.ts` - Shield generation logic

**Output:**
- Updates `sprites/basemap.png` and `sprites/basemap.json` with shield images

**When to run:**
- After editing shield SVG templates
- After changing shield colors or styles
- After modifying the list of shields to generate

### `npm run serve`

Starts a local development server on port 8080.

**Features:**
- Serves all project files
- Handles CORS headers for MapLibre
- Supports HTTP Range requests for PMTiles
- Auto-refreshes on file changes (manual browser refresh needed)

**Port conflicts:** If port 8080 is in use, change the port:
```bash
PORT=8081 npm run serve
```

### `npm run dev`

Convenience command that runs both builds and starts the server:
```bash
npm run build:styles && npm run serve
```

## Customization

### Editing Colors and Styles

**File:** `styles/theme.ts`

This file defines all visual properties:

```typescript
export const theme: BasemapTheme = {
  colors: {
    background: "#1a1a2e",
    land: "#16213e",
    water: "#0f3460",
    // ... more colors
  },
  widths: {
    road: {
      motorway: [1, 3, 4, 5, 6, 8, 10, 12],
      trunk: [1, 2.5, 3.5, 4.5, 5.5, 7, 9, 11],
      // ... more road widths
    },
    // ... more widths
  },
  opacities: {
    water: 1,
    land: 1,
    // ... more opacities
  }
};
```

**After editing theme.ts:**
```bash
npm run build:styles
npm run serve
# Refresh browser to see changes
```

### Adding Custom Data Layers

You can add your own data layers on top of the basemap.

**Example:** Add GeoJSON points of interest

1. **Add data file:** `data/my-points.geojson`

2. **Edit `styles/myCustomMapStyle.ts`:**

```typescript
import { createBaseStyle } from "../shared/styles/baseStyle";
import { theme } from "./theme";

// ... existing imports ...

const style = createBaseStyle({
  theme,
  pmtilesUrl: "https://data.source.coop/cholmes/overture/overture-2024-11-13.1.pmtiles",
  // ... other config
});

// Add custom source
style.sources["my-data"] = {
  type: "geojson",
  data: "./data/my-points.geojson"
};

// Add custom layer
style.layers.push({
  id: "my-points",
  type: "circle",
  source: "my-data",
  paint: {
    "circle-radius": 6,
    "circle-color": "#ff0000"
  }
});

export default style;
```

3. **Rebuild and test:**
```bash
npm run build:styles
npm run serve
```

### Customizing Highway Shields

**Files:** `sprites/shields/*.svg`

These SVG templates use `{{text}}` placeholders that get replaced with route numbers.

**Example:** Change interstate shield colors

Edit `sprites/shields/shield-interstate-custom.svg`:

```xml
<!-- Change fill color -->
<rect x="2" y="2" width="56" height="56" rx="4" ry="4" 
      fill="#ff0000" stroke="#ffffff" stroke-width="2"/>
```

**After editing:**
```bash
npm run build:shields
npm run serve
# Refresh browser to see changes
```

### Modifying Layer Visibility

**File:** `styles/myCustomMapStyle.ts`

You can control which layers appear at which zoom levels.

**Example:** Hide minor roads until higher zoom

```typescript
import { roadLayers } from "../shared/styles/layers/roads";

// Create road layers with custom config
const roads = roadLayers({
  theme,
  source: "overture",
  minZoom: {
    motorway: 4,
    trunk: 5,
    primary: 6,
    secondary: 8,
    tertiary: 10,
    minor: 13,  // Changed from 11 to 13
    service: 15
  }
});
```

### Place labels (cities, towns)

Spinoffs use the same place label logic as the parent: **city**, **town**, **village**, **hamlet**, **locality**, and **suburb** at zoom 8+ (US), with name and village-rank rules. To change which place types or ranks appear, edit **`shared/styles/layers/labels/place.ts`** in the spinoff (e.g. the `class` match or village rank threshold), then run `npm run build:styles`.

## Moving to Another Repository

### Complete Workflow

1. **Create and customize spinoff** (in parent repo):
```bash
cd /path/to/maplibre-basemaps
npm run spinoff -- dark-gray my-custom-map
cd spinoffs/my-custom-map
npm install
npm run build:styles

# Customize if needed
# Edit styles/theme.ts
npm run build:styles
npm run serve
# Test at http://localhost:8080/preview.html
```

2. **Copy to target repository:**
```bash
# From parent repo root
cp -r spinoffs/my-custom-map /path/to/target-repo/
```

3. **Initialize in target repo:**
```bash
cd /path/to/target-repo/my-custom-map
npm install
npm run build:styles
npm run serve
# Test at http://localhost:8080/preview.html
```

4. **Commit to target repo:**
```bash
git add .
git commit -m "Add custom basemap from maplibre-basemaps spinoff"
git push
```

5. **Clean up parent repo:**
```bash
cd /path/to/maplibre-basemaps
rm -rf spinoffs/my-custom-map
```

### Using in Another Framework

The spinoff works with any framework that can serve static files.

**Example: Using in Astro**

1. **Copy spinoff to Astro project:**
```bash
cp -r spinoffs/my-custom-map /path/to/astro-project/src/maps/
```

2. **Create Astro component** (`src/components/Map.astro`):
```astro
---
// Import the style JSON
import mapStyle from '../maps/my-custom-map/style.json';
---

<div id="map"></div>

<script>
  import maplibregl from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  
  const map = new maplibregl.Map({
    container: 'map',
    style: '/maps/my-custom-map/style.json',
    center: [-98, 39],
    zoom: 4
  });
</script>

<style>
  #map {
    width: 100%;
    height: 600px;
  }
</style>
```

3. **Ensure files are served:**
   - Astro's `public/` directory serves static files
   - Or configure Vite to include the maps directory

**Example: Using in React**

```jsx
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import mapStyle from './my-custom-map/style.json';

export default function MapComponent() {
  const mapContainer = useRef(null);
  
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [-98, 39],
      zoom: 4
    });
    
    return () => map.remove();
  }, []);
  
  return <div ref={mapContainer} style={{ width: '100%', height: '600px' }} />;
}
```

## Troubleshooting

### Port 8080 Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::8080`

**Solution 1:** Stop other processes using port 8080
```bash
# Find process using port 8080
lsof -ti:8080

# Kill the process
kill $(lsof -ti:8080)
```

**Solution 2:** Use a different port
```bash
PORT=8081 npm run serve
```

**Solution 3:** Edit `serve.js` to use a different default port:
```javascript
const PORT = process.env.PORT || 8081;  // Changed from 8080
```

### Sprites Not Loading

**Symptoms:**
- Console errors: `Failed to load resource: 404 basemaps/.../sprites/basemap.json`
- Missing POI icons (hospitals, parks, etc.)
- Missing highway shields

**Common causes:**

1. **Incorrect sprite path in style.json**
   - Open `style.json` and check the `sprite` field
   - Should be: `"http://localhost:8080/sprites/basemap"`
   - NOT: `"basemaps/my-custom-map/sprites/basemap"`

**Fix:** Regenerate the spinoff (this was fixed in the spinoff script)

2. **Missing sprite files**
   - Check that `sprites/` directory exists
   - Should contain: `basemap.json`, `basemap.png`, `basemap@2x.json`, `basemap@2x.png`

**Fix:** Copy sprite files from the source basemap or regenerate spinoff

3. **Corrupted sprite JSON**
   - Open `sprites/basemap.json` and check if it's empty or malformed

**Fix:** Regenerate the spinoff (this was fixed in the spinoff script)

### Import Path Errors

**Error:** `Cannot find module '/Users/.../shared/styles/layers/index.js'`

**Cause:** Import paths are still pointing to parent repo structure

**Fix:** Check that all imports in `styles/myCustomMapStyle.ts` use relative paths:
```typescript
// Good (relative to spinoff)
import { roadLayers } from "../shared/styles/layers/roads";

// Bad (points to parent repo)
import { roadLayers } from "../../../shared/styles/layers/roads";
```

If you see this error in a freshly created spinoff, the spinoff script may need to be fixed.

### Build Script Errors

**Error:** `ReferenceError: __dirname is not defined`

**Cause:** ES modules don't have `__dirname` by default

**Fix:** The spinoff's `build-shields.ts` should include this at the top:
```typescript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

This should already be included if you used the spinoff script.

### Map Not Displaying

**Symptoms:** White screen, no map visible

**Debug steps:**

1. **Check browser console for errors**
   - Look for 404 errors (missing files)
   - Look for style errors (malformed JSON)

2. **Verify style.json is valid**
   ```bash
   # Check if file exists and is not empty
   cat style.json | head
   ```

3. **Verify dev server is running**
   ```bash
   curl http://localhost:8080/style.json
   ```

4. **Check map initialization** in `map.js`:
   - Verify container ID matches HTML
   - Verify style path is correct
   - Check initial center and zoom values

### Style Changes Not Appearing

**Cause:** Browser cache or forgot to rebuild

**Solution:**
```bash
# Rebuild styles
npm run build:styles

# Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
```

## Next Steps

After successfully creating and testing your spinoff:

1. **Customize the theme** - Edit colors in `styles/theme.ts`
2. **Add custom data** - Include your own GeoJSON layers
3. **Adjust layer visibility** - Control what shows at each zoom level
4. **Customize shields** - Edit SVG templates for highway shields
5. **Deploy** - See `docs/deploying.md` in the spinoff for deployment options

## Related Documentation

- [Exporting Basemaps](./exporting-basemaps.md) - For static deployment without build tools
- [Creating a New Basemap](./creating-basemap.md) - For creating basemaps in the parent repo
- [Customizing Themes](./customizing-themes.md) - Detailed guide to theme customization

## Support

If you encounter issues not covered in this guide:

1. Check the spinoff's `docs/` directory for additional documentation
2. Review the parent repo's documentation for concepts and patterns
3. Check browser console for specific error messages
4. Verify all build steps completed successfully
