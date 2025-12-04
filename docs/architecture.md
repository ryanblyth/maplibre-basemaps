# Architecture

This document explains how the style system is organized and how the pieces fit together.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         theme.ts                             │
│     (colors, widths, opacities - per basemap)               │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Layer Factory Functions                   │
│  (shared/styles/layers/*.ts - shared across all basemaps)   │
│                                                              │
│   createBackgroundLayers(theme) → LayerSpecification[]      │
│   createWaterLayers(theme)      → LayerSpecification[]      │
│   createRoadLayers(theme)       → LayerSpecification[]      │
│   ...                                                        │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   createBasemapStyle()                       │
│              (combines theme + layers + sources)             │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     build-styles.ts                          │
│            (outputs static JSON style files)                 │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       style.json                             │
│        (MapLibre GL compatible style specification)          │
└─────────────────────────────────────────────────────────────┘
```

## Key Concepts

### Theme Object

The theme is a TypeScript object that defines **all visual properties**:

```typescript
interface Theme {
  name: string;
  fonts: FontStack;
  colors: ThemeColors;    // All color values
  widths: ThemeWidths;    // All line width values
  opacities: ThemeOpacities; // All opacity values
}
```

Each basemap has its own theme file in `basemaps/<name>/styles/theme.ts`.

### Layer Factory Functions

Layer factories are **pure functions** that:
- Accept a `Theme` object
- Return an array of `LayerSpecification` objects

```typescript
// shared/styles/layers/water.ts
export function createWaterLayers(theme: Theme): LayerSpecification[] {
  return [
    {
      id: "water-fill",
      type: "fill",
      paint: { "fill-color": theme.colors.water.fill }
    },
    // ...
  ];
}
```

These functions live in `shared/styles/layers/` and are **shared by all basemaps**.

### Expression Generators

MapLibre uses expressions for dynamic styling. Expression generators create these from theme values:

```typescript
// shared/styles/layers/expressions.ts

// Creates: ["interpolate", ["linear"], ["zoom"], 0, 0.4, 6, 1.2, 10, 2.0]
export function zoomWidthExpr(widths: ZoomWidths): unknown {
  // ...
}

// Creates: ["match", ["get", "class"], "wood", "#0f141b", "grass", "#10161e", ...]
export function landcoverFillColor(c: ThemeColors): unknown {
  // ...
}
```

### Style Composition

The main style function composes everything:

```typescript
// shared/styles/layers/index.ts
export function createBasemapStyle(theme: Theme, config: BaseStyleConfig): StyleSpecification {
  const base = createBaseStyle(config);       // Version, glyphs, sprites
  const sources = createBasemapSources(config); // Tile sources
  const layers = createAllLayers(theme);       // All layers from theme
  
  return {
    ...base,
    name: theme.name,
    sources: { ...base.sources, ...sources },
    layers,
  };
}
```

---

## File Organization

### Shared (used by all basemaps)

```
shared/styles/
├── theme.ts              # Shared types (Theme, ThemeColors, etc.)
├── baseStyle.ts          # Base utilities (text fields, config)
├── index.ts              # Main exports
└── layers/
    ├── index.ts          # createBasemapStyle(), createAllLayers()
    ├── sources.ts        # Tile source definitions
    ├── expressions.ts    # MapLibre expression generators
    ├── background.ts     # Background layer
    ├── land.ts           # Landcover, landuse layers
    ├── water.ts          # Water fill/line layers
    ├── boundaries.ts     # Country/state boundary layers
    ├── roads.ts          # Road, tunnel, bridge layers
    └── labels/
        ├── index.ts      # Label exports
        ├── road.ts       # Road name labels
        ├── water.ts      # Water body/waterway labels
        └── place.ts      # City/country/state labels
```

### Basemap-Specific

```
basemaps/dark-blue/
├── styles/
│   ├── theme.ts          # Colors, widths, opacities for dark-blue
│   ├── darkBlueStyle.ts  # createDarkBlueStyle() function
│   └── index.ts          # Exports
├── style.json            # Generated output
├── style.generated.json  # Generated output (backup)
├── index.html            # Demo page
└── map.js                # Map initialization
```

---

## Layer Ordering

Layers are rendered in order (bottom to top):

1. **Background** - Map background color
2. **Landcover** - Forest, grass, scrub
3. **Water** - Ocean, lakes, rivers
4. **Boundaries** - Country/state borders
5. **Roads (world)** - Low-zoom road network
6. **Roads (detail)** - High-zoom roads, tunnels, bridges
7. **US Overlays** - US-specific detail layers
8. **Labels** - Road names, water names, place names

This order ensures proper visual layering (e.g., labels on top of roads).

---

## Data Sources

The system uses PMTiles vector tile sources:

| Source | Zoom Range | Coverage |
|--------|------------|----------|
| `world_low` | 0-6 | Global |
| `world_mid` | 6-10 | Global |
| `world_labels` | 0-10 | Global labels |
| `us_high` | 6-15 | United States |

Sources are defined in `shared/styles/layers/sources.ts` and can be customized via the `BaseStyleConfig`.

---

## Build Process

1. **TypeScript Compilation** - `tsx` runs the build script
2. **Style Generation** - `createDarkBlueStyle()` is called
3. **JSON Serialization** - Style object is written as JSON
4. **File Copy** - `style.generated.json` is copied to `style.json`

```bash
npm run build:styles
# → basemaps/dark-blue/style.generated.json
# → basemaps/dark-blue/style.json (copy)
```

---

## Extending the System

### Adding a New Layer Type

1. Create `shared/styles/layers/myLayer.ts`:

```typescript
import type { LayerSpecification } from "maplibre-gl";
import type { Theme } from "../theme.js";

export function createMyLayers(theme: Theme): LayerSpecification[] {
  return [
    // Layer definitions using theme values
  ];
}
```

2. Export from `shared/styles/layers/index.ts`

3. Add to `createAllLayers()` function

### Adding a New Theme Property

1. Update `shared/styles/theme.ts` with new interface fields
2. Update `basemaps/<name>/styles/theme.ts` with values
3. Update layer functions to use the new property
4. Rebuild: `npm run build:styles`

