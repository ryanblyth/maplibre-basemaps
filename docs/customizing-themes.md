# Customizing Themes

The theme file (`basemaps/<name>/styles/theme.ts`) controls all visual properties of the basemap. This guide explains each configurable section.

## Theme Structure

A complete theme has multiple sections:

```typescript
export const myTheme: Theme = {
  name: "My Basemap",
  fonts,
  colors: myColors,      // Fill/stroke colors
  widths: myWidths,       // Line widths at each zoom
  opacities: myOpacities, // Layer transparencies
  settings: mySettings,   // Behavior settings (optional)
  labelFonts: myLabelFonts, // Per-label-type font configuration (optional)
  shields: myShields,     // Highway shields (optional)
  pois: myPOIs,          // Point of Interest config (optional)
  bathymetry: myBathymetry, // Ocean depth visualization (optional)
  hillshade: myHillshade,   // Terrain shading from elevation data (optional)
  ice: myIce,              // Glaciers, ice sheets, and ice shelves (optional)
  contours: myContours,   // Topographic contours (optional)
  grid: myGrid,           // Latitude and longitude grid lines (optional)
  land: myLand,           // Landcover layer configuration (optional)
  landuse: myLanduse,     // Landuse layer configuration (optional)
  water: myWater,         // Water layer configuration (optional)
  starfield: myStarfield, // Starfield background for globe projection (optional)
};
```

---

## Label Fonts

Configure which fonts to use for different label types. If not specified, labels fall back to the default Noto Sans family.

### Available Fonts

All fonts are served from the CDN at `https://data.storypath.studio/glyphs/`:

| Font Family | Variants |
|-------------|----------|
| **Noto Sans** (default) | Regular, SemiBold, Italic |
| **Cormorant Garamond** | Regular, SemiBold, Italic, Bold, Bold Italic |
| **IM FELL English** | Regular, Italic, SC Regular (small caps) |
| **Junicode** | Regular, Bold, Italic |

### Per-Label-Type Configuration

```typescript
import { ThemeLabelFonts } from "../../../shared/styles/theme.js";

export const myLabelFonts: ThemeLabelFonts = {
  // Default font for all labels (fallback when specific fonts not set)
  default: ["Noto Sans Regular"],
  
  // Font for place labels (continents, countries, cities, etc.)
  place: ["Cormorant Garamond Regular"],
  
  // Font for road labels
  road: ["Noto Sans Regular"],
  
  // Font for water labels (oceans, lakes, rivers)
  water: ["Cormorant Garamond Italic"],
  
  // Font for POI labels
  poi: ["Noto Sans Regular"],
  
  // Font for grid labels (latitude/longitude)
  grid: ["Noto Sans Regular"],
};
```

Then add it to your theme:

```typescript
export const myTheme: Theme = {
  // ...
  labelFonts: myLabelFonts,
  // ...
};
```

### Font Fallback Order

For each label type, fonts fall back in this order:
1. Specific label font (e.g., `labelFonts.place`)
2. Default label font (`labelFonts.default`)
3. Theme fonts (`fonts.regular` or `fonts.italic` depending on label type)

### Using Decorative Fonts

For a medieval or historical map style:

```typescript
export const medievalLabelFonts: ThemeLabelFonts = {
  default: ["IM FELL English Regular"],
  place: ["IM FELL English SC Regular"],  // Small caps for places
  water: ["IM FELL English Italic"],
  road: ["Junicode Regular"],
};
```

---

## Colors

### Background

```typescript
colors: {
  background: "#0b0f14",  // Map background color
  // ...
}
```

### Land & Landuse

```typescript
colors: {
  land: {
    wood: "#0f141b",      // Forest/woodland
    grass: "#10161e",     // Grassland
    scrub: "#10161e",     // Scrubland
    cropland: "#0f141b",  // Agricultural
    default: "#0f141b",   // Fallback
  },
  landuse: {
    park: "#11161d",      // Parks
    cemetery: "#11161d",  // Cemeteries
    pitch: "#121923",     // Sports fields
    stadium: "#121923",   // Stadiums
    residential: "#0e131a", // Residential areas
    default: "#0e131a",   // Fallback
  },
  // ...
}
```

#### Landcover Configuration

Landcover layers (natural land types: wood, grass, scrub, cropland, etc.) can be configured in the `land` section of the theme:

