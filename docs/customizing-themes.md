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
  shields: myShields,     // Highway shields (optional)
  pois: myPOIs,          // Point of Interest config (optional)
  bathymetry: myBathymetry, // Ocean depth visualization (optional)
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

### Water

```typescript
colors: {
  water: {
    fill: "#0a2846",      // Water body fill
    line: "#103457",      // Waterway stroke
    labelColor: "#5b8db8", // Water label text
    labelHalo: "#0a2846", // Water label halo
  },
  // ...
}
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


