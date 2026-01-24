/**
 * Map Configuration
 * 
 * This file is auto-generated from theme.ts settings.
 * Do not edit manually - changes will be overwritten.
 * 
 * To change the projection, minZoom, or starfield, edit: basemaps/dark-blue/styles/theme.ts
 * Look for: darkBlueSettings.projection, darkBlueSettings.minZoom, and darkBlueStarfield
 */

// Projection setting from theme.ts -> darkBlueSettings.projection
// Options: "mercator" (flat map) or "globe" (3D globe)
window.mapProjection = "globe";

// Minimum zoom levels from theme.ts -> darkBlueSettings.minZoom
// Different values for mercator vs globe projections
window.mapMinZoom = {
  mercator: 0,
  globe: 2
};

// Starfield configuration from theme.ts -> darkBlueStarfield
window.starfieldConfig = {
  glowColors: {
    inner: "rgba(120, 180, 255, 0.9)",
    middle: "rgba(100, 150, 255, 0.7)",
    outer: "rgba(70, 120, 255, 0.4)",
    fade: "rgba(40, 80, 220, 0)"
  },
  starCount: 200,
  glowIntensity: 0.5,
  glowSizeMultiplier: 1.25,
  glowBlurMultiplier: 0.1
};
