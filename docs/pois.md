# POI (Point of Interest) Features

This document explains how POI (Point of Interest) icons and labels are configured and displayed on the map.

## Overview

POIs are icons and labels that appear on the map to mark important locations like hospitals, airports, museums, and more. The system provides:

- **Configurable visibility** - Enable/disable each POI type individually
- **Zoom-based display** - Control when each POI type appears
- **Ranking system** - Show major POIs first, then more as you zoom in
- **Multiple data sources** - Queries multiple PMTiles sources for comprehensive coverage

## Available POI Types

The system supports the following POI types:

| POI Type | Icon | Description | Default Min Zoom |
|----------|------|-------------|------------------|
| `airport` | ✈️ | Commercial airports | 12 |
| `airfield` | 🛩️ | Small airfields/private airstrips | 12 |
| `hospital` | 🏥 | Major hospitals only (excludes clinics) | 12 |
| `museum` | 🏛️ | Museums and galleries | 12 |
| `zoo` | 🦁 | Zoos and wildlife parks | 12 |
| `stadium` | 🏟️ | Sports stadiums and arenas | 12 |
| `park` | 🌲 | National parks, national monuments, state parks | 12 |
| `rail` | 🚂 | Railway stations | 14 |
| `school` | 🎓 | Colleges and universities (including community colleges) | 14 |

## Configuration

### Global POI Settings

POI configuration is defined in each basemap's `theme.ts` file:

```typescript
// basemaps/dark-blue/styles/theme.ts
export const darkBluePOIs: ThemePOIs = {
  /** Whether to show POIs at all */
  enabled: true,
  
  /** Global minimum zoom for all POIs */
  minZoom: 12,
  
  /** Individual POI type settings */
  airport: {
    enabled: true,
    minZoom: 12,
  },
  airfield: {
    enabled: true,
    minZoom: 12,
  },
  hospital: {
    enabled: true,
    minZoom: 12,
  },
  // ... etc for each POI type
};
```

### Enabling/Disabling POIs

To disable a specific POI type:

```typescript
hospital: {
  enabled: false,  // Disable hospitals
  minZoom: 12,
},
```

To disable all POIs:

```typescript
enabled: false,  // Disable all POIs globally
```

### Per-Type Zoom Levels

Each POI type can have its own minimum zoom level:

```typescript
rail: {
  enabled: true,
  minZoom: 14,  // Railway stations appear at zoom 14+
},
```

If not specified, POI types use the global `minZoom` setting.

## Ranking System

Some POI types use a **ranking system** to show more important locations first:

### Hospitals

- **Rank 1** (or no rank): Major hospitals at zoom 12+
- **Rank 2**: Additional hospitals at zoom 14.5+
- **Rank 3+**: Smaller hospitals at zoom 15+

