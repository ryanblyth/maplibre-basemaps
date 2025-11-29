# Pre-Commit Checklist

## Files to Consider Removing

### Old Style Files (in `basemaps/styles/`)
These appear to be legacy files from the old structure. Since `dark-blue` has been moved to the new structure (`basemaps/dark-blue/style.json`), these may not be needed:

- `basemaps/styles/basemap-bathymetry-all-layers.json`
- `basemaps/styles/basemap-midieval.json`
- `basemaps/styles/basemap.json`
- `basemaps/styles/bathymetry-debug.json`
- `basemaps/styles/dark-blue.json` (duplicate - already in `basemaps/dark-blue/style.json`)

**Decision**: Keep if you want them as reference/examples, or delete if they're no longer needed.

### Reference/Export Files
- `tools/mapbox-style-exports/mapbox-midieval-export.json` - Mapbox export file

**Decision**: Keep if you need it as a reference, or delete if not needed.

## Files Ready to Commit

✅ `.gitignore` - Created
✅ `README.md` - Updated for new structure
✅ `LICENSE` - Present
✅ `Makefile` - Asset build commands
✅ `serve.js` - Development server
✅ `basemaps/dark-blue/` - New basemap structure
✅ `shared/assets/` - Shared glyphs and sprites
✅ `assets-src/icons/` - Source SVG icons
✅ `tools/` - Build scripts
✅ `docs/` - Documentation
✅ `specs/` - Build specifications

## Notes

- The `.keep` file in `shared/assets/sprites/` is fine (keeps empty directories in git)
- All paths have been updated to the new structure
- Server is configured to serve from the new paths

