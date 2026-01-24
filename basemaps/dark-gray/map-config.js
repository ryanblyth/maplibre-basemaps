/**
 * Map Configuration
 * 
 * This file is auto-generated from theme.ts settings.
 * Do not edit manually - changes will be overwritten.
 * 
 * To change the projection, minZoom, or starfield, edit: basemaps/dark-gray/styles/theme.ts
 * Look for: darkGraySettings.projection, darkGraySettings.minZoom, and darkGrayStarfield
 */

// Projection setting from theme.ts -> darkGraySettings.projection
// Options: "mercator" (flat map) or "globe" (3D globe)
window.mapProjection = "globe";

// Minimum zoom levels from theme.ts -> darkGraySettings.minZoom
// Different values for mercator vs globe projections
window.mapMinZoom = {
  mercator: 0,
  globe: 2
};
// Starfield configuration from theme.ts -> darkGrayStarfield
window.starfieldConfig = {
  glowColors: {
    inner: "rgba(200, 200, 200, 0.9)",
    middle: "rgba(150, 150, 150, 0.7)",
    outer: "rgba(100, 100, 100, 0.4)",
    fade: "rgba(50, 50, 50, 0)"
  },
  starCount: 200,
  glowIntensity: 0.5,
  glowSizeMultiplier: 1.25,
  glowBlurMultiplier: 0.1
};
