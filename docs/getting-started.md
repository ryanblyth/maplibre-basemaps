# Getting Started

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd maplibre-basemaps

# Install dependencies
npm install
```

## Building Styles

The build command generates static JSON style files from TypeScript:

```bash
npm run build:styles
```

This outputs:
- `basemaps/dark-blue/style.generated.json` - The generated style
- `basemaps/dark-blue/style.json` - Copy for backward compatibility

## Viewing the Map

1. Start a local server in the project root:

```bash
# Using Python
python3 -m http.server 8080

# Or using Node
npx serve -p 8080

# Or use the project's development server
node serve.js
```

2. Open in browser: `http://localhost:8080/basemaps/dark-blue/`

**Note:** The development server (`serve.js`) serves shared assets (glyphs, sprites, starfield script) from local `shared/` directories. For production deployments, these assets are hosted on CDN at `https://data.storypath.studio/`. The generated `style.json` files use CDN URLs for production, while local development uses files from `shared/` directories.

## Development Workflow

1. **Edit theme** - Modify `basemaps/dark-blue/styles/theme.ts`
2. **Build** - Run `npm run build:styles`
3. **Refresh** - Reload the browser to see changes

### Example: Change a Color

```typescript
// basemaps/dark-blue/styles/theme.ts

export const darkBlueColors: ThemeColors = {
  background: "#ff0000",  // Change to red
  // ...
};
```

Then rebuild:

```bash
npm run build:styles
```

Refresh the browser - you'll see a red background.

## Project Structure

```
basemaps/dark-blue/
├── styles/
│   ├── theme.ts          # ← Edit this file
│   ├── darkBlueStyle.ts  # Wires theme to layers
│   └── index.ts          # Exports
├── style.json            # Generated (don't edit)
├── style.generated.json  # Generated (don't edit)
├── index.html            # Demo HTML page
└── map.js                # Map initialization
```

## Next Steps

- [Customizing Themes](./customizing-themes.md) - Learn what you can customize
- [Creating a New Basemap](./creating-basemap.md) - Make your own basemap


