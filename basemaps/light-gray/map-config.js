/**
 * Map Configuration
 * 
 * This file is auto-generated from theme.ts settings.
 * Do not edit manually - changes will be overwritten.
 * 
 * To change the projection, minZoom, view, or starfield, edit: basemaps/light-gray/styles/theme.ts
 * Look for: lightGraySettings.projection, lightGraySettings.minZoom, lightGraySettings.view, and lightGrayStarfield
 */

// Projection setting from theme.ts -> lightGraySettings.projection
// Options: "mercator" (flat map) or "globe" (3D globe)
window.mapProjection = "globe";

// Minimum zoom levels from theme.ts -> lightGraySettings.minZoom
// Different values for mercator vs globe projections
window.mapMinZoom = {
  mercator: 0,
  globe: 2
};
// Initial view configuration from theme.ts -> lightGraySettings.view
// Center point [longitude, latitude]
window.mapCenter = [-98, 39];
// Initial zoom level
window.mapZoom = 4.25;
// Camera tilt angle in degrees (0-60)
window.mapPitch = 0;
// Rotation angle in degrees (0-360)
window.mapBearing = 0;
// Starfield configuration from theme.ts -> lightGrayStarfield
window.starfieldConfig = {
  glowColors: {
    inner: "rgba(168, 174, 182, 0.4)",
    middle: "rgba(148, 154, 162, 0.3)",
    outer: "rgba(128, 134, 142, 0.2)",
    fade: "rgba(108, 114, 122, 0)"
  },
  starCount: 100,
  glowIntensity: 0.3,
  glowSizeMultiplier: 1.15,
  glowBlurMultiplier: 0.08
};
