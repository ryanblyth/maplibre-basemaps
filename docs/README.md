# MapLibre Basemaps Documentation

A modular, TypeScript-based style system for creating MapLibre GL basemaps.

## Quick Links

- [Getting Started](./getting-started.md) - Setup and first build
- [Customizing Themes](./customizing-themes.md) - Modify colors, widths, opacities
- [Road Features](./roads.md) - Roads, bridges, tunnels, and highway shields
- [POI Features](./pois.md) - Point of Interest icons and labels (hospitals, airports, museums, etc.)
- [Bathymetry](./bathymetry.md) - Ocean depth visualization
- [Hillshade](./hillshade.md) - Terrain shading from elevation data
- [Ice](./ice.md) - Glaciers, ice sheets, and ice shelves
- [Contours](./contours.md) - Topographic elevation lines
- [Grid Lines](./grid.md) - Latitude and longitude reference lines
- [Sprites](./sprites.md) - POI icons and highway shields (global and per-basemap)
- [Creating a New Basemap](./creating-basemap.md) - Scaffold a new basemap with `npm run create:basemap`
- [Exporting Basemaps](./exporting-basemaps.md) - Export basemap bundles for use in other codebases
- [Map Elements Cheat Sheet](./MAP_ELEMENTS.md) - Quick reference for MapLibre concepts

## Overview

This project provides a **theme-based system** for creating MapLibre basemaps. Instead of editing raw JSON, you configure TypeScript objects that define:

- **Colors** - All fills, strokes, and label colors
- **Widths** - Line widths for roads, boundaries, water at each zoom level
- **Opacities** - Transparency values for layers

The build system then generates static JSON style files that can be used with:
- MapLibre GL JS
- Static file hosting
- Maputnik style editor

## Key Features

✅ **Type-safe** - TypeScript interfaces catch errors before build  
✅ **Centralized config** - One file controls all visual properties  
✅ **Reusable** - Shared layer logic, only colors/widths change per basemap  
✅ **Compatible** - Outputs standard MapLibre style JSON  

## Quick Start

```bash
# Install dependencies
npm install

# Build styles (generates style.json for all basemaps)
npm run build:styles

# Create a new basemap from template
npm run create:basemap -- my-basemap

# Serve locally
node serve.js
# Open: http://localhost:8080/basemaps/dark-blue/preview.html
```

## File Structure

```
maplibre-basemaps/
├── shared/
│   └── styles/
│       ├── theme.ts           # Shared types & fonts
│       ├── baseStyle.ts       # Base style utilities
│       └── layers/            # Layer factory functions
│           ├── background.ts
│           ├── land.ts
│           ├── water.ts
│           ├── boundaries.ts
│           ├── roads.ts
│           └── labels/
│               ├── road.ts
│               ├── water.ts
│               └── place.ts
│
├── basemaps/
│   ├── dark-blue/             # Dark blue theme (template)
│   │   ├── styles/
│   │   │   ├── theme.ts       # ← EDIT THIS to customize
│   │   │   └── darkBlueStyle.ts
│   │   ├── style.json         # Generated output
│   │   ├── preview.html       # Preview page
│   │   └── map.js             # Map initialization
│   │
│   └── dark-gray/             # Dark gray theme
│       ├── styles/
│       │   ├── theme.ts
│       │   └── darkGrayStyle.ts
│       └── ...
│
├── scripts/
│   ├── build-styles.ts        # Build all basemap styles
│   └── create-basemap.ts      # Scaffold new basemaps
│
└── docs/                      # This documentation
```


