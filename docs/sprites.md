# Sprites: Icons and Highway Shields

This document explains how sprites (icons and highway shields) are organized and built in the MapLibre basemaps system.

## Overview

Sprites are image atlases that contain icons used on the map. The system uses a **hybrid approach**:
- **POI icons** are shared across all basemaps (same icons, different colors via SDF)
- **Highway shields** are basemap-specific (generated with theme colors)

## Directory Structure

```
/shared/assets/sprites/
  /shields/                    # SVG templates (shared)
    ├── shield-interstate-custom.svg
    ├── shield-ushighway-custom.svg
    └── shield-state-custom.svg
  basemap.json                 # Shared POI icons ONLY (no shields)
  basemap.png                  # Shared POI icons ONLY (no shields)

/basemaps/{basemap-name}/sprites/   # Generated sprites (basemap-specific)
  ├── basemap.json             # Contains POI icons + shields
  ├── basemap.png
  ├── basemap@2x.json          # Retina version
  └── basemap@2x.png
```

## Sprite Components

### POI Icons (Shared)

POI icons are stored in `shared/assets/sprites/icons/` and built into each basemap's sprite sheet. Currently, the system includes 9 POI icons:

- `airport` - Airports
- `airfield` - Airfields/private airstrips
- `hospital` - Hospitals
- `museum` - Museums
- `park` - Parks (national/state parks)
- `rail` - Railway stations
- `school` - Colleges/universities
- `stadium` - Sports stadiums
- `zoo` - Zoos

**Properties:**
- All are **SDF (Signed Distance Field)** sprites
- Size: 21x21px (1x) / 42x42px (2x)
- Color can be changed at runtime via `icon-color` in MapLibre
- Size can be scaled via `icon-size` in MapLibre

For detailed information on POI configuration, filtering, and maintenance, see [POI Features Documentation](./pois.md).

### Highway Shields (Basemap-Specific)

Highway shields are generated from SVG templates with basemap-specific colors:

- `shield-interstate-custom` - Interstate highways (I-70, I-95, etc.)
- `shield-ushighway-custom` - US Highways (US-1, US-66, etc.)
- `shield-state-custom` - State highways

**Properties:**
- Generated from SVG templates in `shared/assets/sprites/shields/`
- Colors come from basemap's `theme.ts` file
- **Not SDF** - colors are baked into the PNG
- Must be rebuilt if shield colors change

## Configuration

### Global Configuration

Shield SVG templates are stored in `shared/assets/sprites/shields/`. These are templates that use placeholder variables like `{{background}}`, `{{stroke}}`, etc.

### Basemap-Specific Configuration

Each basemap configures shield colors in its `theme.ts` file:

```typescript
// basemaps/dark-blue/styles/theme.ts
export const darkBlueShields: ThemeShields = {
  interstate: {
    enabled: true,
    sprite: "shield-interstate-custom",
    textColor: "#687383",
    minZoom: 6,
    // Visual properties (require sprite rebuild)
    upperBackground: "#1a2433",
    lowerBackground: "#141c28",
    strokeColor: "#3a4a5c",
    strokeWidth: 2,
  },
  usHighway: {
    enabled: true,
    sprite: "shield-ushighway-custom",
    textColor: "#687383",
    minZoom: 7,
    background: "#182030",
    strokeColor: "#3a4a5c",
    strokeWidth: 2.5,
  },
  stateHighway: {
    enabled: true,
    sprite: "shield-state-custom",
    textColor: "#687383",
    minZoom: 8,
    background: "#1a2433",
    strokeColor: "#3a4a5c",
    strokeWidth: 2,
  },
};
```

### Sprite Path Configuration

Each basemap's style function sets its sprite path:

```typescript
// basemaps/dark-blue/styles/darkBlueStyle.ts
export function createDarkBlueStyle(config: BaseStyleConfig = defaultConfig): StyleSpecification {
  const basemapConfig: BaseStyleConfig = {
    ...config,
    spritePath: 'basemaps/dark-blue/sprites/basemap',  // Basemap-specific path
  };
  return createBasemapStyle(darkBlueTheme, basemapConfig);
}
```

This generates a style JSON with:
```json
{
  "sprite": "http://localhost:8080/basemaps/dark-blue/sprites/basemap"
}
```

## Building Sprites

### Rebuild Complete Sprite Sheet

Rebuilds POI icons + shields for a specific basemap:

