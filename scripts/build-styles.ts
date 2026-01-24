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
import { darkBlueSettings } from "../basemaps/dark-blue/styles/theme.js";
import { darkGraySettings, darkGrayStarfield } from "../basemaps/dark-gray/styles/theme.js";
import type { BaseStyleConfig } from "../shared/styles/baseStyle.js";
import { formatJSON } from "./format-json.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

/** Configuration for production build */
const productionConfig: BaseStyleConfig = {
  glyphsBaseUrl: "http://localhost:8080",
  spriteBaseUrl: "http://localhost:8080",
  dataBaseUrl: "https://data.storypath.studio",
};

/** Configuration for local development */
const localConfig: BaseStyleConfig = {
  glyphsBaseUrl: "http://localhost:8080",
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

function buildStyle(build: StyleBuild, config: BaseStyleConfig): void {
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
    
    // Generate map-config.js from theme settings
    if (build.name === "dark-blue") {
      const mapConfigPath = join(projectRoot, "basemaps/dark-blue/map-config.js");
      const projection = darkBlueSettings.projection || "globe";
      
      // Get minZoom - can be object with mercator/globe keys, or single number
      let minZoomMercator = 0;
      let minZoomGlobe = 2;
      if (darkBlueSettings.minZoom !== undefined) {
        if (typeof darkBlueSettings.minZoom === "number") {
          minZoomMercator = darkBlueSettings.minZoom;
          minZoomGlobe = darkBlueSettings.minZoom;
        } else {
          minZoomMercator = darkBlueSettings.minZoom.mercator ?? 0;
          minZoomGlobe = darkBlueSettings.minZoom.globe ?? 2;
        }
      }
      
      const mapConfigContent = `/**
 * Map Configuration
 * 
 * This file is auto-generated from theme.ts settings.
 * Do not edit manually - changes will be overwritten.
 * 
 * To change the projection or minZoom, edit: basemaps/dark-blue/styles/theme.ts
 * Look for: darkBlueSettings.projection and darkBlueSettings.minZoom
 */

// Projection setting from theme.ts -> darkBlueSettings.projection
// Options: "mercator" (flat map) or "globe" (3D globe)
window.mapProjection = "${projection}";

// Minimum zoom levels from theme.ts -> darkBlueSettings.minZoom
// Different values for mercator vs globe projections
window.mapMinZoom = {
  mercator: ${minZoomMercator},
  globe: ${minZoomGlobe}
};
`;
      writeFileSync(mapConfigPath, mapConfigContent, "utf8");
      console.log(`  ✓ Generated map-config.js (projection: ${projection}, minZoom: mercator=${minZoomMercator}, globe=${minZoomGlobe})`);
    } else if (build.name === "dark-gray") {
      const mapConfigPath = join(projectRoot, "basemaps/dark-gray/map-config.js");
      const projection = darkGraySettings.projection || "globe";
      
      // Get minZoom - can be object with mercator/globe keys, or single number
      let minZoomMercator = 0;
      let minZoomGlobe = 2;
      if (darkGraySettings.minZoom !== undefined) {
        if (typeof darkGraySettings.minZoom === "number") {
          minZoomMercator = darkGraySettings.minZoom;
          minZoomGlobe = darkGraySettings.minZoom;
        } else {
          minZoomMercator = darkGraySettings.minZoom.mercator ?? 0;
          minZoomGlobe = darkGraySettings.minZoom.globe ?? 2;
        }
      }
      
      // Get starfield config
      const starfieldConfig = darkGrayStarfield;
      const glowColors = starfieldConfig.glowColors;
      
      const mapConfigContent = `/**
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
window.mapProjection = "${projection}";

// Minimum zoom levels from theme.ts -> darkGraySettings.minZoom
// Different values for mercator vs globe projections
window.mapMinZoom = {
  mercator: ${minZoomMercator},
  globe: ${minZoomGlobe}
};

// Starfield configuration from theme.ts -> darkGrayStarfield
window.starfieldConfig = {
  glowColors: {
    inner: "${glowColors.inner}",
    middle: "${glowColors.middle}",
    outer: "${glowColors.outer}",
    fade: "${glowColors.fade}"
  },
  starCount: ${starfieldConfig.starCount},
  glowIntensity: ${starfieldConfig.glowIntensity},
  glowSizeMultiplier: ${starfieldConfig.glowSizeMultiplier},
  glowBlurMultiplier: ${starfieldConfig.glowBlurMultiplier}
};
`;
      writeFileSync(mapConfigPath, mapConfigContent, "utf8");
      console.log(`  ✓ Generated map-config.js (projection: ${projection}, minZoom: mercator=${minZoomMercator}, globe=${minZoomGlobe}, starfield: enabled)`);
    }
  } catch (error) {
    console.error(`  ✗ Failed to build ${build.name}:`, error);
    process.exit(1);
  }
}

function main(): void {
  console.log("Building MapLibre basemap styles...\n");
  
  // Determine which config to use based on environment
  const config = process.env.NODE_ENV === "production" ? productionConfig : localConfig;
  console.log(`Using ${process.env.NODE_ENV === "production" ? "production" : "development"} configuration\n`);
  
  // Note: This script does NOT rebuild sprite files.
  // - Shared sprites: Only rebuild if POI icons changed (use: make sprite)
  // - Basemap sprites: Rebuild shields separately (use: npx tsx scripts/build-shields.ts <basemap>)
  
  for (const build of stylesToBuild) {
    buildStyle(build, config);
  }
  
  console.log("\n✓ All styles built successfully!");
  console.log("\n💡 Note: This script does not rebuild sprite files.");
  console.log("   - Shield changes: npx tsx scripts/build-shields.ts <basemap-name>");
  console.log("   - POI icon changes: make sprite (rebuilds shared sprites)");
}

main();

