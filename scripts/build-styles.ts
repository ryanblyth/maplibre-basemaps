/**
 * Build script for generating static JSON style files
 * 
 * Usage: npm run build:styles
 * 
 * This script imports the TypeScript style functions and outputs
 * static JSON files that can be used for:
 * - Static hosting
 * - Maputnik style editor
 * - Direct URL references in MapLibre
 */

import { writeFileSync, mkdirSync, copyFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createDarkBlueStyle } from "../basemaps/dark-blue/styles/darkBlueStyle.js";
import { createDarkGrayStyle } from "../basemaps/dark-gray/styles/darkGrayStyle.js";
import type { BaseStyleConfig } from "../shared/styles/baseStyle.js";
import { formatJSON } from "./format-json.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

/** Configuration for production build */
const productionConfig: BaseStyleConfig = {
  glyphsBaseUrl: "https://data.storypath.studio",
  glyphsPath: "glyphs",
  spriteBaseUrl: "http://localhost:8080",
  dataBaseUrl: "https://data.storypath.studio",
};

/** Configuration for local development */
const localConfig: BaseStyleConfig = {
  glyphsBaseUrl: "https://data.storypath.studio",
  glyphsPath: "glyphs",
  spriteBaseUrl: "http://localhost:8080",
  dataBaseUrl: "https://data.storypath.studio",
};

interface StyleBuild {
  name: string;
  outputPath: string;
  generator: (config: BaseStyleConfig) => unknown;
}

const stylesToBuild: StyleBuild[] = [
  {
    name: "dark-blue",
    outputPath: "basemaps/dark-blue/style.generated.json",
    generator: createDarkBlueStyle,
  },
  {
    name: "dark-gray",
    outputPath: "basemaps/dark-gray/style.generated.json",
    generator: createDarkGrayStyle,
  },
];

function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  mkdirSync(dir, { recursive: true });
}

/**
 * Convert kebab-case to camelCase
 * e.g., "dark-gray" -> "darkGray"
 */
