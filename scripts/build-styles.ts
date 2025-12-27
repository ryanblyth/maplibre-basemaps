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
  
  for (const build of stylesToBuild) {
    buildStyle(build, config);
  }
  
  console.log("\n✓ All styles built successfully!");
}

main();

