# Creating a New Basemap

This guide walks through creating a new basemap from scratch.

## Step 1: Copy the Dark Blue Basemap

```bash
# Create new basemap directory
cp -r basemaps/dark-blue basemaps/my-basemap
```

## Step 2: Rename Files

```bash
cd basemaps/my-basemap/styles

# Rename the style file
mv darkBlueStyle.ts myBasemapStyle.ts
```

## Step 3: Update theme.ts

Edit `basemaps/my-basemap/styles/theme.ts`:

```typescript
/**
 * My Basemap Theme
 */

import { 
  fonts, 
  type Theme, 
  type ThemeColors, 
  type ThemeWidths, 
  type ThemeOpacities 
} from "../../../shared/styles/theme.js";

// ============================================================================
// COLORS - Customize these!
// ============================================================================

export const myColors: ThemeColors = {
  background: "#f5f5f5",  // Light gray background
  
  land: {
    wood: "#c8e6c9",      // Light green
    grass: "#e8f5e9",
    scrub: "#e8f5e9",
    cropland: "#fff9c4",  // Light yellow
    default: "#f5f5f5",
  },
  
  // ... continue customizing all colors
};

// ============================================================================
// WIDTHS
// ============================================================================

export const myWidths: ThemeWidths = {
  // ... customize widths
};

// ============================================================================
// OPACITIES
// ============================================================================

export const myOpacities: ThemeOpacities = {
  // ... customize opacities
};

// ============================================================================
// COMPLETE THEME
// ============================================================================

export const myTheme: Theme = {
  name: "My Custom Basemap",
  fonts,
  colors: myColors,
  widths: myWidths,
  opacities: myOpacities,
};
```

## Step 4: Update the Style Function

Edit `basemaps/my-basemap/styles/myBasemapStyle.ts`:

```typescript
/**
 * My Basemap Style
 */

import type { StyleSpecification } from "maplibre-gl";
import { createBasemapStyle } from "../../../shared/styles/layers/index.js";
import { type BaseStyleConfig, defaultConfig } from "../../../shared/styles/baseStyle.js";
import { myTheme } from "./theme.js";

export function createMyBasemapStyle(config: BaseStyleConfig = defaultConfig): StyleSpecification {
  return createBasemapStyle(myTheme, config);
}
```

## Step 5: Update index.ts

Edit `basemaps/my-basemap/styles/index.ts`:

```typescript
/**
 * My Basemap exports
 */

export { createMyBasemapStyle } from "./myBasemapStyle.js";
export { myTheme, myColors } from "./theme.js";
export type { Theme, ThemeColors } from "../../../shared/styles/theme.js";
```

## Step 6: Add to Build Script

Edit `scripts/build-styles.ts`:

```typescript
import { createDarkBlueStyle } from "../basemaps/dark-blue/styles/darkBlueStyle.js";
import { createMyBasemapStyle } from "../basemaps/my-basemap/styles/myBasemapStyle.js";  // Add this

const stylesToBuild: StyleBuild[] = [
  {
    name: "dark-blue",
    outputPath: "basemaps/dark-blue/style.generated.json",
    generator: createDarkBlueStyle,
  },
  // Add your basemap
  {
    name: "my-basemap",
    outputPath: "basemaps/my-basemap/style.generated.json",
    generator: createMyBasemapStyle,
  },
];
```

## Step 7: Build and Test

```bash
# Build all styles
npm run build:styles

# Start server
python3 -m http.server 8080

# Open browser
open http://localhost:8080/basemaps/my-basemap/
```

---

## Complete Example: Light Theme

Here's a complete light theme configuration:

