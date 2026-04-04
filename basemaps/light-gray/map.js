/* global maplibregl, pmtiles */

/**
 * Light Gray Basemap - Map Initialization
 * 
 * This map uses the generated style.json which is built from TypeScript:
 *   npm run build:styles
 * 
 * For programmatic usage (e.g., in a bundled application), you can import directly:
 * 
 *   import { createLightGrayStyle } from './styles/lightGrayStyle.js';
 *   
 *   const map = new maplibregl.Map({
 *     container: "map-container",
 *     style: createLightGrayStyle(),
 *     // ... other options
 *   });
 * 
 * For static hosting or simple HTML pages, use the generated JSON:
 *   style: "./style.json"  // or "./style.generated.json"
 */

// ============================================================================
// Configuration Constants
// These values match basemaps/light-gray/styles/theme.ts lightGraySettings
// Can be overridden by setting window.mapProjection/window.mapMinZoom/window.mapCenter/window.mapZoom/window.mapPitch/window.mapBearing before this script runs
// ============================================================================
const DEFAULT_PROJECTION = "globe";
const DEFAULT_MIN_ZOOM = { mercator: 0, globe: 2 };
const DEFAULT_CENTER = [-98.0, 39.0];
const DEFAULT_ZOOM = 4.25;
const DEFAULT_PITCH = 0;
const DEFAULT_BEARING = 0;

// Get projection and minZoom from window overrides or use defaults
const projectionType = (typeof window !== 'undefined' && window.mapProjection) 
  ? window.mapProjection 
  : DEFAULT_PROJECTION;

// Get minZoom based on projection type
const minZoomConfig = (typeof window !== 'undefined' && window.mapMinZoom)
  ? window.mapMinZoom
  : DEFAULT_MIN_ZOOM;

const minZoom = projectionType === 'mercator' 
  ? minZoomConfig.mercator 
  : minZoomConfig.globe;

// Get center, zoom, pitch, and bearing from window overrides or use defaults
const center = (typeof window !== 'undefined' && window.mapCenter) 
  ? window.mapCenter 
  : DEFAULT_CENTER;

const zoom = (typeof window !== 'undefined' && window.mapZoom !== undefined) 
  ? window.mapZoom 
  : DEFAULT_ZOOM;

const pitch = (typeof window !== 'undefined' && window.mapPitch !== undefined) 
  ? window.mapPitch 
  : DEFAULT_PITCH;

const bearing = (typeof window !== 'undefined' && window.mapBearing !== undefined) 
  ? window.mapBearing 
  : DEFAULT_BEARING;