```bash
npx tsx scripts/rebuild-sprites.ts <basemap-name>
# Example:
npx tsx scripts/rebuild-sprites.ts dark-blue
```

This script:
1. Reads POI icons from `shared/assets/sprites/icons/` (SVG files)
2. Generates shields with colors from basemap's `theme.ts`
3. Combines them into a new sprite sheet
4. Outputs to `basemaps/{basemap-name}/sprites/`

**Note:** This script does NOT modify `shared/assets/sprites/basemap.png` - it only reads from the icons directory.

### Build Shields Only

If you only changed shield colors in `theme.ts`:

```bash
npx tsx scripts/build-shields.ts <basemap-name>
# Example:
npx tsx scripts/build-shields.ts dark-blue
```

This script:
1. Reads shield colors from basemap's `theme.ts`
2. Generates shield PNGs from SVG templates
3. Adds/updates shields in existing sprite sheet

## When to Rebuild Sprites

### Must Rebuild

- **Changed shield colors** in `theme.ts` (background, stroke, strokeWidth)
- **Changed shield SVG templates** in `shared/assets/sprites/shields/`
- **Added new shield types** to the system

### No Rebuild Needed

- **Changed shield text properties** (textColor, textSize, textFont, textPadding) - these are runtime style properties
- **Changed POI icon colors** - POI icons are SDF, colors change at runtime
- **Changed POI icon sizes** - controlled via `icon-size` in style

## Adding New Basemaps

When creating a new basemap:

1. **Create sprite directory:**
   ```bash
   mkdir -p basemaps/{basemap-name}/sprites
   ```

2. **Configure shield colors** in `basemaps/{basemap-name}/styles/theme.ts`

3. **Set sprite path** in `basemaps/{basemap-name}/styles/{basemap}Style.ts`:
   ```typescript
   spritePath: 'basemaps/{basemap-name}/sprites/basemap'
   ```

4. **Build sprites:**
   ```bash
   npx tsx scripts/rebuild-sprites.ts {basemap-name}
   ```

5. **Build styles:**
   ```bash
   npm run build:styles
   ```

## Technical Details

### SDF vs Non-SDF Sprites

**SDF (POI Icons):**
- Encodes distance information, not colors
- Can be recolored at runtime
- Better for icons that need color flexibility

**Non-SDF (Shields):**
- Regular PNG images with baked-in colors
- Cannot change colors at runtime
- Better for complex graphics with specific styling

### Sprite Sheet Format

Each sprite sheet consists of:
- **JSON file** (`basemap.json`) - Defines icon positions and dimensions
- **PNG file** (`basemap.png`) - Contains the actual image atlas
- **@2x versions** - Retina/high-DPI versions

The JSON format:
```json
{
  "icon-name": {
    "width": 21,
    "height": 21,
    "x": 0,
    "y": 0,
    "pixelRatio": 1,
    "sdf": true  // Only for POI icons
  }
}
```

## Troubleshooting

### Icons Not Showing

1. **Check sprite path** in generated `style.json`:
   ```json
   "sprite": "http://localhost:8080/basemaps/dark-blue/sprites/basemap"
   ```

2. **Verify sprite files exist:**
   ```bash
   ls basemaps/dark-blue/sprites/
   # Should show: basemap.json, basemap.png, basemap@2x.json, basemap@2x.png
   ```

3. **Hard refresh browser** (Cmd+Shift+R / Ctrl+Shift+R) to clear cache

### Shield Colors Not Updating

1. **Rebuild sprites** after changing `theme.ts`:
   ```bash
   npx tsx scripts/build-shields.ts dark-blue
   ```

2. **Rebuild styles:**
   ```bash
   npm run build:styles
   ```

3. **Hard refresh browser**

### Missing POI Icons

POI icons are built directly from SVG files in `shared/assets/sprites/icons/`. If an icon is missing:

1. **Verify the SVG file exists** in `shared/assets/sprites/icons/`
2. **Check the icon is listed** in `scripts/rebuild-sprites.ts` `poiIcons` array
3. **Rebuild sprites**: `npx tsx scripts/rebuild-sprites.ts dark-blue`

For more details, see [POI Features Documentation](./pois.md).

## Related Documentation

- [POI Features](./pois.md) - Complete guide to POI configuration, filtering, and maintenance
- [Road Features](./roads.md) - Details on highway shields and road styling
- [Customizing Themes](./customizing-themes.md) - How to modify shield colors