```typescript
// basemaps/light/styles/theme.ts

export const lightColors: ThemeColors = {
  background: "#f8f9fa",
  
  land: {
    wood: "#c8e6c9",
    grass: "#e8f5e9",
    scrub: "#dcedc8",
    cropland: "#fff9c4",
    default: "#f5f5f5",
  },
  
  landuse: {
    park: "#c8e6c9",
    cemetery: "#e0e0e0",
    pitch: "#aed581",
    stadium: "#aed581",
    residential: "#fafafa",
    default: "#fafafa",
  },
  
  water: {
    fill: "#bbdefb",
    line: "#64b5f6",
    labelColor: "#1976d2",
    labelHalo: "#ffffff",
  },
  
  boundary: {
    country: "#9e9e9e",
    state: "#bdbdbd",
  },
  
  road: {
    motorway: "#ffcc80",
    trunk: "#ffe0b2",
    primary: "#ffffff",
    secondary: "#ffffff",
    tertiary: "#ffffff",
    residential: "#ffffff",
    service: "#f5f5f5",
    other: "#eeeeee",
    casing: "#bdbdbd",
    tunnel: {
      motorway: "#ffe0b2",
      trunk: "#fff3e0",
      primary: "#fafafa",
      secondary: "#fafafa",
      tertiary: "#f5f5f5",
      residential: "#f5f5f5",
      service: "#eeeeee",
      default: "#e0e0e0",
    },
    bridge: {
      motorway: "#ffb74d",
      trunk: "#ffcc80",
      primary: "#ffffff",
      secondary: "#ffffff",
      tertiary: "#ffffff",
      residential: "#ffffff",
      default: "#fafafa",
      casing: "#9e9e9e",
    },
    tunnelCasing: "#e0e0e0",
  },
  
  path: "#e0e0e0",
  railway: "#bdbdbd",
  
  building: {
    fill: "#e0e0e0",
    outline: "#bdbdbd",
  },
  
  label: {
    place: {
      color: "#424242",
      halo: "#ffffff",
    },
    road: {
      major: { color: "#616161", opacity: 0.9 },
      secondary: { color: "#757575", opacity: 0.8 },
      tertiary: { color: "#9e9e9e", opacity: 0.7 },
      other: { color: "#9e9e9e", opacity: 0.6 },
      halo: "#ffffff",
    },
    water: {
      color: "#1976d2",
      halo: "#ffffff",
    },
  },
};

export const lightWidths: ThemeWidths = {
  boundary: {
    country: { z0: 0.5, z6: 1.5, z10: 2.5, z15: 3.0 },
    state: { z0: 0.3, z6: 1.0, z10: 1.5, z15: 2.0 },
  },
  water: {
    line: { z0: 0.2, z6: 0.5, z10: 1.0, z15: 1.5 },
  },
  road: {
    motorway: { z6: 1.2, z12: 2.5, z15: 4.0 },
    trunk: { z6: 1.0, z12: 2.0, z15: 3.0 },
    primary: { z6: 0.8, z12: 1.5, z15: 2.5 },
    secondary: { z6: 0.6, z12: 1.2, z15: 2.0 },
    tertiary: { z6: 0.5, z12: 1.0, z15: 1.5 },
    residential: { z6: 0.4, z12: 0.8, z15: 1.2 },
    service: { z6: 0.3, z12: 0.6, z15: 1.0 },
    default: { z6: 0.4, z12: 0.8, z15: 1.2 },
  },
  roadCasing: {
    motorway: { z8: 1.4, z12: 2.8, z14: 4.5 },
    trunk: { z8: 1.2, z12: 2.3, z14: 3.5 },
    primary: { z8: 1.0, z12: 1.8, z14: 3.0 },
    secondary: { z8: 0.8, z12: 1.5, z14: 2.5 },
    tertiary: { z8: 0.7, z12: 1.3, z14: 2.0 },
    residential: { z8: 0.6, z12: 1.1, z14: 1.7 },
    service: { z8: 0.5, z12: 0.9, z14: 1.5 },
    default: { z8: 0.6, z12: 1.1, z14: 1.7 },
  },
  tunnel: { z10: 0.5, z12: 1.2, z14: 2.0 },
  tunnelCasing: { z10: 0.7, z12: 1.5, z14: 2.5 },
  bridge: { z10: 0.6, z12: 1.3, z14: 2.2 },
  bridgeCasing: { z10: 0.8, z12: 1.6, z14: 2.8 },
  path: { z12: 0.3, z14: 0.8 },
  railway: { z10: 0.4, z14: 1.0 },
};

export const lightOpacities: ThemeOpacities = {
  landcover: 0.7,
  landuse: 0.7,
  building: 1.0,
  boundary: {
    country: { z0: 0.3, z3: 0.4, z6: 0.6, z10: 0.8 },
    state: 0.5,
    maritime: 0,
  },
  tunnel: 0.6,
  label: {
    place: 0.9,
    water: 1.0,
    waterway: 0.9,
  },
};

export const lightTheme: Theme = {
  name: "Light Basemap",
  fonts,
  colors: lightColors,
  widths: lightWidths,
  opacities: lightOpacities,
};
```