// Register PMTiles protocol
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);
// HTTP 204 / zero-byte hillshade PNGs become 1×1 images in MapLibre → dem dimension mismatch (#1551).
// Replace with a valid 256×256 Mapbox-terrain-RGB flat tile until the CDN stops returning 204 for gaps.
(function installWorldMtnHillshadeEmptyResponseWorkaround() {
  if (typeof window === "undefined" || window.__maplibreHillshadeFetchWorkaround) return;
  window.__maplibreHillshadeFetchWorkaround = true;
  const b64 = "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAFMklEQVR4nO3cwQ3DMAwEQW/zqoOlpoa8+OAAKiBYr2BLvMvXGwuBrmrwrf8CC4FsABIgkDcACRDIJxAJEMgZgAQI5BBMAgRyC0QCBHINSgIEMgcgAQIZhJEAgUyCSYBAohAkQCBZIBIgkDAcCRBIGpQECCQOTQIE0gcgAQIpxJAAgTTCSIBAKpEkQCCdYBKkkK0UT4JubwP/CrH/DKxsABIgkDcACRDIJxAJEMgZgAQI5BBMAgRyC0QCBHINSgIEMgcgAQIZhJEAgUyCSYBAohAkQCBZIBIgkDAcCRBIGpQECCQOTQIE0gcgAQIpxJAAgTTCSIBAKpEkQCCdYBKkjqwUT4JubwP/CrH/DKxsABIgkDcACRDIJxAJEMgZgAQI5BBMAgRyC0QCBHINSgIEMgcgAQIZhJEAgUyCSYBAohAkQCBZIBIgkDAcCRBIGpQECCQOTQIE0gcgAQIpxJAAgTTCSIBAKpEkQCCdYBKkjqwUT4JubwP/CrH/DKxsABIgkDcACRDIJxAJEMgZgAQI5BBMAgRyC0QCBHINSgIEMgcgAQIZhJEAgUyCSYBAohAkQCBZIBIgkDAcCRBIGpQECCQOTQIE0gcgAQIpxJAAAY0wEiAwKpEkQGB0gkmAgFI8Cd71beBfIfafgZUNQAIE8gYgAQL5BCIBAjkDkACBHIJJgEBugUiAQK5BSYBA5gAkQCCDMBIgkEkwCRBIFIIECCQLRAIEEoYjAQJJg5IAgcShSYBA+gAkQCCFGBIgkEYYCRBIJZIECKQTTILUkZXiSdDtbeBfIfafgZUNQAIE8gYgAQL5BCIBAjkDkACBHIJJgEBugUiAQK5BSYBA5gAkQCCDMBIgkEkwCRBIFIIECCQLRAIEEoYjAQJJg5IAgcShSYBA+gAkQCCFGBIgkEYYCRBIJZIECKQTTILUkZXiSdDtbeBfIfafgZUNQAIE8gYgAQL5BCIBAjkDkACBHIJJgEBugUiAQK5BSYBA5gAkQCCDMBIgkEkwCRBIFIIECCQLRAIEEoYjAQJJg5IAgcShSYBA+gAkQCCFGBIgkEYYCRBIJZIECKQTTILUkZXiSdDtbeBfIfafgZUNQAIE8gYgAQL5BCIBAjkDkACBHIJJgEBugUiAQK5BSYBA5gAkQCCDMBIgkEkwCRBIFIIECCQLRAIEEoYjAQJJg5IAgcShSYBA+gAkQCCFGBIgkEYYCRBIJZIECKQTTILUkZXiSdDtbeBfIfafgZUNQAIE8gYgAQL5BCIBAjkDkACBHIJJgEBugUiAQK5BSYBA5gAkQCCDMBIgkEkwCRBIFIIECCQLRAIEEoYjAQJJg5IAgcShSYBA+gAkQCCFGBIgkEYYCRBIJZIECKQTTILUkZXiSdDtbeBfIfafgZUNQAIE8gYgAQL5BCIBAjkDkACBHIJJgEBugUiAQK5BSYBA5gAkQCCDMBIgkEkwCRBIFIIECCQLRAIEEoYjAQLSoCRAYMShSYDA6AOQAIFRiCEBAqMRRgIERiWSBAiMTjAJEFCKJ8G7vg38K8T+M7CyAUiAQN4AJEAgn0AkQCBnABIgkEMwCRDILRAJEMg1KAkQyByABAhkEEYCBDIJJgECiUKQAIFkgUiAQMJwJEAgaVASIJA4NAkQSB+ABAikEEMCBNIIIwECqUSSAIF0gkmQOrJSPAm6vQ38K8T+M7CyAUiAQN4AJEAgn0AkQCBnABIgkEMwCRDILRAJEMg1KAkQyByABAhkEEYCBDIJJgECiUKQAIFkgUiAQP9vgx+h1RFKR3X0EAAAAABJRU5ErkJggg==";
  const placeholder = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const orig = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    const res = await orig(input, init);
    const url =
      typeof input === "string"
        ? input
        : input instanceof Request
          ? input.url
          : String(input);
    const isHillshade =
      url.includes("world_mtn_hillshade") && url.includes(".png");
    if (!isHillshade) return res;

    if (res.status === 204) {
      return new Response(placeholder, {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "image/png" },
      });
    }

    const cl = res.headers.get("content-length");
    if (res.ok && cl === "0") {
      return new Response(placeholder, {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "image/png" },
      });
    }

    return res;
  };
})();


// Initialize map (disable default attribution control)
// maxZoom set high to allow overzooming beyond source limits (6 for world, 15 for US)
// minZoom, center, zoom, pitch, and bearing come from theme configuration
const map = new maplibregl.Map({
  container: "map-container",
  style: "./style.json",
  center: center,  // From theme.ts lightGraySettings.view.center
  zoom: zoom,  // From theme.ts lightGraySettings.view.zoom
  pitch: pitch,  // From theme.ts lightGraySettings.view.pitch
  bearing: bearing,  // From theme.ts lightGraySettings.view.bearing
  minZoom: minZoom,  // From theme.ts lightGraySettings.minZoom
  maxZoom: 22,
  hash: false,
  attributionControl: false,
  canvasContextAttributes: { antialias: true }
});

// Add navigation control
map.addControl(new maplibregl.NavigationControl(), "top-right");

// Add attribution control with custom attribution
const attributionControl = new maplibregl.AttributionControl({
  compact: false,
  customAttribution: "<a href='https://maplibre.org/'>MapLibre</a> | © <a href='https://storypath.studio/'>StoryPath Studio</a> | © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors | © <a href='https://openmaptiles.org/'>OpenMapTiles</a> | <a href='https://www.naturalearthdata.com/'>Natural Earth</a>"
});
map.addControl(attributionControl);

// Create and attach the starry background
// Configuration is read from window.starfieldConfig (generated from theme.ts) or uses defaults
const starfieldConfig = (typeof window !== 'undefined' && window.starfieldConfig)
  ? window.starfieldConfig
  : {
      glowColors: {
        inner: "rgba(120, 180, 255, 0.9)",
        middle: "rgba(100, 150, 255, 0.7)",
        outer: "rgba(70, 120, 255, 0.4)",
        fade: "rgba(40, 80, 220, 0)"
      }
    };

const starryBg = new MapLibreStarryBackground(starfieldConfig);

// Override glowColors if provided in config (works with CDN version)
// This allows theme-specific colors to be applied even when using the CDN script
if (starfieldConfig && starfieldConfig.glowColors) {
  starryBg.config.glowColors = { ...starryBg.config.glowColors, ...starfieldConfig.glowColors };
}

// Projection is defined in style.json (from theme). Starfield only applies to globe.
map.on('style.load', () => {
  if (projectionType === 'globe') {
    starryBg.attachToMap(map, "starfield-container", "globe-glow");
  }
});

// Error handling
map.on("error", (e) => console.error("Map error:", e?.error || e));
