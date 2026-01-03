# Hillshade (Terrain Shading)

This document explains how hillshade (terrain shading from elevation data) is configured and displayed on the map.

## Overview

Hillshade provides terrain shading visualization using elevation data, creating a 3D-like effect that highlights mountains, valleys, and topographic features. The system provides:

- **Configurable visibility** - Enable/disable hillshade globally
- **Illumination control** - Adjust light direction and anchor point
- **Exaggeration control** - Control terrain relief intensity
- **Color customization** - Customize shadow, highlight, and accent colors
- **Zoom-based display** - Control when hillshade appears and fades out
- **Opacity simulation** - Control intensity through exaggeration scaling

## Data Source

Hillshade data comes from elevation raster tiles:

- **Source**: `world-hillshade`
- **PMTiles URL**: `pmtiles://https://data.storypath.studio/pmtiles/world_mtn_hillshade.pmtiles`
- **Source Type**: `raster-dem` (raster digital elevation model)
- **Zoom Range**: Configurable via `minZoom` and `maxZoom` settings

### Source Properties

The hillshade source is a raster DEM (Digital Elevation Model) that provides elevation data for terrain shading calculations.

## Configuration

Hillshade configuration is defined in each basemap's `theme.ts` file:

```typescript
// basemaps/dark-blue/styles/theme.ts
export const darkBlueHillshade = {
  /** Whether to show hillshade at all */
  enabled: true,
  
  /** Minimum zoom level to show hillshade */
  minZoom: 0,
  
  /** Maximum zoom level to show hillshade (fades out after this) */
  maxZoom: 12,
  
  /** Base opacity for hillshade (0.0 to 1.0) - controls intensity via exaggeration */
  opacity: 0.5,
  
  /** Illumination direction (0-360 degrees, where 0 is north, 90 is east) */
  illuminationDirection: 335,  // Northwest (typical for natural lighting)
  
  /** Illumination anchor - "map" (fixed to map) or "viewport" (fixed to viewport) */
  illuminationAnchor: "viewport" as const,
  
  /** Exaggeration factor for terrain relief (0.0 to 1.0, higher = more dramatic) */
  exaggeration: 0.5,
  
  /** Shadow color (darker areas) */
  shadowColor: "#000000",
  
  /** Highlight color (lighter areas) */
  highlightColor: "#ffffff",
  
  /** Accent color (mid-tones) */
  accentColor: "#000000",
};
```

### Enabling/Disabling Hillshade

To disable hillshade completely:

```typescript
export const darkBlueHillshade = {
  enabled: false,  // This prevents loading the PMTiles source and creating layers
  // ... other settings ignored when disabled
};
```

When `enabled: false`:
- The `world-hillshade` PMTiles source is **not added** to the style
- No hillshade layers are created
- The PMTiles file is **not requested** (saves bandwidth)

### Zoom Levels

Control when hillshade appears:

```typescript
minZoom: 0,   // Start showing at zoom 0
maxZoom: 12,  // Fade out at zoom 12 (fully transparent by zoom 13)
```

Hillshade fades out smoothly between `maxZoom` and `maxZoom + 1` by reducing exaggeration to 0.

### Opacity

**Important:** Hillshade layers don't support a direct `opacity` paint property in MapLibre. Instead, opacity is simulated by scaling the `exaggeration` value:

```typescript
opacity: 0.5,        // 50% opacity
exaggeration: 0.5,    // Base exaggeration
// Effective exaggeration = 0.5 × 0.5 = 0.25 (more subtle effect)
```

- **Lower opacity** = Lower exaggeration = More subtle terrain shading
- **Higher opacity** = Higher exaggeration = More dramatic terrain shading
- **Opacity of 0.0** = Exaggeration of 0.0 = No visible hillshade
- **Opacity of 1.0** = Full exaggeration = Maximum terrain shading

### Illumination Direction

Control the direction of the light source:

```typescript
illuminationDirection: 335,  // 0-360 degrees
```

**Common Directions:**
- `0` - North
- `90` - East
- `180` - South
- `270` - West
- `335` - Northwest (typical for natural lighting, creates shadows on southeast-facing slopes)

### Illumination Anchor

Control whether the light source is fixed to the map or viewport:

```typescript
illuminationAnchor: "viewport",  // or "map"
```

- **`"viewport"`** - Light source is fixed relative to the viewport (shadows move as you pan/rotate)
- **`"map"`** - Light source is fixed relative to the map (shadows stay in same geographic position)

### Exaggeration

Control the intensity of terrain relief:

```typescript
exaggeration: 0.5,  // 0.0 to 1.0
```

- **0.0** - No terrain shading (flat)
- **0.5** - Moderate terrain shading (default)
- **1.0** - Maximum terrain shading (very dramatic)

**Note:** The effective exaggeration is `exaggeration × opacity`, so if you set `opacity: 0.5` and `exaggeration: 0.5`, the actual exaggeration will be `0.25`.

### Colors

Customize the shadow, highlight, and accent colors:

```typescript
shadowColor: "#000000",    // Darker areas (shadows)
highlightColor: "#ffffff", // Lighter areas (highlights)
accentColor: "#000000",    // Mid-tones
```

**Color Tips:**
- Use darker colors for `shadowColor` to create deeper shadows
- Use lighter colors for `highlightColor` to create brighter highlights
- Adjust `accentColor` to control mid-tone appearance
- For dark themes, consider using subtle grays instead of pure black/white

## Layer Rendering

Hillshade layers are rendered at the bottom of the layer stack:

1. **Background layer** (base color)
2. **Hillshade layer** (terrain shading)
3. **Landcover/landuse layers** (render on top of hillshade)
4. **Water, roads, labels, etc.** (render on top)

