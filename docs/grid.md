# Grid Lines (Latitude and Longitude)

This document explains how grid lines (graticules) are configured and displayed on the map.

## Overview

Grid lines provide latitude and longitude reference lines, creating a coordinate grid overlay. The system provides:

- **Configurable visibility** - Enable/disable grid lines globally
- **Separate styling** - Different colors, widths, and opacities for latitude and longitude lines
- **Zoom-based display** - Control when grid lines appear and fade out
- **Interval control** - Configure which grid lines to show (e.g., every 10 degrees)
- **Label support** - Optional coordinate labels along grid lines

## Data Source

Grid line data comes from graticule tiles:

- **Source**: `world-grid`
- **PMTiles URL**: `pmtiles://https://data.storypath.studio/pmtiles/graticules.pmtiles`
- **Zoom Range**: 0-8 (configurable via theme)
- **Source Layer**: `graticules` - Contains both latitude and longitude lines

### Feature Properties

Each grid line feature has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `kind` | string | Line type: "parallel" (latitude) or "meridian" (longitude) |
| `step` | string | Interval in degrees: "1", "5", "10", or "30" |
| `value` | number | Coordinate value (-180 to 180 for longitude, -90 to 90 for latitude) |

## Configuration

Grid configuration is defined in each basemap's `theme.ts` file:

```typescript
// basemaps/dark-blue/styles/theme.ts
export const darkBlueGrid = {
  /** Whether to show grid lines at all */
  enabled: true,
  
  /** Minimum zoom level to show grid lines */
  minZoom: 0,
  
  /** Maximum zoom level to show grid lines (fades out after this) */
  maxZoom: 10,
  
  /** Latitude lines (horizontal) styling */
  latitude: {
    color: "#6b7280",  // Line color
    width: {
      min: 1.0,  // Width at minZoom
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.6,
    interval: 10,  // Lines every 10 degrees
    label: {
      enabled: false,  // Enable labels for latitude lines
      color: "#9ca3af",  // Label text color
      size: {
        min: 10,  // Font size at minZoom
        max: 12,  // Font size at maxZoom
      },
      opacity: 0.8,
      minZoom: 2,  // Show labels starting at zoom 2
    },
  },
  
  /** Longitude lines (vertical) styling */
  longitude: {
    color: "#6b7280",  // Line color
    width: {
      min: 1.0,  // Width at minZoom
      max: 1.5,  // Width at maxZoom
    },
    opacity: 0.6,
    interval: 10,  // Lines every 10 degrees
    label: {
      enabled: false,  // Enable labels for longitude lines
      color: "#9ca3af",  // Label text color
      size: {
        min: 10,  // Font size at minZoom
        max: 12,  // Font size at maxZoom
      },
      opacity: 0.8,
      minZoom: 2,  // Show labels starting at zoom 2
    },
  },
};
```

### Enabling/Disabling Grid Lines

To disable grid lines completely:

```typescript
export const darkBlueGrid = {
  enabled: false,  // This prevents loading the PMTiles source and creating layers
  // ... other settings ignored when disabled
};
```

When `enabled: false`:
- The `world-grid` PMTiles source is **not added** to the style
- No grid layers are created
- The PMTiles file is **not requested** (saves bandwidth)

### Zoom Levels

Control when grid lines appear:

```typescript
minZoom: 0,   // Start showing at zoom 0
maxZoom: 10,  // Fade out at zoom 10 (fully transparent by zoom 11)
```

Grid lines fade out smoothly between `maxZoom` and `maxZoom + 1`.

### Line Styling

#### Colors

Set different colors for latitude and longitude lines:

```typescript
latitude: {
  color: "#6b7280",  // Medium gray for latitude
},
longitude: {
  color: "#718096",  // Slightly different gray for longitude
}
```

#### Widths

Configure line width as a fixed value or zoom-based:

```typescript
// Fixed width
width: 1.0,

// Zoom-based width (interpolates between min and max)
width: {
  min: 0.5,  // Width at minZoom
  max: 1.5,  // Width at maxZoom
}
```

#### Opacity

Control line transparency:

```typescript
opacity: 0.6,  // 60% opaque (0.0 = transparent, 1.0 = opaque)
```

Opacity interpolates with zoom, starting more transparent at `minZoom` and reaching full opacity at `maxZoom`.

### Intervals

Control which grid lines are displayed by specifying the interval:

```typescript
interval: 10,  // Show lines every 10 degrees (0°, 10°, 20°, etc.)
```

Available intervals in the PMTiles:
- `1` - Every degree (very dense)
- `5` - Every 5 degrees
- `10` - Every 10 degrees (default)
- `30` - Every 30 degrees (sparse)

The interval must match one of the `step` values in the PMTiles data.

### Labels

Grid lines can display coordinate labels along the lines:

```typescript
label: {
  enabled: true,  // Enable labels
  color: "#9ca3af",  // Label text color
  size: {
    min: 10,  // Font size at minZoom
    max: 12,  // Font size at maxZoom
  },
  opacity: 0.8,
  minZoom: 2,  // Show labels starting at zoom 2
}
```

