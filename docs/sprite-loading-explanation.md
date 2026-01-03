# How MapLibre Loads Sprites (And Why Shields Might Still Display)

## How Sprite Loading Works

When MapLibre loads a sprite, it follows this process:

1. **Read the sprite URL** from the style JSON:
   ```json
   "sprite": "http://localhost:8080/basemaps/dark-blue/sprites/basemap"
   ```

2. **Load the JSON index file** (`basemap.json`):
   - This tells MapLibre where each icon is located in the PNG
   - Example entry:
     ```json
     "shield-interstate-custom": {
       "width": 28,
       "height": 28,
       "x": 0,
       "y": 42,
       "pixelRatio": 1
     }
     ```
   - This means: "The shield image is at coordinates (0, 42) in the PNG, and it's 28x28 pixels"

3. **Load the PNG image** (`basemap.png`):
   - MapLibre extracts the image region specified in the JSON
   - It uses the coordinates (x, y) and dimensions (width, height) to crop the sprite

4. **Cache the result**:
   - Both the JSON and PNG are cached by the browser
   - MapLibre also caches the extracted sprite images internally

## Why Shields Might Still Display

If shields are still displaying even though they're not in the PNG, here are the most likely causes:

### 1. **Browser Caching** (Most Common)
- The browser cached the old PNG file with shields
- Even though you've updated the file, the browser is still using the cached version
- **Solution**: Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows) or clear browser cache

### 2. **MapLibre Internal Caching**
- MapLibre caches sprite images after loading them
- If you update the sprite files but don't reload the map, MapLibre will use cached images
- **Solution**: Reload the map/page completely

### 3. **JSON Still References Shields**
- If the JSON file (`basemap.json`) still has shield entries, MapLibre will try to load them
- Even if the PNG doesn't have the images, MapLibre might:
  - Show a broken/blank image
  - Use a fallback/default image
  - Display cached images from a previous load
- **Solution**: Remove shield entries from the JSON file

### 4. **Sprite URL Points to Different File**
- Check if the style JSON's `sprite` URL points to the correct file
- If it points to a different sprite file (e.g., shared sprites), shields might be loaded from there
- **Solution**: Verify the sprite URL in `style.json`

## How to Verify

1. **Check the JSON file**:
   ```bash
   grep -i shield basemaps/dark-blue/sprites/basemap.json
   ```
   If shields are listed, they'll be loaded (even if missing from PNG)

2. **Check the PNG dimensions**:
   ```bash
   # Using ImageMagick or similar
   identify basemaps/dark-blue/sprites/basemap.png
   ```
   Compare PNG height with the `y + height` values in the JSON

3. **Check browser Network tab**:
   - Open DevTools → Network tab
   - Reload the page
   - Look for requests to `basemap.json` and `basemap.png`
   - Check if they're being served from cache (304 status) or fresh (200 status)

4. **Check MapLibre console**:
   - Open browser console
   - Look for sprite loading errors or warnings
   - MapLibre will log if it can't find a sprite image

## The Relationship Between JSON and PNG

The JSON file is like a **map** that tells MapLibre where to find each icon in the PNG:

```
JSON (index):          PNG (atlas):
shield-interstate      [POI icons at top]
  x: 0, y: 42          [Shield images below]
  width: 28, height: 28
```

If the JSON says "shield is at (0, 42)" but the PNG is only 21 pixels tall:
- The PNG doesn't have that region
- MapLibre will either:
  - Show nothing (if it validates)
  - Show a cached image (if previously loaded)
  - Show a broken image placeholder

## Best Practice

To ensure sprites are properly updated:

1. **Update both JSON and PNG together** (use `rebuild-sprites.ts`)
2. **Clear browser cache** or use hard refresh
3. **Reload the map completely** (not just the style)
4. **Verify in Network tab** that files are being loaded fresh (200 status, not 304)