```typescript
land: {
  /** 
   * Whether to make all landcover layers transparent (sets opacity to 0, layers still exist but are invisible).
   * Uses transparency instead of removing layers to allow runtime toggling via map.setPaintProperty().
   * Note: Removing layers would be more efficient (no tiles loaded, no processing), but transparency
   * enables dynamic control without rebuilding the style.
   */
  transparent: false,  // Set to true to make all landcover transparent (opacity 0)
  
  /** Whether to use a single override color for all landcover types */
  useOverrideColor: false,  // Set to true to use overrideColor for all landcover types
  
  /** Override color to use for all landcover types when useOverrideColor is true */
  overrideColor: "#0f141b",  // Default landcover color - used when useOverrideColor is true (matches land.default)
}
```

**Options:**
- `transparent: true` - Makes all landcover layers invisible (opacity 0) while keeping them in the style for runtime toggling
- `useOverrideColor: true` - Uses a single color for all landcover types instead of class-based colors
- `overrideColor` - The color to use when `useOverrideColor` is enabled

#### Landuse Configuration

Landuse layers (parks, residential, commercial, etc.) can be configured separately in the `landuse` section of the theme:

```typescript
landuse: {
  /** 
   * Whether to make all landuse layers transparent (sets opacity to 0, layers still exist but are invisible).
   * Uses transparency instead of removing layers to allow runtime toggling via map.setPaintProperty().
   * Note: Removing layers would be more efficient (no tiles loaded, no processing), but transparency
   * enables dynamic control without rebuilding the style.
   */
  transparent: false,  // Set to true to make all landuse transparent (opacity 0)
  
  /** Whether to use a single override color for all landuse types */
  useOverrideColor: false,  // Set to true to use overrideColor for all landuse types
  
  /** Override color to use for all landuse types when useOverrideColor is true */
  overrideColor: "#0e131a",  // Default landuse color - used when useOverrideColor is true (matches landuse.default)
}
```

**Options:**
- `transparent: true` - Makes all landuse layers invisible (opacity 0) while keeping them in the style for runtime toggling
- `useOverrideColor: true` - Uses a single color for all landuse types instead of class-based colors
- `overrideColor` - The color to use when `useOverrideColor` is enabled

**Runtime Control:**
Since layers remain in the style when transparent, you can toggle them at runtime:
```javascript
// Hide landcover
map.setPaintProperty('landcover-world', 'fill-opacity', 0);
map.setPaintProperty('landcover-world-mid', 'fill-opacity', 0);
map.setPaintProperty('landcover-us', 'fill-opacity', 0);

// Hide landuse
map.setPaintProperty('landuse-world', 'fill-opacity', 0);
map.setPaintProperty('landuse-world-mid', 'fill-opacity', 0);
map.setPaintProperty('landuse-us', 'fill-opacity', 0);

// Show landcover
map.setPaintProperty('landcover-world', 'fill-opacity', 0.6);
map.setPaintProperty('landcover-world-mid', 'fill-opacity', 0.6);
map.setPaintProperty('landcover-us', 'fill-opacity', 0.6);

// Show landuse
map.setPaintProperty('landuse-world', 'fill-opacity', 0.6);
map.setPaintProperty('landuse-world-mid', 'fill-opacity', 0.6);
map.setPaintProperty('landuse-us', 'fill-opacity', 0.6);
```

### Water

```typescript
colors: {
  water: {
    fill: "#0a2846",      // Water body fill
    line: "#103457",      // Waterway stroke
    labelColor: "#5b8db8", // Water label text
    labelHalo: "#0a2846", // Water label halo
    // Optional water class colors (if source data includes class property)
    ocean: "#0a2846",      // Ocean
    sea: "#0b2a48",        // Sea
    lake: "#0c2c4a",       // Lake
    river: "#103457",      // River
    // ... more water types
  },
  // ...
}
```

#### Water Configuration

Water layers (oceans, lakes, rivers, waterways, etc.) can be configured in the `water` section of the theme:

```typescript
water: {
  /** 
   * Whether to make all water fill layers transparent (sets opacity to 0, layers still exist but are invisible).
   * Uses transparency instead of removing layers to allow runtime toggling via map.setPaintProperty().
   * Note: Removing layers would be more efficient (no tiles loaded, no processing), but transparency
   * enables dynamic control without rebuilding the style.
   */
  transparent: false,  // Set to true to make all water fills transparent (opacity 0)
  
  /** 
   * Whether to make all waterway (line) layers transparent (sets opacity to 0, layers still exist but are invisible).
   * Uses transparency instead of removing layers to allow runtime toggling via map.setPaintProperty().
   * Note: Removing layers would be more efficient (no tiles loaded, no processing), but transparency
   * enables dynamic control without rebuilding the style.
   */
  transparentWaterway: false,  // Set to true to make all waterways transparent (opacity 0)
  
  /** Whether to use a single override color for all water fill types */
  useOverrideColor: false,  // Set to true to use overrideColor for all water fill types
  
  /** Override color to use for all water fill types when useOverrideColor is true */
  overrideColor: "#0a2846",  // Default water fill color - used when useOverrideColor is true (matches water.fill)
  
  /** Whether to use a single override color for all waterway (line) types */
  useOverrideColorWaterway: false,  // Set to true to use overrideColorWaterway for all waterway types
  
  /** Override color to use for all waterway types when useOverrideColorWaterway is true */
  overrideColorWaterway: "#103457",  // Default waterway line color - used when useOverrideColorWaterway is true (matches water.line)
}
```

