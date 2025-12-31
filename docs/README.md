# MapLibre Basemaps Documentation

A modular, TypeScript-based style system for creating MapLibre GL basemaps.

## Quick Links

- [Getting Started](./getting-started.md) - Setup and first build
- [Customizing Themes](./customizing-themes.md) - Modify colors, widths, opacities
- [Road Features](./roads.md) - Roads, bridges, tunnels, and highway shields
- [POI Features](./pois.md) - Point of Interest icons and labels (hospitals, airports, museums, etc.)
- [Bathymetry](./bathymetry.md) - Ocean depth visualization
- [Ice](./ice.md) - Glaciers, ice sheets, and ice shelves
- [Contours](./contours.md) - Topographic elevation lines
- [Sprites](./sprites.md) - POI icons and highway shields (global and per-basemap)
- [Creating a New Basemap](./creating-basemap.md) - Build your own basemap from scratch
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

# Build styles (generates style.json)
npm run build:styles

# Serve locally (requires a local server)
# Then open basemaps/dark-blue/index.html
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
│   └── dark-blue/
│       ├── styles/
│       │   ├── theme.ts       # ← EDIT THIS to customize
│       │   └── darkBlueStyle.ts
│       ├── style.json         # Generated output
│       ├── index.html         # Demo page
│       └── map.js             # Map initialization
│
├── scripts/
│   └── build-styles.ts        # Build script
│
└── docs/                      # This documentation
```


