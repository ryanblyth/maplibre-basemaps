# Creating a New Basemap

This guide walks through creating a new basemap from an existing template.

## Quick Start (Recommended)

Use the automated scaffolding script to create a new basemap:

```bash
npm run create:basemap -- <basemap-name>
```

For example, to create a basemap called "ocean-light":

```bash
npm run create:basemap -- ocean-light
```

This will:

1. Copy the `dark-blue` template to `basemaps/ocean-light/`
2. Rename all files appropriately (e.g., `darkBlueStyle.ts` → `oceanLightStyle.ts`)
3. Transform all variable names and references
4. Register the new basemap in the build system

After running the script, you'll have a fully functional basemap ready to customize.

### Next Steps After Scaffolding

1. **Customize your theme** - Edit `basemaps/<name>/styles/theme.ts` to change colors, widths, opacities, and feature settings

2. **Build the styles**:
   ```bash
   npm run build:styles
   ```

3. **Preview your basemap**:
   ```bash
   node serve.js
   # Open: http://localhost:8080/basemaps/<name>/preview.html
   ```

4. **(Optional) Customize shield sprites**:
   ```bash
   npx tsx scripts/build-shields.ts <name>
   ```

---

## What Gets Created

The scaffolding script creates the following structure:

```
basemaps/<name>/
├── styles/
│   ├── theme.ts           # Theme configuration (colors, widths, features)
│   ├── <name>Style.ts     # Style generator function
│   └── index.ts           # Module exports
├── sprites/               # Shield sprites (copied from template)
│   ├── basemap.json
│   ├── basemap.png
│   ├── basemap@2x.json
│   └── basemap@2x.png
├── preview.html           # Preview page
├── map.js                 # Map initialization script
├── style.json             # Generated style (after build)
└── style.generated.json   # Generated style (after build)
```

---

## Naming Conventions

The script expects a **kebab-case** name (lowercase with hyphens):

| Input | Variable Prefix | Function Name | Display Name |
|-------|-----------------|---------------|--------------|
| `dark-gray` | `darkGray` | `createDarkGrayStyle` | "Dark Gray" |
| `ocean-light` | `oceanLight` | `createOceanLightStyle` | "Ocean Light" |
| `midnight` | `midnight` | `createMidnightStyle` | "Midnight" |

---

## Customizing the Theme

The main file to edit is `basemaps/<name>/styles/theme.ts`. This file contains all configurable values organized into sections:

### Core Sections

- **Settings** - Projection, zoom limits, scaling behavior
- **Colors** - All fills, strokes, and label colors
- **Widths** - Line widths at different zoom levels
- **Opacities** - Layer transparency values

### Feature Sections

- **Shields** - Highway shield appearance
- **POIs** - Point of interest icons and labels
- **Bathymetry** - Ocean depth visualization
- **Hillshade** - Terrain shading
- **Ice** - Glaciers and ice sheets
- **Contours** - Elevation lines
- **Grid** - Lat/lon reference lines
- **Buildings** - Building fill and height colors
- **Aeroway** - Airport features
- **Starfield** - Globe projection background glow (optional)

See [Customizing Themes](./customizing-themes.md) for detailed documentation on each section.

---

## Manual Setup (Reference)

If you prefer to create a basemap manually, follow these steps:

### Step 1: Copy the Template

```bash
cp -r basemaps/dark-blue basemaps/my-basemap
```

### Step 2: Rename Files

```bash
cd basemaps/my-basemap/styles
mv darkBlueStyle.ts myBasemapStyle.ts
```

### Step 3: Update theme.ts

Edit `basemaps/my-basemap/styles/theme.ts` and rename all exports:

```typescript
// Change these:
export const darkBlueSettings → export const myBasemapSettings
export const darkBlueColors → export const myBasemapColors
export const darkBlueWidths → export const myBasemapWidths
// ... etc for all exports

export const darkBlueTheme → export const myBasemapTheme
```

Update the theme name:

```typescript
export const myBasemapTheme: Theme = {
  name: "My Basemap",  // Update display name
  // ...
};
```

### Step 4: Update the Style Function

Edit `basemaps/my-basemap/styles/myBasemapStyle.ts`:

```typescript
import { myBasemapTheme } from "./theme.js";

export function createMyBasemapStyle(config: BaseStyleConfig = defaultConfig): StyleSpecification {
  const basemapConfig: BaseStyleConfig = {
    ...config,
    spritePath: 'basemaps/my-basemap/sprites/basemap',
  };
  return createBasemapStyle(myBasemapTheme, basemapConfig);
}
```

### Step 5: Update index.ts

Edit `basemaps/my-basemap/styles/index.ts`:

```typescript
export { createMyBasemapStyle } from "./myBasemapStyle.js";
export { myBasemapTheme, myBasemapColors } from "./theme.js";
export type { Theme, ThemeColors } from "../../../shared/styles/theme.js";
```

### Step 6: Register in Build Script

Edit `scripts/build-styles.ts`:

```typescript
import { createMyBasemapStyle } from "../basemaps/my-basemap/styles/myBasemapStyle.js";

const stylesToBuild: StyleBuild[] = [
  // ... existing entries
  {
    name: "my-basemap",
    outputPath: "basemaps/my-basemap/style.generated.json",
    generator: createMyBasemapStyle,
  },
];
```

### Step 7: Clean Up Generated Files

Remove old generated files:

```bash
rm basemaps/my-basemap/style.json
rm basemaps/my-basemap/style.generated.json
rm basemaps/my-basemap/map-config.js  # if present
```

### Step 8: Build and Test

```bash
npm run build:styles
node serve.js
# Open: http://localhost:8080/basemaps/my-basemap/preview.html
```

---

## Example: Light Theme Colors

Here's an example of light theme colors to get you started:

```typescript
export const lightColors: ThemeColors = {
  background: "#f8f9fa",
  
  land: {
    wood: "#c8e6c9",
    grass: "#e8f5e9",
    scrub: "#dcedc8",
    cropland: "#fff9c4",
    default: "#f5f5f5",
  },
  
  water: {
    fill: "#bbdefb",
    line: "#64b5f6",
    labelColor: "#1976d2",
    labelHalo: "#ffffff",
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
  },
  
  label: {
    place: {
      color: "#424242",
      halo: "#ffffff",
    },
    // ...
  },
};
```

See [Customizing Themes](./customizing-themes.md) for complete configuration options.