This ensures that:
- Hillshade provides a base terrain texture
- All other features render on top of the terrain shading
- The terrain effect is visible but doesn't obscure map features

## Integration with Other Layers

Hillshade works well with:

- **Contours** - Contour lines can overlay hillshade for detailed elevation information
- **Landcover** - Hillshade adds depth to landcover areas
- **Water** - Hillshade provides context for water features in mountainous areas

## Styling Details

### Exaggeration Interpolation

For fade-out at `maxZoom`, exaggeration interpolates with zoom:

```typescript
"hillshade-exaggeration": [
  "interpolate",
  ["linear"],
  ["zoom"],
  0, 0.25,      // minZoom → effective exaggeration (opacity × exaggeration)
  12, 0.25,     // maxZoom → same exaggeration
  13, 0.0       // maxZoom + 1 → 0 (fade out)
]
```

### Opacity Simulation

Since hillshade doesn't support direct opacity, the system calculates effective exaggeration:

```typescript
effectiveExaggeration = baseExaggeration × opacity
```

This creates a similar visual effect to opacity by reducing the intensity of the terrain shading.

## Maintenance

### Updating Hillshade Configuration

1. **Edit theme file**: `basemaps/dark-blue/styles/theme.ts`
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser** to see changes

### Changing Intensity

1. **Update opacity and/or exaggeration** in `theme.ts`:
   ```typescript
   opacity: 0.7,        // Increase for more visible effect
   exaggeration: 0.6,   // Increase for more dramatic relief
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

### Changing Illumination

1. **Update illumination settings** in `theme.ts`:
   ```typescript
   illuminationDirection: 315,  // Change light direction
   illuminationAnchor: "map",    // Change anchor point
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

### Changing Colors

1. **Update colors** in `theme.ts`:
   ```typescript
   shadowColor: "#1a1a1a",      // Softer shadow
   highlightColor: "#f0f0f0",   // Softer highlight
   accentColor: "#333333",       // Custom mid-tone
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

## Troubleshooting

### Hillshade Not Showing

1. **Check hillshade is enabled** in `theme.ts`:
   ```typescript
   hillshade: {
     enabled: true,  // Must be true
   }
   ```

2. **Check zoom level** - Hillshade appears at `minZoom` to `maxZoom` (default: 0-12)

3. **Check opacity and exaggeration** - If both are very low, hillshade may be too subtle to see:
   ```typescript
   opacity: 0.5,        // Try increasing
   exaggeration: 0.5,   // Try increasing
   ```

4. **Check source is loading** - Verify `world-hillshade` source appears in Network tab (only if `enabled: true`)

### Hillshade Too Subtle

1. **Increase opacity**:
   ```typescript
   opacity: 0.7,  // Increase from 0.5
   ```

2. **Increase exaggeration**:
   ```typescript
   exaggeration: 0.7,  // Increase from 0.5
   ```

3. **Adjust colors** - Use higher contrast colors:
   ```typescript
   shadowColor: "#000000",    // Pure black
   highlightColor: "#ffffff", // Pure white
   ```

### Hillshade Too Dramatic

1. **Decrease opacity**:
   ```typescript
   opacity: 0.3,  // Decrease from 0.5
   ```

2. **Decrease exaggeration**:
   ```typescript
   exaggeration: 0.3,  // Decrease from 0.5
   ```

3. **Use softer colors**:
   ```typescript
   shadowColor: "#333333",    // Softer shadow
   highlightColor: "#cccccc", // Softer highlight
   ```

### PMTiles Not Loading

1. **Check enabled flag** - If `enabled: false`, source won't be added (this is expected)

2. **Check URL** - Verify PMTiles URL is correct in `shared/styles/layers/sources.ts`:
   ```typescript
   url: `pmtiles://${config.dataBaseUrl}/pmtiles/world_mtn_hillshade.pmtiles`
   ```

3. **Check CORS** - Ensure PMTiles server allows cross-origin requests

4. **Check Network tab** - Look for `world_mtn_hillshade.pmtiles` request (should be 200 status)

5. **Check source type** - Verify source is `raster-dem` type (not `vector` or `raster`)

### Performance Issues

1. **Limit zoom range** - Restrict hillshade to specific zoom levels:
   ```typescript
   minZoom: 4,   // Don't show at very low zooms
   maxZoom: 10,  // Hide at high zooms
   ```

2. **Reduce exaggeration** - Lower exaggeration reduces rendering complexity:
   ```typescript
   exaggeration: 0.3,  // Lower value
   ```

## Technical Notes

### Why No Direct Opacity?

MapLibre's hillshade layer type doesn't support a `hillshade-opacity` paint property. Instead, opacity is simulated by:

1. **Scaling exaggeration** - `effectiveExaggeration = baseExaggeration × opacity`
2. **Zoom-based fade-out** - Using exaggeration interpolation to fade to 0 at `maxZoom + 1`

This provides similar visual control while working within MapLibre's limitations.

### Raster DEM vs Vector

Hillshade uses a `raster-dem` source type, which is different from vector sources:

- **Raster DEM** - Pre-rendered elevation data as raster tiles
- **Vector** - Feature-based data (used for bathymetry, contours, etc.)

The `raster-dem` type is optimized for terrain visualization and provides better performance for large-scale elevation data.

## Related Documentation

- [Customizing Themes](./customizing-themes.md) - How to modify hillshade settings
- [Map Elements](./MAP_ELEMENTS.md) - MapLibre concepts and layer types
- [Contours](./contours.md) - Topographic contour lines (complements hillshade)
- [Bathymetry](./bathymetry.md) - Ocean depth visualization (similar configuration pattern)

