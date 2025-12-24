# Road Features

This document explains how road features are handled in the basemap style system.

## Road Classification

Roads are classified by their OpenMapTiles `class` property:

| Class | Description | Examples |
|-------|-------------|----------|
| `motorway` | High-speed divided highways | Interstate highways (I-70, I-95) |
| `trunk` | Major highways, often divided | US highways, major state routes |
| `primary` | Major roads connecting cities | State highways, main routes |
| `secondary` | Roads connecting towns | County roads, secondary state routes |
| `tertiary` | Roads connecting villages/neighborhoods | Local connecting roads |
| `residential` | Neighborhood streets | Residential streets |
| `service` | Access roads | Driveways, parking lots, alleys |
| `parking_aisle` | Parking lot lanes | Internal parking structure roads |

### Road Subclasses

Some roads have a `subclass` property for finer control:
- `parking_aisle` - Lanes within parking lots
- `alley` - Back alleys
- `driveway` - Private driveways

---

## Road Styling

### Colors

Road colors are defined in the theme's `colors.road` section:

```typescript
road: {
  motorway: "#3a4657",    // Highways
  trunk: "#374251",       // Major highways
  primary: "#34404f",     // Primary roads
  secondary: "#313b49",   // Secondary roads
  tertiary: "#2d3744",    // Tertiary roads
  residential: "#2a333f", // Residential streets
  service: "#28313d",     // Service roads
  parkingAisle: "#252a35", // Parking aisles
  casing: "#0e131a",      // Road outline
}
```

### Widths

Road widths use zoom stops for smooth scaling:

```typescript
road: {
  motorway: { z6: 0.9, z8: 1.3, z10: 1.9, z12: 2.4, z14: 3.0, z15: 3.5 },
  trunk: { z6: 0.8, z8: 1.1, z10: 1.6, z12: 2.0, z14: 2.5, z15: 3.0 },
  primary: { z6: 0.6, z8: 0.9, z10: 1.3, z12: 1.7, z14: 2.2, z15: 2.5 },
  // ... etc
}
```

### Casings (Outlines)

Road casings create the border effect around roads:

```typescript
roadCasing: {
  motorway: { z6: 1.9, z8: 2.3, z10: 2.9, z12: 3.4, z14: 4.0, z15: 4.5 },
  // Casings are typically 1px wider than the road fill
}
```

---

## Layer Order

Roads are rendered in a specific order (bottom to top):

1. **Tunnel casings** - Outlines for underground roads
2. **Tunnel fills** - Underground road surfaces
3. **Road casings** - Outlines for surface roads
4. **Road fills** - Surface road colors
5. **Bridge casings** - Outlines for elevated roads
6. **Bridge fills** - Elevated road surfaces
7. **Road labels** - Street names
8. **Highway shields** - Route number markers

---

## Bridges and Tunnels

### Filtering

Bridges and tunnels are identified by the `brunnel` property:

```typescript
// Filter for bridges
["==", ["get", "brunnel"], "bridge"]

// Filter for tunnels
["==", ["get", "brunnel"], "tunnel"]

// Filter for regular roads (not bridges or tunnels)
["!", ["has", "brunnel"]]
```

### Styling Inheritance

By default, bridges and tunnels inherit road colors. To override:

```typescript
road: {
  // Override bridge colors
  bridge: {
    motorway: "#3f4a5b",
    casing: "#0f1520",
  },
  
  // Override tunnel colors
  tunnel: {
    motorway: "#364252",
  },
  tunnelCasing: "#0a0e13",
}
```

---

## Highway Shields

Highway shields display route numbers on major roads.

### Configuration

Each shield type has its own configuration in `theme.shields`:

```typescript
shields: {
  enabled: true,
  minZoom: 6,
  
  interstate: {
    enabled: true,
    sprite: "shield-interstate-custom",
    textColor: "#d0dae8",
    minZoom: 6,
    textPadding: [5, 5, 5, 5],    // [top, right, bottom, left]
    textSize: [6, 9, 14, 13],     // [minZoom, minSize, maxZoom, maxSize]
    textFont: ["Noto Sans Bold"],
    // Custom shield appearance
    upperBackground: "#1a2433",
    lowerBackground: "#141c28",
    strokeColor: "#3a4a5c",
    strokeWidth: 2,
  },
  
  usHighway: {
    enabled: true,
    sprite: "shield-ushighway-custom",
    textColor: "#d0dae8",
    textPadding: [5, 5, 5, 5],
    textSize: [6, 9, 14, 13],
    textFont: ["Noto Sans Bold"],
    background: "#182030",
    strokeColor: "#3a4a5c",
    strokeWidth: 2.5,
  },
  
  stateHighway: {
    enabled: true,
    sprite: "shield-state-custom",
    textColor: "#d0dae8",
    textPadding: [5, 5, 5, 5],
    textSize: [8, 8, 14, 12],
    textFont: ["Noto Sans Bold"],
    background: "#1a2433",
    strokeColor: "#3a4a5c",
    strokeWidth: 1.5,
  },
}
```

### Shield Properties

| Property | Type | Description |
|----------|------|-------------|
| `enabled` | boolean | Show/hide this shield type |
| `sprite` | string | Sprite name for the shield icon |
| `textColor` | string | Route number text color |
| `textPadding` | [t,r,b,l] | Padding around text within shield |
| `textSize` | [minZ,minS,maxZ,maxS] | Font size interpolation |
| `textFont` | string[] | Font family for route numbers |
| `minZoom` | number | Minimum zoom to display |

### Custom Shield Appearance

Custom shields (`shield-*-custom`) support additional properties:

**Interstate (two-tone):**
- `upperBackground` - Top section color
- `lowerBackground` - Bottom section color
- `strokeColor` - Border color
- `strokeWidth` - Border thickness

**US Highway & State:**
- `background` - Fill color
- `strokeColor` - Border color
- `strokeWidth` - Border thickness

### Building Shields

After modifying shield colors in `theme.ts`, rebuild:

```bash
npx tsx scripts/build-shields.ts dark-blue && npm run build:styles
```

**Note:** For detailed information on sprite architecture, building sprites, and how shields are generated, see [Sprites Documentation](./sprites.md).

---

## Road Labels

### Label Hierarchy

Road labels use different styles based on road class:

```typescript
label: {
  road: {
    major: { color: "#7a8ba3", opacity: 0.8 },    // Motorway, trunk, primary
    secondary: { color: "#6b7a90", opacity: 0.7 }, // Secondary
    tertiary: { color: "#5d6b7d", opacity: 0.6 },  // Tertiary
    other: { color: "#5d6b7d", opacity: 0.5 },     // Residential, service
    halo: "#0b0f14",
  },
}
```

### Label Placement

Road labels use `symbol-placement: line` to follow road curves.

---

## Real-World Scaling

For high zoom levels (16+), roads can scale proportionally to real-world sizes:

```typescript
settings: {
  realWorldScale: true,      // Enable proportional scaling
  realWorldScaleMinZoom: 16, // Zoom level where scaling begins
}
```

When enabled, roads double in pixel width with each zoom level, matching the map's scale so roads appear proportional to buildings.

---

## Data Source

Road features come from the `transportation` layer in OpenMapTiles schema:

```typescript
{
  source: "basemap",
  "source-layer": "transportation",
}
```

### Key Properties

| Property | Description |
|----------|-------------|
| `class` | Road classification (motorway, primary, etc.) |
| `subclass` | Detailed classification (parking_aisle, alley) |
| `brunnel` | Bridge/tunnel indicator |
| `surface` | Road surface type |
| `oneway` | One-way indicator |
| `ramp` | Highway ramp indicator |

### Road Names

Road names come from the `transportation_name` layer:

| Property | Description |
|----------|-------------|
| `name` | Road name |
| `ref` | Route number (I-70, US-1) |
| `network` | Route network (us-interstate, us-highway) |

