# Topographic Contours

This document explains how topographic contour lines are configured and displayed on the map.

## Overview

Contours provide elevation lines showing the topography of land areas. The system provides:

- **Configurable visibility** - Enable/disable contours globally
- **Major and minor contours** - Separate styling for 500m and 200m interval lines
- **Zoom-based display** - Control when contours appear and fade out
- **Custom colors, widths, and opacities** - Full control over contour appearance

## Data Source

Contour data comes from Natural Earth topographic contour tiles:

- **Source**: `world-contours`
- **PMTiles URL**: `pmtiles://https://data.storypath.studio/pmtiles/world_mtn_contours_z6-12_mj500_mn200_z6-8_20251227.pmtiles`
- **Zoom Range**: 6-12 (fades out at zoom 13)
- **Source Layers**: 2 layers representing different contour intervals:
  - `major` - Major contours (500m intervals, z6-12)
  - `minor` - Minor contours (200m intervals, z8-12)

### Feature Properties

Each contour feature has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `ele` | number | Elevation in meters (can be negative for below sea level) |
| `ID` | number | Unique identifier for the contour line |

## Configuration

Contour configuration is defined in each basemap's `theme.ts` file:

```typescript
// basemaps/dark-blue/styles/theme.ts
export const darkBlueContours = {
  /** Whether to show contours at all */
  enabled: true,
  
  /** Minimum zoom level to show contours */
  minZoom: 6,
  
  /** Maximum zoom level to show contours (fades out after this) */
  maxZoom: 12,
  
  /** Major contour line styling (500m intervals) */
  major: {
    color: "#4a5568",  // Medium gray
    width: {
      min: 0.5,  // Width at minZoom
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.6,
    minZoom: 6,  // Major contours start at z6
  },
  
  /** Minor contour line styling (200m intervals) */
  minor: {
    color: "#3a4455",  // Darker gray
    width: {
      min: 0.25,  // Width at minZoom
      max: 0.75,  // Width at maxZoom
    },
    opacity: 0.4,
    minZoom: 8,  // Minor contours start at z8
  },
};
```

### Enabling/Disabling Contours

To disable contours completely:

```typescript
export const darkBlueContours = {
  enabled: false,  // This prevents loading the PMTiles source and creating layers
  // ... other settings ignored when disabled
};
```

When `enabled: false`:
- The `world-contours` PMTiles source is **not added** to the style
- No contour layers are created
- The PMTiles file is **not requested** (saves bandwidth)

### Zoom Levels

Control when contours appear:

```typescript
minZoom: 6,   // Start showing at zoom 6
maxZoom: 12,  // Fade out at zoom 12 (fully transparent by zoom 13)
```

Contours fade out smoothly between `maxZoom` and `maxZoom + 1`.

### Major Contours

Major contours represent 500-meter elevation intervals and are more prominent:

```typescript
major: {
  color: "#4a5568",      // Line color
  width: {
    min: 0.5,            // Width at minZoom
    max: 1.5,            // Width at maxZoom
  },
  opacity: 0.6,          // Line opacity (0.0 to 1.0)
  minZoom: 6,             // Start showing at zoom 6
}
```

### Minor Contours

Minor contours represent 200-meter elevation intervals and are more subtle:

```typescript
minor: {
  color: "#3a4455",      // Line color (typically darker/lighter than major)
  width: {
    min: 0.25,           // Width at minZoom (thinner than major)
    max: 0.75,           // Width at maxZoom (thinner than major)
  },
  opacity: 0.4,          // Line opacity (typically lower than major)
  minZoom: 8,            // Start showing at zoom 8 (later than major)
}
```

## Layer Rendering

Contour layers are rendered in a specific order:

1. **Major contours first** - Rendered with higher opacity and wider lines
2. **Minor contours on top** - Rendered with lower opacity and thinner lines

