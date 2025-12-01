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

## Adding a New Basemap

1. Create a new directory under `/basemaps` (e.g., `/basemaps/light/`)
2. Add `style.json` with your style definition
3. Reference shared assets:
   - Glyphs: `"glyphs": "http://localhost:8080/shared/assets/glyphs/{fontstack}/{range}.pbf"`
   - Sprites: `"sprite": "http://localhost:8080/shared/assets/sprites/basemap"`
4. Create `preview.html` to preview your basemap
5. See `/specs/001-dark-blue-basemap.md` for a detailed build specification

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

### Sprites
Icon sprites are stored in `/shared/assets/sprites/` and shared across all basemaps. The sprite atlas includes icons for POIs (airports, restaurants, hospitals, etc.).

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

## Development

### Server
The `serve.js` server handles:
- Serving basemap files from `/basemaps/*`
- Serving shared assets from `/shared/*`
- CORS headers for asset loading
- HTTP Range requests for PMTiles

### Style Development
- Edit `style.json` files directly
- Refresh the preview page to see changes
- Check browser console for errors
- See `docs/MAP_ELEMENTS.md` for MapLibre style reference

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

## Troubleshooting

- **White screen**: Check browser console for errors. Common issues:
  - Sprite/glyph URLs must be full URLs (not relative paths)
  - PMTiles protocol must be registered before map initialization
  - Ensure `#map` container has height (100vh)

- **Assets not loading**: Verify paths in `style.json` use full URLs:
  - `http://localhost:8080/shared/assets/glyphs/...`
  - `http://localhost:8080/shared/assets/sprites/...`

- **PMTiles errors**: Ensure the server supports HTTP Range requests (serve.js handles this)

## License

See `LICENSE` file for details.
