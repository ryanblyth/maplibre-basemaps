# Bathymetry (Ocean Depth Visualization)

This document explains how bathymetry (ocean depth) visualization is configured and displayed on the map.

## Overview

Bathymetry provides depth shading for ocean areas, creating a visual representation of underwater topography. The system provides:

- **Configurable visibility** - Enable/disable bathymetry globally
- **Depth-based coloring** - Different colors for shallow vs. deep areas
- **Depth-based opacity** - Shallow areas are more opaque, deep areas are more transparent (creating a "looking through water" effect)
- **Zoom-based display** - Control when bathymetry appears and fades out
- **Custom colors and opacities** - Full control over each depth level

## Data Source

Bathymetry data comes from Natural Earth bathymetry tiles:

- **Source**: `ne-bathy`
- **PMTiles URL**: `pmtiles://https://data.storypath.studio/pmtiles/ne_bathy_z0-6.pmtiles`
- **Zoom Range**: 0-6 (fades out at zoom 7)
- **Source Layers**: 12 layers representing different depth bands:
  - `ne_10m_bathymetry_A_10000` (10000m - deepest)
  - `ne_10m_bathymetry_B_9000` (9000m)
  - `ne_10m_bathymetry_C_8000` (8000m)
  - `ne_10m_bathymetry_D_7000` (7000m)
  - `ne_10m_bathymetry_E_6000` (6000m)
  - `ne_10m_bathymetry_F_5000` (5000m)
  - `ne_10m_bathymetry_G_4000` (4000m)
  - `ne_10m_bathymetry_H_3000` (3000m)
  - `ne_10m_bathymetry_I_2000` (2000m)
  - `ne_10m_bathymetry_J_1000` (1000m)
  - `ne_10m_bathymetry_K_200` (200m)
  - `ne_10m_bathymetry_L_0` (0m - shallowest)

### Feature Properties

Each bathymetry feature has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `depth` | number | Depth in meters (positive values) |
| `featurecla` | string | Feature class (typically "Bathymetry") |
| `scalerank` | number | Scale rank for generalization |

## Configuration

Bathymetry configuration is defined in each basemap's `theme.ts` file:

```typescript
// basemaps/dark-blue/styles/theme.ts
export const darkBlueBathymetry = {
  /** Whether to show bathymetry at all */
  enabled: true,
  
  /** Minimum zoom level to show bathymetry */
  minZoom: 0,
  
  /** Maximum zoom level to show bathymetry (fades out after this) */
  maxZoom: 7,
  
  /** Base opacity range (used if depthOpacities not specified) */
  opacity: {
    min: 0.7,  // Opacity at minZoom
    max: 0.9,  // Opacity at maxZoom
  },
  
  /** Custom colors for each depth level */
  colors: {
    shallow: "#0d3a5f",  // 0m - shallowest (lighter than water)
    shelf: "#0a2f4f",    // 200m - shelf
    slope: "#082544",    // 1000m - slope
    deep1: "#061d3a",    // 2000m - deep1
    deep2: "#04152a",    // 4000m - deep2
    abyss: "#020d1a",    // 6000m - abyss
    trench: "#000a14",   // 10000m - trench (deepest)
  },
  
  /** Custom opacity for each depth level */
  depthOpacities: {
    shallow: 0.9,    // 0m - shallowest (most opaque)
    shelf: 0.86,     // 200m
    slope: 0.77,     // 1000m
    deep1: 0.63,     // 2000m
    deep2: 0.50,     // 4000m
    abyss: 0.36,     // 6000m
    trench: 0.23,    // 10000m - deepest (most transparent)
  },
};
```

### Enabling/Disabling Bathymetry

To disable bathymetry completely:

```typescript
export const darkBlueBathymetry = {
  enabled: false,  // This prevents loading the PMTiles source and creating layers
  // ... other settings ignored when disabled
};
```

When `enabled: false`:
- The `ne-bathy` PMTiles source is **not added** to the style
- No bathymetry layers are created
- The PMTiles file is **not requested** (saves bandwidth)

### Zoom Levels

Control when bathymetry appears:

```typescript
minZoom: 0,   // Start showing at zoom 0
maxZoom: 7,   // Fade out at zoom 7 (fully transparent by zoom 8)
```

Bathymetry fades out smoothly between `maxZoom` and `maxZoom + 1`.

### Colors

#### Auto-Generated Colors

If you don't specify custom colors, the system automatically generates a color ramp from your water color:

```typescript
colors: {
  // Leave empty or omit to use auto-generated colors
}
```

Auto-generated colors:
- Start from your `water.fill` color
- Create a ramp from shallow (lighter) to deep (darker)
- Maintain the same hue family as your water color

#### Custom Colors

To customize colors for each depth level:

```typescript
colors: {
  shallow: "#0d3a5f",  // 0m - customize this
  shelf: "#0a2f4f",    // 200m - customize this
  slope: "#082544",    // 1000m - customize this
  deep1: "#061d3a",    // 2000m - customize this
  deep2: "#04152a",    // 4000m - customize this
  abyss: "#020d1a",    // 6000m - customize this
  trench: "#000a14",   // 10000m - customize this
}
```