This creates a natural topographic effect where:
- Major elevation changes are clearly visible (thicker, more opaque lines)
- Minor elevation changes provide detail (thinner, more transparent lines)

## Integration with Other Layers

Contour layers are positioned in the layer stack:

- **After**: Bathymetry layers (if enabled)
- **Before**: Boundary layers, roads, and labels

This ensures contours appear on top of land/water fills but below labels for readability.

## Styling Details

### Width Interpolation

Contour widths interpolate smoothly with zoom:

```typescript
"line-width": [
  "interpolate",
  ["linear"],
  ["zoom"],
  6, 0.5,   // minZoom → min width
  12, 1.5   // maxZoom → max width
]
```

### Opacity Fade-Out

Contours fade out smoothly at the maximum zoom:

```typescript
"line-opacity": [
  "interpolate",
  ["linear"],
  ["zoom"],
  6, 0.6,   // minZoom → full opacity
  12, 0.6,  // maxZoom → full opacity
  13, 0.0   // maxZoom + 1 → fully transparent (fade out)
]
```

## Maintenance

### Updating Contour Configuration

1. **Edit theme file**: `basemaps/dark-blue/styles/theme.ts`
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser** to see changes

### Changing Colors

1. **Update colors** in `theme.ts`:
   ```typescript
   major: {
     color: "#your-color",
   },
   minor: {
     color: "#your-color",
   }
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

### Changing Widths

1. **Update width ranges** in `theme.ts`:
   ```typescript
   major: {
     width: {
       min: 0.8,  // Increase minimum width
       max: 2.0,  // Increase maximum width
     },
   }
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

### Changing Opacities

1. **Update opacity values** in `theme.ts`:
   ```typescript
   major: {
     opacity: 0.8,  // Increase major contour opacity
   },
   minor: {
     opacity: 0.5,  // Increase minor contour opacity
   }
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

## Troubleshooting

### Contours Not Showing

1. **Check contours are enabled** in `theme.ts`:
   ```typescript
   contours: {
     enabled: true,  // Must be true
   }
   ```

2. **Check zoom level** - Contours appear at their configured `minZoom` or higher:
   - Major contours: default z6+
   - Minor contours: default z8+

3. **Check source is loading** - Verify `world-contours` source appears in Network tab (only if `enabled: true`)

4. **Check layer order** - Contours should render after bathymetry but before boundaries

### Contours Too Subtle

1. **Increase opacity**:
   ```typescript
   major: {
     opacity: 0.8,  // Increase from 0.6
   }
   ```

2. **Increase width**:
   ```typescript
   major: {
     width: {
       min: 0.8,  // Increase from 0.5
       max: 2.0,  // Increase from 1.5
     },
   }
   ```

3. **Use lighter colors** for better visibility on dark backgrounds

### Contours Too Prominent

1. **Decrease opacity**:
   ```typescript
   major: {
     opacity: 0.4,  // Decrease from 0.6
   }
   ```

2. **Decrease width**:
   ```typescript
   major: {
     width: {
       min: 0.3,  // Decrease from 0.5
       max: 1.0,  // Decrease from 1.5
     },
   }
   ```

3. **Use darker colors** to blend better with the background

### PMTiles Not Loading

1. **Check enabled flag** - If `enabled: false`, source won't be added (this is expected)

2. **Check URL** - Verify PMTiles URL is correct in `shared/styles/layers/sources.ts`

3. **Check CORS** - Ensure PMTiles server allows cross-origin requests

4. **Check Network tab** - Look for `world_mtn_contours_z6-12_mj500_mn200_z6-8_20251227.pmtiles` request (should be 200 status)

## Related Documentation

- [Customizing Themes](./customizing-themes.md) - How to modify contour colors, widths, and opacities
- [Map Elements](./MAP_ELEMENTS.md) - MapLibre concepts and layer types
- [Bathymetry](./bathymetry.md) - Ocean depth visualization (related feature)

