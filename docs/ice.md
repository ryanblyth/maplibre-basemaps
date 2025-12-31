# Ice (Glaciers, Ice Sheets, and Ice Shelves)

This document explains how ice visualization is configured and displayed on the map.

## Overview

Ice layers provide visualization for glaciers, ice sheets, and ice shelves. The system provides:

- **Configurable visibility** - Enable/disable ice globally
- **Separate styling** - Different colors and opacities for glaciated areas, ice shelves, and ice edges
- **Zoom-based display** - Control when ice appears and fades out
- **Custom colors and opacities** - Full control over each ice type

## Data Source

Ice data comes from Natural Earth ice tiles:

- **Source**: `ne-ice`
- **PMTiles URL**: `pmtiles://https://data.storypath.studio/pmtiles/ne_ice_z0-6.pmtiles`
- **Zoom Range**: 0-6 (fades out at zoom 7)
- **Source Layers**: 3 layers representing different ice types:
  - `glaciated` - Glaciers and ice caps (polygons)
  - `ice_shelves` - Ice shelves (polygons)
  - `ice_edge` - Ice shelf edges (lines)

### Feature Properties

Each ice feature has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `featurecla` | string | Feature class ("Glaciated areas", "Antarctic Ice Shelf", "Antarctic Ice Shelf Edge") |
| `name` | string | Name of the ice feature (e.g., "Greenland Ice Sheet", "Ross Ice Shelf") |
| `scalerank` | number | Scale rank for generalization |
| `min_zoom` | number | Minimum zoom level for this feature |
| `recnum` | number | Record number |

## Configuration

Ice configuration is defined in each basemap's `theme.ts` file:

```typescript
// basemaps/dark-blue/styles/theme.ts
export const darkBlueIce = {
  /** Whether to show ice at all */
  enabled: true,
  
  /** Minimum zoom level to show ice */
  minZoom: 0,
  
  /** Maximum zoom level to show ice (fades out after this) */
  maxZoom: 6,
  
  /** Base opacity range */
  opacity: {
    min: 0.7,  // Opacity at minZoom
    max: 0.9,  // Opacity at maxZoom
  },
  
  /** Glaciated areas (glaciers, ice caps) */
  glaciated: {
    color: "#e8f4f8",  // Light blue-white
    opacity: 0.9,
  },
  
  /** Ice shelves */
  iceShelves: {
    color: "#d0e8f0",  // Slightly darker blue-white
    opacity: 0.9,
  },
  
  /** Ice edge (outline) */
  iceEdge: {
    color: "#a0c8d8",  // Medium blue-gray
    width: 0.5,
    opacity: 0.6,
  },
};
```

### Enabling/Disabling Ice

To disable ice completely:

```typescript
export const darkBlueIce = {
  enabled: false,  // This prevents loading the PMTiles source and creating layers
  // ... other settings ignored when disabled
};
```

When `enabled: false`:
- The `ne-ice` PMTiles source is **not added** to the style
- No ice layers are created
- The PMTiles file is **not requested** (saves bandwidth)

### Zoom Levels

Control when ice appears:

```typescript
minZoom: 0,   // Start showing at zoom 0
maxZoom: 6,   // Fade out at zoom 6 (fully transparent by zoom 7)
```

Ice fades out smoothly between `maxZoom` and `maxZoom + 1`.

### Glaciated Areas

Glaciated areas represent glaciers and ice caps:

```typescript
glaciated: {
  color: "#e8f4f8",  // Fill color (light blue-white)
  opacity: 0.9,      // Fill opacity (0.0 to 1.0)
}
```

### Ice Shelves

Ice shelves represent floating ice shelves (primarily in Antarctica):

```typescript
iceShelves: {
  color: "#d0e8f0",  // Fill color (slightly darker than glaciated)
  opacity: 0.9,      // Fill opacity
}
```

### Ice Edge

Ice edge represents the outline of ice shelves:

```typescript
iceEdge: {
  color: "#a0c8d8",  // Line color (medium blue-gray)
  width: 0.5,        // Line width in pixels
  opacity: 0.6,      // Line opacity
}
```

## Layer Rendering

Ice layers are rendered in a specific order:

1. **Glaciated areas first** - Base layer for glaciers and ice caps
2. **Ice shelves on top** - Floating ice shelves
3. **Ice edge last** - Outline for ice shelves

This creates a natural layering where ice shelves appear on top of glaciated areas, with edges clearly defined.

## Integration with Other Layers

Ice layers are positioned in the layer stack:

- **After**: Bathymetry layers (if enabled)
- **Before**: Contours, boundaries, roads, and labels

This ensures ice appears on top of water/bathymetry but below other land features.

## Styling Details

### Opacity Interpolation

Each layer's opacity interpolates with zoom:

```typescript
"fill-opacity": [
  "interpolate",
  ["linear"],
  ["zoom"],
  0, 0.7,   // minZoom → base opacity (scaled)
  6, 0.9,   // maxZoom → full layer opacity
  7, 0.0    // maxZoom + 1 → fully transparent (fade out)
]
```

### Color Recommendations

For dark themes, use light blue-white tones:
- **Glaciated**: `#e8f4f8` (lightest) - represents fresh snow/ice
- **Ice Shelves**: `#d0e8f0` (slightly darker) - represents older ice
- **Ice Edge**: `#a0c8d8` (darkest) - provides contrast for outlines

For light themes, you may want to use darker blue tones or white with subtle tints.

## Maintenance

### Updating Ice Configuration

1. **Edit theme file**: `basemaps/dark-blue/styles/theme.ts`
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser** to see changes

### Changing Colors

1. **Update colors** in `theme.ts`:
   ```typescript
   glaciated: {
     color: "#your-color",
   },
   iceShelves: {
     color: "#your-color",
   },
   iceEdge: {
     color: "#your-color",
   }
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

### Changing Opacities

1. **Update opacity values** in `theme.ts`:
   ```typescript
   glaciated: {
     opacity: 0.95,  // Increase glaciated opacity
   },
   iceShelves: {
     opacity: 0.85,  // Adjust ice shelf opacity
   }
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

## Troubleshooting

### Ice Not Showing

1. **Check ice is enabled** in `theme.ts`:
   ```typescript
   ice: {
     enabled: true,  // Must be true
   }
   ```

2. **Check zoom level** - Ice appears at `minZoom` to `maxZoom` (default: 0-6)

3. **Check source is loading** - Verify `ne-ice` source appears in Network tab (only if `enabled: true`)

4. **Check layer order** - Ice should render after bathymetry but before contours

### Colors Not Visible

1. **Check color contrast** - Ice colors should be noticeably different from water/land colors

2. **Check opacity** - Ice layers should have high opacity (0.8-0.9) for visibility

3. **Check layer order** - Ice should render after water layers

### PMTiles Not Loading

1. **Check enabled flag** - If `enabled: false`, source won't be added (this is expected)

2. **Check URL** - Verify PMTiles URL is correct in `shared/styles/layers/sources.ts`

3. **Check CORS** - Ensure PMTiles server allows cross-origin requests

4. **Check Network tab** - Look for `ne_ice_z0-6.pmtiles` request (should be 200 status)

## Related Documentation

- [Customizing Themes](./customizing-themes.md) - How to modify ice colors and opacities
- [Bathymetry](./bathymetry.md) - Ocean depth visualization (related feature)
- [Map Elements](./MAP_ELEMENTS.md) - MapLibre concepts and layer types