**Depth Stops:**
- `shallow` - 0m (shallowest areas)
- `shelf` - 200m (continental shelf)
- `slope` - 1000m (continental slope)
- `deep1` - 2000m (deep ocean)
- `deep2` - 4000m (abyssal plain)
- `abyss` - 6000m (abyssal zone)
- `trench` - 10000m (deepest trenches)

### Opacities

#### Auto-Generated Opacities

If you don't specify custom depth opacities, the system automatically generates an opacity ramp:

```typescript
depthOpacities: {
  // Leave empty or omit to use auto-generated opacities
}
```

Auto-generated opacities create a "looking through water" effect:
- **Shallow areas** (0m): High opacity (~0.9) - most opaque
- **Deep areas** (10000m): Low opacity (~0.23) - most transparent
- **Progressive decrease**: Each depth level is progressively more transparent

#### Custom Opacities

To customize opacity for each depth level:

```typescript
depthOpacities: {
  shallow: 0.9,    // 0m - most opaque
  shelf: 0.86,     // 200m
  slope: 0.77,     // 1000m
  deep1: 0.63,     // 2000m
  deep2: 0.50,     // 4000m
  abyss: 0.36,     // 6000m
  trench: 0.23,    // 10000m - most transparent
}
```

**Opacity Range:** 0.0 (fully transparent) to 1.0 (fully opaque)

## Layer Rendering

Bathymetry layers are rendered in a specific order to create the depth effect:

1. **Deepest layers first** (10000m) - Rendered with lowest opacity
2. **Progressively shallower layers** - Each with higher opacity
3. **Shallowest layer last** (0m) - Rendered with highest opacity on top

This creates a natural "looking through water" effect where:
- Shallow areas are clearly visible (high opacity)
- Deep areas are visible but more transparent (low opacity)
- You can see through deeper water to see the depth variation

## Integration with Water Layers

Bathymetry layers are positioned in the layer stack:

- **After**: All water fill layers (`water-world`, `water-world-mid`, `water-us`)
- **Before**: Boundary layers, roads, and labels

Water fill layers are rendered with 85% opacity to allow bathymetry to show through.

## Styling Details

### Color Interpolation

Bathymetry uses linear color interpolation based on the `depth` property:

```typescript
"fill-color": [
  "interpolate",
  ["linear"],
  ["get", "depth"],  // Uses feature depth property
  0, "#0d3a5f",      // 0m → shallow color
  200, "#0a2f4f",    // 200m → shelf color
  1000, "#082544",   // 1000m → slope color
  // ... etc
]
```

### Opacity Interpolation

Each layer's opacity interpolates with zoom:

```typescript
"fill-opacity": [
  "interpolate",
  ["linear"],
  ["zoom"],
  0, 0.7,   // minZoom → base opacity (scaled by depth)
  6, 0.9,   // maxZoom → full layer opacity
  7, 0.0    // maxZoom + 1 → fully transparent (fade out)
]
```

### Depth Handling

The system safely handles both positive and negative depth values:

```typescript
[
  "case",
  [">=", ["get", "depth"], 0],
  ["get", "depth"],        // Use positive depth as-is
  ["*", ["get", "depth"], -1]  // Convert negative to positive
]
```

## Maintenance

### Updating Bathymetry Configuration

1. **Edit theme file**: `basemaps/dark-blue/styles/theme.ts`
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser** to see changes

### Changing Colors

1. **Update colors** in `theme.ts`:
   ```typescript
   colors: {
     shallow: "#your-color",
     // ... etc
   }
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

### Changing Opacities

1. **Update depthOpacities** in `theme.ts`:
   ```typescript
   depthOpacities: {
     shallow: 0.95,  // Increase shallow opacity
     // ... etc
   }
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

## Troubleshooting

### Bathymetry Not Showing

1. **Check bathymetry is enabled** in `theme.ts`:
   ```typescript
   bathymetry: {
     enabled: true,  // Must be true
   }
   ```

2. **Check zoom level** - Bathymetry appears at `minZoom` to `maxZoom` (default: 0-7)

3. **Check water layer opacity** - Water fill layers should be 85% opaque to allow bathymetry to show through

4. **Check source is loading** - Verify `ne-bathy` source appears in Network tab (only if `enabled: true`)

5. **Use click handler** - Click on ocean areas and check console for bathymetry features

### Colors Not Visible

1. **Check color contrast** - Shallow colors should be noticeably different from water color

2. **Check opacity** - Shallow layers should have high opacity (0.8-0.9)

3. **Check layer order** - Bathymetry should render after water layers

### PMTiles Not Loading

1. **Check enabled flag** - If `enabled: false`, source won't be added (this is expected)

2. **Check URL** - Verify PMTiles URL is correct in `shared/styles/layers/sources.ts`

3. **Check CORS** - Ensure PMTiles server allows cross-origin requests

4. **Check Network tab** - Look for `ne_bathy_z0-6.pmtiles` request (should be 200 status)

## Related Documentation

- [Customizing Themes](./customizing-themes.md) - How to modify bathymetry colors and opacities
- [Map Elements](./MAP_ELEMENTS.md) - MapLibre concepts and layer types
- [Water Features](./roads.md) - Water layer configuration (related to bathymetry)

