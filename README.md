# MapLibre Basemaps

A collection of MapLibre GL basemap styles using PMTiles and shared assets. Each basemap is self-contained with its own style and preview page, while sharing common assets like glyphs and sprites.

## Project Structure

```
/basemaps
  /dark-blue/
    style.json      # Basemap style definition
    preview.html    # Preview page for this basemap
    docs.md         # Documentation (optional)

/shared
  /assets
    /glyphs/        # Shared font glyphs (PBF files)
      /Noto Sans Regular/
    /sprites/       # Shared sprite atlases
      basemap.json
      basemap.png
      basemap@2x.json
      basemap@2x.png

/tools              # Build tools for sprites and icons
/specs              # Build specifications
/assets-src         # Source assets (icons, etc.) used to build shared assets
  /icons            # SVG source files for sprites
```

## Quick Start

1. **Start the development server:**
   ```bash
   node serve.js
   ```
   The server runs on `http://localhost:8080` and serves files from the project root.

2. **View a basemap:**
   - Dark Blue: http://localhost:8080/basemaps/dark-blue/preview.html
   - Dark Gray: http://localhost:8080/basemaps/dark-gray/preview.html

## Adding a New Basemap

Use the scaffolding script to create a new basemap from an existing template:

```bash
npm run create:basemap -- <basemap-name>
```

For example:

```bash
npm run create:basemap -- ocean-light
```

This will:
1. Copy the `dark-blue` template to `basemaps/ocean-light/`
2. Rename all files and transform variable names
3. Register the new basemap in the build system

After scaffolding, customize the theme in `basemaps/<name>/styles/theme.ts` and rebuild:

```bash
npm run build:styles
```

See `docs/creating-basemap.md` for detailed documentation.

## PMTiles Sources

This project uses PMTiles hosted on Cloudflare CDN. PMTiles sources are configured in each style's `sources` section:

```json
{
  "sources": {
    "openmaptiles": {
      "type": "vector",
      "url": "pmtiles://https://data.storypath.studio/pmtiles/colorado.pmtiles"
    }
  }
}
```

## Shared Assets

### Glyphs
Font glyphs are stored in `/shared/assets/glyphs/` and shared across all basemaps. Each font family has its own directory with PBF files for character ranges.

- **Local development**: Files are served from `shared/assets/glyphs/` via the development server
- **Production**: Glyphs are hosted on CDN at `https://data.storypath.studio/glyphs/`
- Local files are the source of truth and required for build scripts

### Sprites
Icon sprites are stored in `/shared/assets/sprites/` and shared across all basemaps. The sprite atlas includes icons for POIs (airports, restaurants, hospitals, etc.).

- **Local development**: Files are served from `shared/assets/sprites/` via the development server
- **Production**: Sprites can be uploaded to CDN for production deployments
- Local files are used during development and as source files for builds

To rebuild sprites from SVG icons:
```bash
make sprite
```

Or manually:
```bash
./tools/fetch-icons.sh    # Download SVG icons to assets-src/icons/
./tools/make-sprites.sh   # Build sprite atlas to shared/assets/sprites/
```

See `docs/DOCKER.md` for Docker-based sprite building instructions.

### Starfield Script
The starfield background script for globe projection is located in `/shared/js/maplibre-gl-starfield.js`.

- **Local development**: File is served from `shared/js/` via the development server
- **Production**: Script is hosted on CDN at `https://data.storypath.studio/js/maplibre-gl-starfield.js`
- Local file is the source of truth and required for development

## Asset Hosting

This project uses a **dual-hosting approach** for shared assets:

- **Local files** (`shared/assets/` and `shared/js/`) are used for:
  - Local development and testing
  - Build scripts and sprite generation
  - Source of truth for version control
  - Fallback if CDN is unavailable

- **CDN URLs** are used for:
  - Production deployments
  - Better performance and caching
  - Reduced bundle size
  - Shared caching across sites

The generated `style.json` files use CDN URLs for production, while the development server (`serve.js`) serves local files from `shared/` directories. Both serve the same purpose but in different contexts - local files are essential for development and build processes, while CDN URLs optimize production deployments.

## Development

### Building Styles

Styles are generated from TypeScript source files using a custom JSON formatter:

```bash
npm run build:styles
```

This command:
- Generates `style.generated.json` from TypeScript style definitions
- Applies custom formatting rules (see `docs/style-json-formatting.md`)
- Copies the formatted output to `style.json` for compatibility