**Options:**
- `transparent: true` - Makes all water fill layers invisible (opacity 0) while keeping them in the style for runtime toggling
- `transparentWaterway: true` - Makes all waterway (line) layers invisible (opacity 0) while keeping them in the style for runtime toggling
- `useOverrideColor: true` - Uses a single color for all water fill types instead of class-based colors
- `overrideColor` - The color to use for water fills when `useOverrideColor` is enabled
- `useOverrideColorWaterway: true` - Uses a single color for all waterway (line) types instead of class-based colors
- `overrideColorWaterway` - The color to use for waterways when `useOverrideColorWaterway` is enabled

**Runtime Control:**
Since layers remain in the style when transparent, you can toggle them at runtime:
```javascript
// Hide water fills
map.setPaintProperty('water-world', 'fill-opacity', 0);
map.setPaintProperty('water-world-mid', 'fill-opacity', 0);
map.setPaintProperty('water-us', 'fill-opacity', 0);

// Hide waterways
map.setPaintProperty('waterway-world', 'line-opacity', 0);
map.setPaintProperty('waterway-world-mid', 'line-opacity', 0);
map.setPaintProperty('waterway-us', 'line-opacity', 0);

// Show water fills
map.setPaintProperty('water-world', 'fill-opacity', 0.85);
map.setPaintProperty('water-world-mid', 'fill-opacity', 0.85);
map.setPaintProperty('water-us', 'fill-opacity', 0.85);

// Show waterways
map.setPaintProperty('waterway-world', 'line-opacity', 1.0);
map.setPaintProperty('waterway-world-mid', 'line-opacity', 1.0);
map.setPaintProperty('waterway-us', 'line-opacity', 1.0);
```

### Bathymetry

Bathymetry (ocean depth visualization) is configured separately in the `bathymetry` section of the theme. See [Bathymetry Documentation](./bathymetry.md) for complete details.

```typescript
bathymetry: {
  enabled: true,
  minZoom: 0,
  maxZoom: 7,
  opacity: {
    min: 0.7,
    max: 0.9,
  },
  colors: {
    shallow: "#0d3a5f",  // 0m depth
    shelf: "#0a2f4f",     // 200m depth
    slope: "#082544",     // 1000m depth
    deep1: "#061d3a",     // 2000m depth
    deep2: "#04152a",     // 4000m depth
    abyss: "#020d1a",     // 6000m depth
    trench: "#000a14",    // 10000m depth
  },
  depthOpacities: {
    shallow: 0.9,    // 0m - most opaque
    shelf: 0.86,     // 200m
    slope: 0.77,     // 1000m
    deep1: 0.63,     // 2000m
    deep2: 0.50,     // 4000m
    abyss: 0.36,     // 6000m
    trench: 0.23,    // 10000m - most transparent
  },
}
```

### Hillshade

Hillshade (terrain shading from elevation data) is configured separately in the `hillshade` section of the theme. See [Hillshade Documentation](./hillshade.md) for complete details.

```typescript
hillshade: {
  enabled: true,
  minZoom: 0,
  maxZoom: 12,
  opacity: 0.5,                    // Controls intensity via exaggeration
  illuminationDirection: 335,      // Light direction (0-360 degrees)
  illuminationAnchor: "viewport",  // "map" or "viewport"
  exaggeration: 0.5,               // Terrain relief intensity (0.0-1.0)
  shadowColor: "#000000",          // Shadow areas
  highlightColor: "#ffffff",       // Highlight areas
  accentColor: "#000000",          // Mid-tones
}
```

**Note:** Hillshade doesn't support direct opacity. Instead, opacity is simulated by scaling the exaggeration value (`effectiveExaggeration = exaggeration × opacity`).

### Ice

Ice (glaciers, ice sheets, and ice shelves) is configured separately in the `ice` section of the theme. See [Ice Documentation](./ice.md) for complete details.