function toCamelCase(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Generate map-config.js from theme settings for any basemap
 */
async function generateMapConfig(basemapName: string): Promise<void> {
  try {
    // Dynamically import theme module
    const themeModule = await import(`../basemaps/${basemapName}/styles/theme.js`);
    const camelCase = toCamelCase(basemapName);
    const settings = themeModule[`${camelCase}Settings`];
    const starfield = themeModule[`${camelCase}Starfield`];
    
    // If no settings found, skip map-config generation
    if (!settings) {
      console.log(`  ⚠ No settings found for ${basemapName}, skipping map-config.js`);
      return;
    }
    
    const mapConfigPath = join(projectRoot, "basemaps", basemapName, "map-config.js");
    const projection = settings.projection || "globe";
    
    // Get minZoom - can be object with mercator/globe keys, or single number
    let minZoomMercator = 0;
    let minZoomGlobe = 2;
    if (settings.minZoom !== undefined) {
      if (typeof settings.minZoom === "number") {
        minZoomMercator = settings.minZoom;
        minZoomGlobe = settings.minZoom;
      } else {
        minZoomMercator = settings.minZoom.mercator ?? 0;
        minZoomGlobe = settings.minZoom.globe ?? 2;
      }
    }
    
    // Get view settings (center, zoom, pitch, and bearing)
    const view = settings.view;
    const center = view?.center || [-98.0, 39.0];
    const zoom = view?.zoom ?? 4.25;
    const pitch = view?.pitch ?? 0;
    const bearing = view?.bearing ?? 0;
    
    // Generate starfield config section if available
    let starfieldConfigSection = "";
    if (starfield) {
      const glowColors = starfield.glowColors;
      starfieldConfigSection = `
// Starfield configuration from theme.ts -> ${camelCase}Starfield
window.starfieldConfig = {
  glowColors: {
    inner: "${glowColors.inner}",
    middle: "${glowColors.middle}",
    outer: "${glowColors.outer}",
    fade: "${glowColors.fade}"
  },
  starCount: ${starfield.starCount},
  glowIntensity: ${starfield.glowIntensity},
  glowSizeMultiplier: ${starfield.glowSizeMultiplier},
  glowBlurMultiplier: ${starfield.glowBlurMultiplier}
};`;
    }
    
    // Generate view config section
    const viewConfigSection = `
// Initial view configuration from theme.ts -> ${camelCase}Settings.view
// Center point [longitude, latitude]
window.mapCenter = [${center[0]}, ${center[1]}];
// Initial zoom level
window.mapZoom = ${zoom};
// Camera tilt angle in degrees (0-60)
window.mapPitch = ${pitch};
// Rotation angle in degrees (0-360)
window.mapBearing = ${bearing};`;
    
    const mapConfigContent = `/**
 * Map Configuration
 * 
 * This file is auto-generated from theme.ts settings.
 * Do not edit manually - changes will be overwritten.
 * 
 * To change the projection, minZoom, view, or starfield, edit: basemaps/${basemapName}/styles/theme.ts
 * Look for: ${camelCase}Settings.projection, ${camelCase}Settings.minZoom, ${camelCase}Settings.view${starfield ? `, and ${camelCase}Starfield` : ""}
 */

// Projection setting from theme.ts -> ${camelCase}Settings.projection
// Options: "mercator" (flat map) or "globe" (3D globe)
window.mapProjection = "${projection}";

// Minimum zoom levels from theme.ts -> ${camelCase}Settings.minZoom
// Different values for mercator vs globe projections
window.mapMinZoom = {
  mercator: ${minZoomMercator},
  globe: ${minZoomGlobe}
};${viewConfigSection}${starfieldConfigSection}
`;
    
    writeFileSync(mapConfigPath, mapConfigContent, "utf8");
    const starfieldNote = starfield ? ", starfield: enabled" : "";
    console.log(`  ✓ Generated map-config.js (projection: ${projection}, minZoom: mercator=${minZoomMercator}, globe=${minZoomGlobe}, center: [${center[0]}, ${center[1]}], zoom: ${zoom}, pitch: ${pitch}, bearing: ${bearing}${starfieldNote})`);
  } catch (error) {
    // Handle gracefully - maybe theme doesn't exist or doesn't have required exports
    console.warn(`  ⚠ Could not generate map-config.js for ${basemapName}:`, error instanceof Error ? error.message : error);
  }
}

async function buildStyle(build: StyleBuild, config: BaseStyleConfig): Promise<void> {
  const outputPath = join(projectRoot, build.outputPath);
  // Also create style.json for compatibility (map.js loads this)
  const styleJsonPath = outputPath.replace(".generated.json", ".json");
  
  console.log(`Building ${build.name}...`);
  
  try {
    const style = build.generator(config);
    ensureDir(outputPath);
    // Use custom formatter to generate compact, readable JSON
    // The formatter follows rules defined in docs/style-json-formatting.md:
    // - Compact simple arrays/objects on one line
    // - Proper indentation for complex expressions (let, case, interpolate)
    // - Correct nesting for nested expressions in arrays
    // - Normalized indentation for nested case expressions
    const formatted = formatJSON(style);
    writeFileSync(outputPath, formatted + "\n", "utf8");
    console.log(`  ✓ Written to ${build.outputPath}`);
    
    // Copy to style.json for backward compatibility
    copyFileSync(outputPath, styleJsonPath);
    console.log(`  ✓ Copied to ${build.outputPath.replace(".generated.json", ".json")}`);
    
    // Generate map-config.js from theme settings (if theme supports it)
    await generateMapConfig(build.name);
  } catch (error) {
    console.error(`  ✗ Failed to build ${build.name}:`, error);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  console.log("Building MapLibre basemap styles...\n");
  
  // Determine which config to use based on environment
  const config = process.env.NODE_ENV === "production" ? productionConfig : localConfig;
  console.log(`Using ${process.env.NODE_ENV === "production" ? "production" : "development"} configuration\n`);
  
  // Note: This script does NOT rebuild sprite files.
  // - Shared sprites: Only rebuild if POI icons changed (use: make sprite)
  // - Basemap sprites: Rebuild shields separately (use: npx tsx scripts/build-shields.ts <basemap>)
  
  for (const build of stylesToBuild) {
    await buildStyle(build, config);
  }
  
  console.log("\n✓ All styles built successfully!");
  console.log("\n💡 Note: This script does not rebuild sprite files.");
  console.log("   - Shield changes: npx tsx scripts/build-shields.ts <basemap-name>");
  console.log("   - POI icon changes: make sprite (rebuilds shared sprites)");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