**Label Format:**
- Latitude labels: `"10°N"`, `"20°S"`, `"0°"` (equator)
- Longitude labels: `"10°E"`, `"20°W"`, `"0°"` (prime meridian)

Labels are placed along the lines with automatic spacing and include a black halo for readability.

## Layer Rendering

Grid layers are rendered in a specific order:

1. **Latitude lines first** - Horizontal lines (parallels)
2. **Longitude lines second** - Vertical lines (meridians)
3. **Latitude labels** - If enabled
4. **Longitude labels** - If enabled

## Integration with Other Layers

Grid layers are positioned in the layer stack:

- **After**: Ice layers, boundaries, roads
- **Before**: Labels and POIs

This ensures grid lines appear on top of most features but don't obscure important labels.

## Styling Details

### Opacity Interpolation

Each layer's opacity interpolates with zoom:

```typescript
"line-opacity": [
  "interpolate",
  ["linear"],
  ["zoom"],
  0, 0.42,   // minZoom → 70% of base opacity (fade-in)
  10, 0.6,   // maxZoom → full opacity
  11, 0.0    // maxZoom + 1 → fully transparent (fade out)
]
```

### Width Interpolation

Line width interpolates with zoom when using zoom-based width:

```typescript
"line-width": [
  "interpolate",
  ["linear"],
  ["zoom"],
  0, 1.0,   // minZoom → min width
  10, 1.5   // maxZoom → max width
]
```

### Label Formatting

Labels use MapLibre expressions to format coordinates:

```typescript
"text-field": [
  "concat",
  ["to-string", ["abs", ["get", "value"]]],  // Absolute value
  "°",                                        // Degree symbol
  ["case",                                    // Direction suffix
    [">", ["get", "value"], 0], "N",         // Positive = N/E
    ["<", ["get", "value"], 0], "S",         // Negative = S/W
    "°"                                       // Zero = equator/prime meridian
  ]
]
```

## Maintenance

### Updating Grid Configuration

1. **Edit theme file**: `basemaps/dark-blue/styles/theme.ts`
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser** to see changes

### Changing Colors

1. **Update colors** in `theme.ts`:
   ```typescript
   latitude: {
     color: "#your-color",
   },
   longitude: {
     color: "#your-color",
   }
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

### Changing Widths

1. **Update width values** in `theme.ts`:
   ```typescript
   latitude: {
     width: {
       min: 0.5,  // Thinner at low zoom
       max: 2.0,  // Thicker at high zoom
     }
   }
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

### Changing Intervals

1. **Update interval** in `theme.ts`:
   ```typescript
   latitude: {
     interval: 5,  // Show lines every 5 degrees instead of 10
   }
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

Note: The interval must match one of the available `step` values in the PMTiles ("1", "5", "10", or "30").

### Enabling Labels

1. **Enable labels** in `theme.ts`:
   ```typescript
   latitude: {
     label: {
       enabled: true,  // Enable latitude labels
       // ... other label settings
     }
   },
   longitude: {
     label: {
       enabled: true,  // Enable longitude labels
       // ... other label settings
     }
   }
   ```
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

## Troubleshooting

### Grid Lines Not Showing

1. **Check grid is enabled** in `theme.ts`:
   ```typescript
   grid: {
     enabled: true,  // Must be true
   }
   ```

2. **Check zoom level** - Grid lines appear at `minZoom` to `maxZoom` (default: 0-10)

3. **Check source is loading** - Verify `world-grid` source appears in Network tab (only if `enabled: true`)

4. **Check interval matches PMTiles** - The `interval` value must match a `step` value in the PMTiles ("1", "5", "10", or "30")

5. **Check opacity** - Lines might be too transparent; try increasing `opacity` value

### Labels Not Showing

1. **Check labels are enabled**:
   ```typescript
   latitude: {
     label: {
       enabled: true,  // Must be true
     }
   }
   ```

2. **Check label minZoom** - Labels appear starting at `label.minZoom` (default: same as grid minZoom)

3. **Check label opacity** - Labels might be too transparent; try increasing `opacity` value

4. **Check font availability** - Ensure theme fonts are loaded correctly

### PMTiles Not Loading

1. **Check enabled flag** - If `enabled: false`, source won't be added (this is expected)

2. **Check URL** - Verify PMTiles URL is correct in `shared/styles/layers/sources.ts`

3. **Check CORS** - Ensure PMTiles server allows cross-origin requests

4. **Check Network tab** - Look for `graticules.pmtiles` request (should be 200 status)

## Related Documentation

- [Customizing Themes](./customizing-themes.md) - How to modify grid colors, widths, and opacities
- [Map Elements](./MAP_ELEMENTS.md) - MapLibre concepts and layer types
- [Bathymetry](./bathymetry.md) - Ocean depth visualization (related feature)
- [Ice](./ice.md) - Glaciers and ice sheets (related feature)