```typescript
ice: {
  enabled: true,
  minZoom: 0,
  maxZoom: 6,
  opacity: {
    min: 0.7,
    max: 0.9,
  },
  glaciated: {
    color: "#e8f4f8",  // Glaciers and ice caps
    opacity: 0.9,
  },
  iceShelves: {
    color: "#d0e8f0",  // Ice shelves
    opacity: 0.9,
  },
  iceEdge: {
    color: "#a0c8d8",  // Ice shelf edges
    width: 0.5,
    opacity: 0.6,
  },
}
```

### Contours

Topographic contours (elevation lines) are configured separately in the `contours` section of the theme. See [Contours Documentation](./contours.md) for complete details.

```typescript
contours: {
  enabled: true,
  minZoom: 6,
  maxZoom: 12,
  major: {
    color: "#4a5568",      // Major contour color (500m intervals)
    width: {
      min: 0.5,            // Width at minZoom
      max: 1.5,            // Width at maxZoom
    },
    opacity: 0.6,
    minZoom: 6,
  },
  minor: {
    color: "#3a4455",      // Minor contour color (200m intervals)
    width: {
      min: 0.25,          // Width at minZoom
      max: 0.75,          // Width at maxZoom
    },
    opacity: 0.4,
    minZoom: 8,
  },
}
```

### Grid Lines

Grid lines (latitude and longitude reference lines) are configured separately in the `grid` section of the theme. See [Grid Documentation](./grid.md) for complete details.

```typescript
grid: {
  enabled: true,
  minZoom: 0,
  maxZoom: 10,
  latitude: {
    color: "#6b7280",      // Latitude line color
    width: {
      min: 1.0,            // Width at minZoom
      max: 1.5,            // Width at maxZoom
    },
    opacity: 0.6,
    interval: 10,          // Lines every 10 degrees
    label: {
      enabled: false,      // Enable coordinate labels
      color: "#9ca3af",    // Label text color
      size: {
        min: 10,           // Font size at minZoom
        max: 12,           // Font size at maxZoom
      },
      opacity: 0.8,
      minZoom: 2,          // Show labels starting at zoom 2
    },
  },
  longitude: {
    color: "#6b7280",      // Longitude line color
    width: {
      min: 1.0,            // Width at minZoom
      max: 1.5,            // Width at maxZoom
    },
    opacity: 0.6,
    interval: 10,          // Lines every 10 degrees
    label: {
      enabled: false,      // Enable coordinate labels
      color: "#9ca3af",    // Label text color
      size: {
        min: 10,           // Font size at minZoom
        max: 12,           // Font size at maxZoom
      },
      opacity: 0.8,
      minZoom: 2,          // Show labels starting at zoom 2
    },
  },
}
```

### Starfield

Starfield (background glow for globe projection) is configured separately in the `starfield` section of the theme.

```typescript
starfield: {
  /** Starfield glow colors */
  glowColors: {
    inner: "rgba(120, 180, 255, 0.9)",   // Inner glow (closest to globe)
    middle: "rgba(100, 150, 255, 0.7)",  // Middle glow
    outer: "rgba(70, 120, 255, 0.4)",    // Outer glow
    fade: "rgba(40, 80, 220, 0)"         // Fade color (outermost, typically transparent)
  },
  /** Number of stars in the starfield */
  starCount: 200,
  /** Glow intensity (0.0 to 1.0) */
  glowIntensity: 0.5,
  /** Glow size multiplier relative to globe */
  glowSizeMultiplier: 1.25,
  /** Glow blur multiplier */
  glowBlurMultiplier: 0.1,
}
```

**Note:** Starfield only appears when using globe projection. The glow colors create a radial gradient around the globe. For monochrome themes, use grayscale colors (e.g., `rgba(200, 200, 200, 0.9)`). The configuration is automatically included in `map-config.js` when you run `npm run build:styles`.

### Boundaries

```typescript
colors: {
  boundary: {
    country: "#3b82f6",   // Country borders
    state: "#284a7c",     // State/province borders
  },
  // ...
}
```

### Roads

```typescript
colors: {
  road: {
    motorway: "#3a4657",  // Highways/interstates
    trunk: "#374251",     // Major highways
    primary: "#34404f",   // Primary roads
    secondary: "#313b49", // Secondary roads
    tertiary: "#2d3744",  // Tertiary roads
    residential: "#2a333f", // Residential streets
    service: "#28313d",   // Service roads
    other: "#28313d",     // All other roads
    casing: "#0e131a",    // Road outline
    
    tunnel: {
      motorway: "#364252",
      // ... same structure as above
    },
    
    bridge: {
      motorway: "#3f4a5b",
      // ... same structure as above
      casing: "#0f1520",  // Bridge outline
    },
    
    tunnelCasing: "#0a0e13",
  },
  // ...
}
```