Only actual hospitals are shown (not clinics or doctors' offices).

### Museums

- **Rank 1** (or no rank): Major museums at zoom 14+
- **Rank 2**: Additional museums at zoom 14.5+
- **Rank 3+**: Smaller museums at zoom 15+

### Railway Stations

- **Rank 1** (or no rank): Major stations at zoom 14+
- **Rank 2**: Additional stations at zoom 14.5+
- **Rank 3+**: Smaller stations at zoom 15+

### Colleges/Universities

- **Rank 1** (or no rank): Major institutions at zoom 14+
- **Rank 2**: Additional institutions at zoom 14.5+
- **Rank 3+**: Smaller institutions at zoom 15+

Only colleges and universities are shown (not K-12 schools).

## Data Sources

POIs are queried from multiple PMTiles sources in order of priority:

1. **`poi_us`** - Dedicated POI source (zoom 12-15)
2. **`us_high`** - US high detail tiles (fallback)
3. **`world_mid`** - World mid detail tiles (fallback)
4. **`world_low`** - World low detail tiles (fallback)

### Source Layers

POIs are queried from different source layers depending on the POI type:

- **`poi` layer** - Most POI types (airport, airfield, hospital, museum, zoo, stadium, rail, school)
- **`aerodrome_label` layer** - **Main airport labels** (from `us_high` source / `us_z0-15.pmtiles`)
  - **This is the primary source for airport icons and labels**
  - Only exists in `us_high` PMTiles, not in other sources
  - Layer ID: `aerodrome-label-airport-us_high`
  - Created separately in `shared/styles/layers/labels/poi.ts` (outside the main source loop)
  - Shows airport icons with names at zoom 12+
- **`place` layer** - Airports stored as places (fallback)
- **`park` layer** - Park labels (national/state parks only)

## POI Styling

POI icons and labels are styled via the theme's color configuration:

```typescript
// basemaps/dark-blue/styles/theme.ts
export const darkBlueColors: ThemeColors = {
  label: {
    poi: {
      iconColor: "#7a8ba3",      // Icon color (SDF icons)
      iconSize: 0.8,             // Icon size multiplier
      textColor: "#a8b8d0",      // Label text color
      textHalo: "#0b0f14",       // Text halo (outline) color
      textHaloWidth: 1.5,        // Halo width in pixels
    },
  },
};
```

### Icon Properties

- **SDF Icons** - POI icons are SDF (Signed Distance Field) sprites, allowing color changes at runtime
- **Icon Size** - Controlled via `iconSize` in theme (default: 0.8)
- **Icon Color** - Controlled via `iconColor` in theme
- **Icon Opacity** - Fixed at 0.9 for all POIs

### Label Properties

- **Text Size** - Interpolates from 10px at zoom 12 to 14px at zoom 16
- **Text Offset** - Labels appear 1.2 units below icons
- **Text Anchor** - Labels are anchored at the top
- **Text Halo** - Dark halo for contrast against backgrounds

## POI Icons

POI icons are stored in `shared/assets/sprites/icons/` and include:

- `airport.svg` - Airport icon
- `airfield.svg` - Airfield icon
- `hospital.svg` - Hospital icon
- `museum.svg` - Museum icon
- `park-alt1.svg` - Park icon
- `rail.svg` - Railway station icon
- `college.svg` - School/college icon
- `stadium.svg` - Stadium icon
- `zoo.svg` - Zoo icon

These icons are built into the sprite sheet during the sprite rebuild process. See [Sprites Documentation](./sprites.md) for details.

## Adding New POI Types

To add a new POI type:

1. **Add the icon** to `shared/assets/sprites/icons/`:
   ```bash
   # Add your-icon.svg to shared/assets/sprites/icons/
   ```

2. **Update the POI icons list** in `scripts/rebuild-sprites.ts`:
   ```typescript
   const poiIcons: Array<{ spriteName: string; svgFile: string }> = [
     // ... existing icons
     { spriteName: 'your-poi', svgFile: 'your-icon.svg' },
   ];
   ```

3. **Add POI type to theme** in `shared/styles/theme.ts`:
   ```typescript
   export interface ThemePOIs {
     // ... existing types
     yourPoi?: {
       enabled: boolean;
       minZoom?: number;
     };
   }
   ```

4. **Add configuration** in `basemaps/dark-blue/styles/theme.ts`:
   ```typescript
   export const darkBluePOIs: ThemePOIs = {
     // ... existing POIs
     yourPoi: {
       enabled: true,
       minZoom: 12,
     },
   };
   ```

5. **Create POI layer** in `shared/styles/layers/labels/poi.ts`:
   ```typescript
   // Your POI POIs
   if (isPOIEnabled('yourPoi')) {
     const yourPoiMinZoom = poiThemeConfig.yourPoi?.minZoom || source.minZoom;
     layers.push({
       id: `poi-your-poi-${source.name}`,
       type: "symbol",
       source: source.name,
       "source-layer": "poi",
       minzoom: yourPoiMinZoom,
       filter: [
         "all",
         ["has", "name"],
         // Your filter conditions
         ["==", ["get", "class"], "your-class"],
       ],
       layout: {
         ...baseLayout,
         "icon-image": "your-poi",
       },
       paint: poiPaint,
     });
   }
   ```

6. **Rebuild sprites:**
   ```bash
   npx tsx scripts/rebuild-sprites.ts dark-blue
   ```

7. **Rebuild styles:**
   ```bash
   npm run build:styles
   ```

## Filtering Logic

### Hospitals

Hospitals are filtered to exclude clinics and doctors' offices:

- `class == 'healthcare'` AND `subclass == 'hospital'` (not 'clinic' or 'doctors')
- `class == 'hospital'` AND (`subclass == 'hospital'` OR no subclass)
- `class == 'amenity'` AND `subclass == 'hospital'`

### Parks

Parks are filtered to show only major parks:

- National parks (`class == 'national_park'` OR `tourism == 'national_park'`)
- National monuments (`tourism == 'national_monument'`)
- State parks (`subclass == 'state_park'`)

Only Point geometries are shown (not Polygons) to avoid duplicate labels.

### Schools

Schools are filtered to show only colleges and universities:

- `class == 'college'` AND `subclass IN ['university', 'college']`

This excludes K-12 schools, which are not shown.

### Airports

Airports are queried from multiple sources (in priority order):

1. **`aerodrome_label` layer** (PRIMARY - Main airport labels)
   - Source: `us_high` only (this source-layer doesn't exist in other sources)
   - Filter: `["has", "name"]` (all features with names)
   - Layer ID: `aerodrome-label-airport-us_high`
   - **This is the main source for airport icons and labels**
   - Created in: `shared/styles/layers/labels/poi.ts` (after the main source loop)
   - If this stops working, check:
     - Layer exists in `style.json`: `grep "aerodrome-label-airport-us_high" basemaps/dark-blue/style.json`
     - POI airport is enabled: `theme.pois.airport.enabled === true`
     - Source `us_high` exists and has `aerodrome_label` source-layer
2. **POI layer**: `class == 'transport'` AND `subclass == 'airport'` OR `class == 'airport'` (fallback)
3. **PLACE layer**: `place IN ['airport', 'aerodrome']` (fallback)

### Airfields

Airfields are queried from the POI layer:

- `class == 'transport'` AND `subclass == 'airfield'`

## Maintenance

### Updating POI Configuration

1. **Edit theme file**: `basemaps/dark-blue/styles/theme.ts`
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser** to see changes

### Adding/Removing POI Icons

1. **Add/remove icon SVG** in `shared/assets/sprites/icons/`
2. **Update `poiIcons` array** in `scripts/rebuild-sprites.ts`
3. **Rebuild sprites**: `npx tsx scripts/rebuild-sprites.ts dark-blue`
4. **Rebuild styles**: `npm run build:styles`

### Changing POI Filters

1. **Edit filter logic** in `shared/styles/layers/labels/poi.ts`
2. **Rebuild styles**: `npm run build:styles`
3. **Test with click handler** in `basemaps/dark-blue/map.js` (Airport/Airfield Inspector)

## Troubleshooting

### POIs Not Showing

1. **Check POI is enabled** in `theme.ts`:
   ```typescript
   pois: {
     enabled: true,  // Must be true
     airport: { enabled: true },  // Individual type must be enabled
   }
   ```

2. **Check zoom level** - POIs appear at their configured `minZoom` or higher

3. **Check data sources** - Verify PMTiles contain POI data:
   - `poi_us` source should have `poi` source-layer
   - `us_high` source should have `poi` and `aerodrome_label` source-layers

4. **Use click handler** - Click on the map and check console for POI inspector output

### Airport Labels Not Showing (Main Airport Name Labels)

The main airport name labels come from the `aerodrome_label` source-layer in `us_high`. If these stop working:

1. **Verify the layer exists in style.json**:
   ```bash
   grep "aerodrome-label-airport-us_high" basemaps/dark-blue/style.json
   ```
   If not found, the layer wasn't created during build.

2. **Check the layer is created in code**:
   - File: `shared/styles/layers/labels/poi.ts`
   - Look for: Layer created after the main source loop (around line 865)
   - Layer ID must be: `aerodrome-label-airport-us_high`
   - Source must be: `us_high`
   - Source-layer must be: `aerodrome_label`

3. **Verify source-layer exists**:
   - Use the Airport Inspector in the map (click handler)
   - Check console for: `✅ Found X aerodrome_label features in us_high`
   - If features are found but not rendering, check:
     - Layer is in `style.json` (step 1)
     - POI airport is enabled (step 1 above)
     - Zoom level is >= 12 (or configured `minZoom`)

4. **Rebuild styles**:
   ```bash
   npm run build:styles
   ```
   Then hard refresh browser (Cmd+Shift+R)

5. **Common issues**:
   - Layer was removed from code or moved inside source loop (should be outside)
   - Source name changed (must be exactly `"us_high"`)
   - Source-layer name changed (must be exactly `"aerodrome_label"`)
   - Filter issue (should be `["has", "name"]`)

### POI Icons Missing

1. **Verify icon in sprite**:
   ```bash
   cat basemaps/dark-blue/sprites/basemap.json | grep "your-poi"
   ```

2. **Rebuild sprites** if icon is missing:
   ```bash
   npx tsx scripts/rebuild-sprites.ts dark-blue
   ```

3. **Check icon file exists**:
   ```bash
   ls shared/assets/sprites/icons/your-icon.svg
   ```

### POI Colors Not Updating

POI icon colors are controlled by `theme.colors.label.poi.iconColor`. Changes take effect immediately (no sprite rebuild needed) because POI icons are SDF sprites.

1. **Update theme**: Change `iconColor` in `theme.ts`
2. **Rebuild styles**: `npm run build:styles`
3. **Hard refresh browser**

## Related Documentation

- [Sprites](./sprites.md) - How POI icons are built into sprite sheets
- [Customizing Themes](./customizing-themes.md) - How to modify POI colors and styling
- [Road Features](./roads.md) - Highway shields (different from POIs)