**Important:** Always run `npm run build:styles` after modifying style source files. The custom formatter ensures consistent indentation and compact formatting for:
- Simple arrays and objects (one line)
- Complex expressions (let, case, interpolate) with proper nesting
- Nested expressions in arrays (all, any, case, etc.)
- Match expressions (always compacted to one line)

### Server
The `serve.js` server handles:
- Serving basemap files from `/basemaps/*`
- Serving shared assets from `/shared/*`
- CORS headers for asset loading
- HTTP Range requests for PMTiles

### Style Development
- Edit TypeScript style source files in `/basemaps/*/styles/`
- Run `npm run build:styles` to regenerate `style.json`
- Refresh the preview page to see changes
- Check browser console for errors
- See `docs/MAP_ELEMENTS.md` for MapLibre style reference
- See `docs/style-json-formatting.md` for formatting rules

### State Label Handling

State labels are handled differently for US states vs. world states due to PMTiles source availability:

**US States:**
- **Zoom 3.33-6**: Uses `world_low` source via `state-label-us-world` layer
  - Filters for all 50 US states by name using a `match` expression
  - Includes stacked text formatting for multi-word states (e.g., "NEW\nYORK")
- **Zoom 6-15**: Uses `us_high` source via `state-label-us` layer
  - Higher detail source becomes available at zoom 6
  - Same styling and stacked text formatting

**World States (Non-US):**
- **Zoom 4-6**: Uses `world_low` source via `state-label-world` layer
  - Filters to exclude all 50 US states using a `match` expression
  - Simple uppercase formatting (no stacked text)

This dual-layer approach ensures US states appear earlier (zoom 3.33) while world states appear later (zoom 4), and US states transition to higher detail data at zoom 6.

## Exporting Basemaps

To use a basemap in another codebase (e.g., Astro, static sites, or other frameworks), you can export a bundle with all necessary files:

```bash
npm run export:bundle
# or
npx tsx scripts/export-basemap-bundle.ts dark-blue
```

This creates a `map-bundle/` directory in the basemap folder containing:
- `style.json` - MapLibre style definition (sprite path updated to relative)
- `map.js` - Map initialization script (for frameworks that load scripts dynamically)
- `style.css` - Map container and starfield styles (adaptable for different layouts)
- `sprites/` - Sprite files (PNG + JSON, regular + @2x)
- `index.html` - Standalone HTML example
- `README.md` - Usage instructions

The bundle is self-contained and ready to copy to another project. External dependencies (glyphs, starfield script, PMTiles data) are loaded from CDN, so only the bundle files need to be included.

See `docs/exporting-basemaps.md` for detailed documentation on using the bundle in different frameworks.

## Spinning Off Basemaps

To create a fully independent project from a basemap for use in another repository:

```bash
npm run spinoff -- <source-basemap> <spinoff-name>
```

Example:
```bash
npm run spinoff -- dark-gray my-custom-map
```

This creates a complete standalone project at `spinoffs/my-custom-map/` with:
- Full TypeScript source files (theme.ts, style definitions)
- Build scripts (build:styles, build:shields)
- Development server (serve.js)
- All shared utilities (copied locally, no parent dependencies)
- Sprite files and shield templates
- Complete documentation
- package.json with all dependencies

**When to use spinoff:**
- Creating a custom map for another repository
- Need to add custom data layers on top of the basemap
- Want full development environment with build tools
- Plan to heavily customize the map style

**Difference from export:bundle:**
- `export:bundle` creates minimal files for static deployment (no source, no build tools)
- `spinoff` creates a complete development project (full source + build tools)

See `docs/spinning-off-basemaps.md` for detailed documentation.

## Troubleshooting

- **White screen**: Check browser console for errors. Common issues:
  - Sprite/glyph URLs must be full URLs (not relative paths)
  - PMTiles protocol must be registered before map initialization
  - Ensure `#map` container has height (100vh)

- **Assets not loading**: Verify paths in `style.json` match your environment:
  - **Local development**: Use `http://localhost:8080/shared/assets/glyphs/...` and `http://localhost:8080/shared/assets/sprites/...`
  - **Production**: Use CDN URLs like `https://data.storypath.studio/glyphs/...` and `https://data.storypath.studio/...`
  - Verify which environment you're targeting and that the appropriate server/CDN is accessible

- **PMTiles errors**: Ensure the server supports HTTP Range requests (serve.js handles this)

## License

See `LICENSE` file for details.