### Labels

```typescript
colors: {
  label: {
    place: {
      color: "#a8b8d0",   // City/country labels
      halo: "#0b0f14",    // Label outline
    },
    road: {
      major: { color: "#7a8ba3", opacity: 0.8 },
      secondary: { color: "#6b7a90", opacity: 0.7 },
      tertiary: { color: "#5d6b7d", opacity: 0.6 },
      other: { color: "#5d6b7d", opacity: 0.5 },
      halo: "#0b0f14",
    },
    water: {
      color: "#5b8db8",
      halo: "#0a2846",
    },
  },
  // ...
}
```

---

## Widths

Line widths use **zoom stops** - values at specific zoom levels that interpolate smoothly between them.

### Zoom Stops

```typescript
{ z0: 0.4, z6: 1.2, z10: 2.0, z15: 2.5 }
```

This means:
- At zoom 0: width is 0.4
- At zoom 6: width is 1.2
- At zoom 10: width is 2.0
- At zoom 15: width is 2.5
- Between zooms: values interpolate linearly

### Available Zoom Keys

`z0`, `z3`, `z6`, `z8`, `z10`, `z12`, `z14`, `z15`

### Boundary Widths

```typescript
widths: {
  boundary: {
    country: { z0: 0.4, z6: 1.2, z10: 2.0, z15: 2.5 },
    state: { z0: 0.2, z6: 0.8, z10: 1.2, z15: 1.5 },
  },
  // ...
}
```

### Road Widths

```typescript
widths: {
  road: {
    motorway: { z6: 0.9, z12: 2.0, z15: 3.0 },
    trunk: { z6: 0.8, z12: 1.7, z15: 2.5 },
    primary: { z6: 0.7, z12: 1.4, z15: 2.0 },
    secondary: { z6: 0.6, z12: 1.2, z15: 1.7 },
    tertiary: { z6: 0.5, z12: 1.0, z15: 1.4 },
    residential: { z6: 0.4, z12: 0.8, z15: 1.1 },
    service: { z6: 0.2, z12: 0.5, z15: 0.8 },
    default: { z6: 0.4, z12: 0.8, z15: 1.1 },
  },
  
  // Casing is slightly larger than road fill
  roadCasing: {
    motorway: { z8: 1.0, z12: 2.3, z14: 3.5 },
    // ...
  },
  // ...
}
```

### Other Widths

```typescript
widths: {
  water: {
    line: { z0: 0.1, z6: 0.4, z10: 0.8, z15: 1.0 },
  },
  tunnel: { z10: 0.4, z12: 1.0, z14: 1.6 },
  tunnelCasing: { z10: 0.5, z12: 1.2, z14: 2.0 },
  bridge: { z10: 0.5, z12: 1.1, z14: 1.8 },
  bridgeCasing: { z10: 0.6, z12: 1.3, z14: 2.2 },
  path: { z12: 0.2, z14: 0.6 },
  railway: { z10: 0.3, z14: 0.8 },
}
```

---

## Opacities

Control layer transparency (0 = invisible, 1 = fully opaque).

```typescript
opacities: {
  landcover: 0.6,       // Forest, grass overlays
  landuse: 0.6,         // Parks, residential areas
  building: 0.9,        // Building footprints
  
  boundary: {
    country: { z0: 0.25, z3: 0.25, z6: 0.75, z10: 0.8 }, // Zoom-based
    state: 0.6,         // Fixed value
    maritime: 0,        // Hidden (ocean boundaries)
  },
  
  tunnel: 0.7,          // Tunnel road casing
  
  label: {
    place: 0.75,        // City/country labels
    water: 0.9,         // Lake/ocean labels
    waterway: 0.85,     // River labels
  },
}
```

---

## Tips

### Use a Color Picker

For dark themes, colors in the `#0a0f14` to `#3a4657` range work well. Use a tool like:
- [Coolors](https://coolors.co/)
- [Adobe Color](https://color.adobe.com/)

### Test at Multiple Zoom Levels

Widths and opacities look different at different zooms. Test at:
- z2-3 (world view)
- z6-8 (country view)
- z12-15 (city view)

### Keep Contrast Readable

For labels, ensure sufficient contrast between text color and halo:
```typescript
label: {
  place: {
    color: "#a8b8d0",  // Light text
    halo: "#0b0f14",   // Dark halo
  },
}
```


