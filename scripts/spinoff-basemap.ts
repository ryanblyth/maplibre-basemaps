/**
 * Spinoff Basemap Script
 * 
 * Creates a fully independent, standalone project from any basemap.
 * The spinoff includes all source files, build tools, and documentation
 * needed to develop and deploy a custom map in another repository.
 * 
 * Usage: npx tsx scripts/spinoff-basemap.ts <source-basemap> <spinoff-name>
 * 
 * Example: npx tsx scripts/spinoff-basemap.ts dark-gray my-custom-map
 * 
 * This will create a complete project at: /spinoffs/my-custom-map/
 * 
 * The spinoff includes:
 * - Full TypeScript source files (theme.ts, style definitions)
 * - Build scripts (build-styles, build-shields)
 * - Development server (serve.js)
 * - All shared utilities (copied locally, no parent dependencies)
 * - Sprite files (from source basemap)
 * - Complete documentation
 * - package.json with all dependencies
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  statSync,
  copyFileSync,
  rmSync
} from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

// ============================================================================
// Name Transformation Utilities
// ============================================================================

/**
 * Convert kebab-case to camelCase
 * e.g., "dark-gray" -> "darkGray"
 */
function toCamelCase(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert kebab-case to PascalCase
 * e.g., "dark-gray" -> "DarkGray"
 */
function toPascalCase(kebab: string): string {
  const camel = toCamelCase(kebab);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Convert kebab-case to Title Case
 * e.g., "dark-gray" -> "Dark Gray"
 */
function toTitleCase(kebab: string): string {
  return kebab
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Validate name is valid kebab-case
 */
function isValidKebabCase(name: string): boolean {
  return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);
}

// ============================================================================
// File Operations
// ============================================================================

/**
 * Recursively copy directory, transforming content and file names
 */
function copyDirectoryWithTransform(
  srcDir: string,
  destDir: string,
  transform: (content: string, filePath: string) => string,
  skipFiles: string[] = []
): void {
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  const entries = readdirSync(srcDir);

  for (const entry of entries) {
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, entry);
    const stat = statSync(srcPath);

    // Skip certain files
    if (skipFiles.includes(entry)) {
      continue;
    }

    if (stat.isDirectory()) {
      copyDirectoryWithTransform(srcPath, destPath, transform, skipFiles);
    } else {
      const isTextFile = /\.(ts|js|html|json|md|css|svg)$/.test(entry);
      if (isTextFile) {
        let content = readFileSync(srcPath, "utf8");
        content = transform(content, srcPath);
        writeFileSync(destPath, content, "utf8");
      } else {
        copyFileSync(srcPath, destPath);
      }
    }
  }
}

/**
 * Transform content: replace source basemap names with spinoff name
 */
function createContentTransformer(
  sourceBasemap: string,
  spinoffName: string
): (content: string, filePath: string) => string {
  const sourceCamel = toCamelCase(sourceBasemap);
  const sourcePascal = toPascalCase(sourceBasemap);
  const sourceTitle = toTitleCase(sourceBasemap);

  const spinoffCamel = toCamelCase(spinoffName);
  const spinoffPascal = toPascalCase(spinoffName);
  const spinoffTitle = toTitleCase(spinoffName);

  return (content: string, filePath: string) => {
    // Replace PascalCase
    content = content.replace(new RegExp(sourcePascal, "g"), spinoffPascal);
    // Replace camelCase
    content = content.replace(new RegExp(sourceCamel, "g"), spinoffCamel);
    // Replace Title Case (in strings/comments)
    content = content.replace(new RegExp(sourceTitle, "g"), spinoffTitle);
    // Replace kebab-case
    content = content.replace(new RegExp(sourceBasemap, "g"), spinoffName);

    // Update import paths: ../../../shared/ -> ../shared/ (from styles/ directory)
    content = content.replace(/from ["']\.\.\/\.\.\/\.\.\/shared\//g, 'from "../shared/');
    content = content.replace(/import ["']\.\.\/\.\.\/\.\.\/shared\//g, 'import "../shared/');

    return content;
  };
}

// ============================================================================
// Spinoff Creation
// ============================================================================

function spinoffBasemap(sourceBasemap: string, spinoffName: string): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Creating Spinoff: ${spinoffName}`);
  console.log(`From Source: ${sourceBasemap}`);
  console.log(`${"=".repeat(60)}\n`);

  // Validate inputs
  const sourceDir = join(projectRoot, "basemaps", sourceBasemap);
  if (!existsSync(sourceDir)) {
    console.error(`❌ Source basemap not found: ${sourceDir}`);
    console.error(`\nAvailable basemaps:`);
    const basemapsDir = join(projectRoot, "basemaps");
    readdirSync(basemapsDir).forEach(name => {
      const path = join(basemapsDir, name);
      if (statSync(path).isDirectory()) {
        console.error(`  - ${name}`);
      }
    });
    process.exit(1);
  }

  if (!isValidKebabCase(spinoffName)) {
    console.error(`❌ Invalid spinoff name: "${spinoffName}"`);
    console.error("Use lowercase letters, numbers, and hyphens (e.g., my-custom-map)");
    process.exit(1);
  }

  const spinoffDir = join(projectRoot, "spinoffs", spinoffName);
  if (existsSync(spinoffDir)) {
    console.error(`❌ Spinoff directory already exists: ${spinoffDir}`);
    console.error("Remove it first if you want to recreate the spinoff.");
    process.exit(1);
  }

  // Create spinoff directory
  mkdirSync(spinoffDir, { recursive: true });

  const transform = createContentTransformer(sourceBasemap, spinoffName);

  // Step 1: Copy basemap source files
  console.log("Step 1: Copying basemap source files...");
  const stylesDir = join(sourceDir, "styles");
  const destStylesDir = join(spinoffDir, "styles");
  
  copyDirectoryWithTransform(stylesDir, destStylesDir, transform, [
    "node_modules",
    ".DS_Store"
  ]);
  
  // Rename the main style file
  const sourceCamel = toCamelCase(sourceBasemap);
  const spinoffCamel = toCamelCase(spinoffName);
  const oldStyleFile = join(destStylesDir, `${sourceCamel}Style.ts`);
  const newStyleFile = join(destStylesDir, `${spinoffCamel}Style.ts`);
  if (existsSync(oldStyleFile)) {
    const styleContent = readFileSync(oldStyleFile, "utf8");
    writeFileSync(newStyleFile, styleContent, "utf8");
    rmSync(oldStyleFile);
  }
  
  console.log(`  ✓ Copied styles/ directory`);

  // Step 2: Copy sprites
  console.log("\nStep 2: Copying sprite files...");
  const spritesSourceDir = join(sourceDir, "sprites");
  const spritesDestDir = join(spinoffDir, "sprites");
  if (existsSync(spritesSourceDir)) {
    copyDirectoryWithTransform(spritesSourceDir, spritesDestDir, () => "", []);
    console.log(`  ✓ Copied sprites/ directory`);
  } else {
    console.log(`  ⚠ No sprites directory found in source basemap`);
  }

  // Step 3: Copy and adapt preview.html
  console.log("\nStep 3: Creating preview.html...");
  const previewSource = join(sourceDir, "preview.html");
  const previewDest = join(spinoffDir, "preview.html");
  if (existsSync(previewSource)) {
    let previewContent = readFileSync(previewSource, "utf8");
    previewContent = transform(previewContent, previewSource);
    writeFileSync(previewDest, previewContent, "utf8");
    console.log(`  ✓ Created preview.html`);
  }

  // Step 3b: Copy map.js
  const mapJsSource = join(sourceDir, "map.js");
  const mapJsDest = join(spinoffDir, "map.js");
  if (existsSync(mapJsSource)) {
    let mapJsContent = readFileSync(mapJsSource, "utf8");
    mapJsContent = transform(mapJsContent, mapJsSource);
    writeFileSync(mapJsDest, mapJsContent, "utf8");
    console.log(`  ✓ Copied map.js`);
  }

  // Step 4: Copy shared utilities
  console.log("\nStep 4: Copying shared utilities...");
  const sharedSource = join(projectRoot, "shared");
  const sharedDest = join(spinoffDir, "shared");
  
  // Copy shared/styles directory (all TS utilities)
  const sharedStylesSource = join(sharedSource, "styles");
  const sharedStylesDest = join(sharedDest, "styles");
  copyDirectoryWithTransform(sharedStylesSource, sharedStylesDest, transform, []);
  console.log(`  ✓ Copied shared/styles/ utilities`);

  // Step 5: Create build scripts
  console.log("\nStep 5: Creating build scripts...");
  const scriptsDir = join(spinoffDir, "scripts");
  mkdirSync(scriptsDir, { recursive: true });
  
  generateBuildStylesScript(scriptsDir, spinoffName);
  generateBuildShieldsScript(scriptsDir, spinoffName);
  
  // Copy format-json.ts
  const formatJsonSource = join(projectRoot, "scripts", "format-json.ts");
  const formatJsonDest = join(scriptsDir, "format-json.ts");
  copyFileSync(formatJsonSource, formatJsonDest);
  console.log(`  ✓ Created build scripts`);

  // Step 6: Create serve.js
  console.log("\nStep 6: Creating development server...");
  generateServeScript(spinoffDir);
  console.log(`  ✓ Created serve.js`);

  // Step 7: Create package.json
  console.log("\nStep 7: Creating package.json...");
  generatePackageJson(spinoffDir, spinoffName);
  console.log(`  ✓ Created package.json`);

  // Step 8: Create tsconfig.json
  console.log("\nStep 8: Creating tsconfig.json...");
  const tsconfigSource = join(projectRoot, "tsconfig.json");
  const tsconfigDest = join(spinoffDir, "tsconfig.json");
  copyFileSync(tsconfigSource, tsconfigDest);
  console.log(`  ✓ Created tsconfig.json`);

  // Step 9: Create .gitignore
  console.log("\nStep 9: Creating .gitignore...");
  generateGitignore(spinoffDir);
  console.log(`  ✓ Created .gitignore`);

  // Step 10: Create documentation
  console.log("\nStep 10: Creating documentation...");
  const docsDir = join(spinoffDir, "docs");
  mkdirSync(docsDir, { recursive: true });
  
  generateReadme(spinoffDir, spinoffName, sourceBasemap);
  generateCustomizingDoc(docsDir, spinoffName);
  generateBuildingDoc(docsDir, spinoffName);
  generateDeployingDoc(docsDir, spinoffName);
  console.log(`  ✓ Created documentation`);

  // Done!
  console.log(`\n${"=".repeat(60)}`);
  console.log(`✓ Spinoff created successfully!`);
  console.log(`${"=".repeat(60)}\n`);
  
  console.log(`Location: ${spinoffDir}\n`);
  console.log(`Next steps:\n`);
  console.log(`  1. cd spinoffs/${spinoffName}`);
  console.log(`  2. npm install`);
  console.log(`  3. npm run build:styles`);
  console.log(`  4. npm run serve`);
  console.log(`  5. Open http://localhost:8080/preview.html\n`);
  console.log(`To move to another repository:\n`);
  console.log(`  1. Copy the entire spinoffs/${spinoffName}/ folder`);
  console.log(`  2. Move to your target repository`);
  console.log(`  3. Run npm install and npm run build:styles`);
  console.log(`  4. Delete from spinoffs/ once confirmed working\n`);
}

// ============================================================================
// File Generators
// ============================================================================

function generateBuildStylesScript(scriptsDir: string, spinoffName: string): void {
  const spinoffCamel = toCamelCase(spinoffName);
  const spinoffPascal = toPascalCase(spinoffName);
  
  const content = `/**
 * Build script for generating static JSON style file
 * 
 * Usage: npm run build:styles
 */

import { writeFileSync, mkdirSync, copyFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { create${spinoffPascal}Style } from "../styles/${spinoffCamel}Style.js";
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

function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  mkdirSync(dir, { recursive: true });
}

/**
 * Generate map-config.js from theme settings
 */
async function generateMapConfig(): Promise<void> {
  try {
    const themeModule = await import("../styles/theme.js");
    const settings = themeModule.${spinoffCamel}Settings;
    const starfield = themeModule.${spinoffCamel}Starfield;
    
    if (!settings) {
      console.log("  ⚠ No settings found, skipping map-config.js");
      return;
    }
    
    const mapConfigPath = join(projectRoot, "map-config.js");
    const projection = settings.projection || "globe";
    
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
    
    const view = settings.view;
    const center = view?.center || [-98.0, 39.0];
    const zoom = view?.zoom ?? 4.25;
    const pitch = view?.pitch ?? 0;
    const bearing = view?.bearing ?? 0;
    
    let starfieldConfigSection = "";
    if (starfield) {
      const glowColors = starfield.glowColors;
      starfieldConfigSection = \`
// Starfield configuration
window.starfieldConfig = {
  glowColors: {
    inner: "\${glowColors.inner}",
    middle: "\${glowColors.middle}",
    outer: "\${glowColors.outer}",
    fade: "\${glowColors.fade}"
  },
  starCount: \${starfield.starCount},
  glowIntensity: \${starfield.glowIntensity},
  glowSizeMultiplier: \${starfield.glowSizeMultiplier},
  glowBlurMultiplier: \${starfield.glowBlurMultiplier}
};\`;
    }
    
    const mapConfigContent = \`/**
 * Map Configuration
 * 
 * Auto-generated from theme.ts settings.
 */

window.mapProjection = "\${projection}";
window.mapMinZoom = {
  mercator: \${minZoomMercator},
  globe: \${minZoomGlobe}
};
window.mapCenter = [\${center[0]}, \${center[1]}];
window.mapZoom = \${zoom};
window.mapPitch = \${pitch};
window.mapBearing = \${bearing};\${starfieldConfigSection}
\`;
    
    writeFileSync(mapConfigPath, mapConfigContent, "utf8");
    console.log(\`  ✓ Generated map-config.js\`);
  } catch (error) {
    console.warn("  ⚠ Could not generate map-config.js:", error instanceof Error ? error.message : error);
  }
}

async function buildStyle(): Promise<void> {
  console.log("Building ${spinoffName} style...\\n");
  
  const config = process.env.NODE_ENV === "production" ? productionConfig : localConfig;
  console.log(\`Using \${process.env.NODE_ENV === "production" ? "production" : "development"} configuration\\n\`);
  
  try {
    const style = create${spinoffPascal}Style(config);
    const outputPath = join(projectRoot, "style.generated.json");
    const styleJsonPath = join(projectRoot, "style.json");
    
    ensureDir(outputPath);
    const formatted = formatJSON(style);
    writeFileSync(outputPath, formatted + "\\n", "utf8");
    console.log("  ✓ Written to style.generated.json");
    
    copyFileSync(outputPath, styleJsonPath);
    console.log("  ✓ Copied to style.json");
    
    await generateMapConfig();
    
    console.log("\\n✓ Style built successfully!");
  } catch (error) {
    console.error("  ✗ Failed to build style:", error);
    process.exit(1);
  }
}

buildStyle().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
`;

  writeFileSync(join(scriptsDir, "build-styles.ts"), content, "utf8");
}

function generateBuildShieldsScript(scriptsDir: string, spinoffName: string): void {
  const spinoffCamel = toCamelCase(spinoffName);
  
  // Read the original build-shields.ts and adapt it
  const originalScript = join(projectRoot, "scripts", "build-shields.ts");
  let content = readFileSync(originalScript, "utf8");
  
  // Update basemap paths - replace the const declarations
  content = content.replace(
    `const basemapName = process.argv[2] || 'dark-blue';`,
    `const basemapName = "${spinoffName}"; // Fixed for this spinoff`
  );
  content = content.replace(
    `const BASEMAP_DIR = join('basemaps', basemapName);`,
    `const BASEMAP_DIR = join(__dirname, "..");  // Current directory is the basemap`
  );
  content = content.replace(
    `const SHIELDS_DIR = join('shared', 'assets', 'sprites', 'shields');`,
    `const SHIELDS_DIR = join(__dirname, "..", "sprites", "shields");  // Shields in local sprites dir`
  );
  
  // Update the dynamic import path - simpler replacement
  content = content.replace(
    `await import(\`../\${BASEMAP_DIR}/styles/theme.js\`)`,
    `await import("../styles/theme.js")`
  );
  
  // Simplify theme access - simpler replacement
  const themeAccessPattern = `const theme = themeModule[\`\${basemapName.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Theme\`] || 
                  themeModule[\`\${basemapName}Theme\`] ||
                  themeModule.default;`;
  content = content.replace(
    themeAccessPattern,
    `const theme = themeModule.${spinoffCamel}Theme || themeModule;`
  );

  writeFileSync(join(scriptsDir, "build-shields.ts"), content, "utf8");
}

function generateServeScript(spinoffDir: string): void {
  const content = `/**
 * Development server
 * 
 * Serves the map files with proper CORS headers and Range request support.
 * 
 * Usage: npm run serve
 */

import { createServer } from "http";
import { readFileSync, statSync, createReadStream, existsSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 8080;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".pbf": "application/x-protobuf",
  ".pmtiles": "application/x-pmtiles",
};

const server = createServer((req, res) => {
  let filePath = join(__dirname, req.url === "/" ? "/preview.html" : req.url.split("?")[0]);

  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const stat = statSync(filePath);
  const ext = extname(filePath);
  const mimeType = MIME_TYPES[ext] || "application/octet-stream";

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Range");
  res.setHeader("Content-Type", mimeType);

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle Range requests (for PMTiles)
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunksize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": \`bytes \${start}-\${end}/\${stat.size}\`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
    });

    createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { "Content-Length": stat.size });
    createReadStream(filePath).pipe(res);
  }
});

server.listen(PORT, () => {
  console.log(\`\\n🌍 Development server running at http://localhost:\${PORT}\`);
  console.log(\`\\n   Preview: http://localhost:\${PORT}/preview.html\\n\`);
});
`;

  writeFileSync(join(spinoffDir, "serve.js"), content, "utf8");
}

function generatePackageJson(spinoffDir: string, spinoffName: string): void {
  const content = {
    name: spinoffName,
    version: "1.0.0",
    description: `Custom MapLibre basemap: ${toTitleCase(spinoffName)}`,
    type: "module",
    scripts: {
      "build:styles": "tsx scripts/build-styles.ts",
      "build:shields": "tsx scripts/build-shields.ts",
      serve: "node serve.js",
      dev: "npm run build:styles && npm run serve",
    },
    devDependencies: {
      "@types/node": "^20.10.0",
      "maplibre-gl": "^4.0.0",
      sharp: "^0.34.5",
      tsx: "^4.6.0",
      typescript: "^5.3.0",
    },
    engines: {
      node: ">=18.0.0",
    },
  };

  writeFileSync(
    join(spinoffDir, "package.json"),
    JSON.stringify(content, null, 2) + "\n",
    "utf8"
  );
}

function generateGitignore(spinoffDir: string): void {
  const content = `# Dependencies
node_modules/
package-lock.json
yarn.lock

# Generated files (rebuilt from source)
style.json
style.generated.json
map-config.js
map.js

# Build artifacts
*.log
.DS_Store

# Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
Thumbs.db

# Temporary files
*.tmp
.cache/
`;

  writeFileSync(join(spinoffDir, ".gitignore"), content, "utf8");
}

function generateReadme(
  spinoffDir: string,
  spinoffName: string,
  sourceBasemap: string
): void {
  const spinoffTitle = toTitleCase(spinoffName);
  
  const content = `# ${spinoffTitle} Map

A custom MapLibre basemap created from the ${sourceBasemap} template.

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Build the map style:**
   \`\`\`bash
   npm run build:styles
   \`\`\`

3. **Start the development server:**
   \`\`\`bash
   npm run serve
   \`\`\`

4. **View the map:**
   Open [http://localhost:8080/preview.html](http://localhost:8080/preview.html)

## Project Structure

\`\`\`
/
├── styles/              # TypeScript style definitions
│   ├── theme.ts        # Colors, fonts, and map configuration
│   └── ${toCamelCase(spinoffName)}Style.ts  # Main style builder
├── sprites/            # Icon sprite sheets
├── scripts/            # Build scripts
│   ├── build-styles.ts # Generate style.json
│   └── build-shields.ts # Build highway shields
├── shared/             # Shared utilities (layers, expressions)
├── docs/               # Documentation
├── preview.html        # Development preview page
├── serve.js           # Development server
└── package.json       # Dependencies and scripts
\`\`\`

## Customization

### Editing Colors and Styles

The main customization file is \`styles/theme.ts\`. This file contains:

- **Color palette**: Background, water, roads, labels, etc.
- **Map settings**: Projection (globe/mercator), initial view, zoom levels
- **Starfield settings**: Globe glow colors and star configuration
- **Layer visibility**: Which features to show/hide

After editing \`theme.ts\`, rebuild the styles:

\`\`\`bash
npm run build:styles
\`\`\`

See [docs/customizing.md](docs/customizing.md) for detailed customization guide.

### Building Styles

The build system converts TypeScript source files into MapLibre-compatible JSON:

\`\`\`bash
npm run build:styles
\`\`\`

This generates:
- \`style.json\` - Main style file (used by the map)
- \`style.generated.json\` - Same content, formatted output
- \`map-config.js\` - Map initialization config

See [docs/building.md](docs/building.md) for build system details.

### Highway Shields

To customize highway shield colors and rebuild sprites:

\`\`\`bash
npm run build:shields
\`\`\`

Edit shield colors in \`styles/theme.ts\` under the \`shields\` section.

## Development Workflow

1. **Edit** \`styles/theme.ts\` to customize colors and settings
2. **Build** with \`npm run build:styles\`
3. **Refresh** browser to see changes
4. **Repeat** until satisfied

Tip: Keep the development server running and just rebuild styles as needed.

## Deployment

This map is designed to work with Cloudflare Pages or any static hosting.

### Assets Strategy

- **Local files**: Sprites (bundled in \`sprites/\`)
- **CDN files**: 
  - Glyphs (fonts): \`https://data.storypath.studio/glyphs/\`
  - Starfield script: \`https://data.storypath.studio/js/maplibre-gl-starfield.js\`
  - PMTiles data: External URLs in \`style.json\`

### Using in Production

1. Build the styles: \`npm run build:styles\`
2. Deploy these files:
   - \`style.json\`
   - \`sprites/\` directory
   - \`preview.html\` (or your custom HTML)
   - \`map.js\` (if generated)

See [docs/deploying.md](docs/deploying.md) for detailed deployment guide.

## Documentation

- [Customizing the Map](docs/customizing.md) - How to edit colors, layers, and settings
- [Build System](docs/building.md) - Understanding the build process
- [Deployment](docs/deploying.md) - Deploying to production

## Scripts

- \`npm run build:styles\` - Build map style from TypeScript source
- \`npm run build:shields\` - Rebuild highway shield sprites
- \`npm run serve\` - Start development server
- \`npm run dev\` - Build and serve (convenience command)

## Requirements

- Node.js >= 18.0.0
- npm or yarn

## External Assets (CDN)

This map uses external CDN assets to reduce bundle size:

- **Glyphs** (fonts): Loaded from \`https://data.storypath.studio/glyphs/\`
- **Starfield**: Loaded from \`https://data.storypath.studio/js/maplibre-gl-starfield.js\`
- **PMTiles data**: Map data loaded from external URLs

These are loaded on-demand and cached by the browser.

## Troubleshooting

**Map not rendering?**
- Check browser console for errors
- Ensure you've run \`npm run build:styles\`
- Verify development server is running

**Styles not updating?**
- Run \`npm run build:styles\` after editing \`theme.ts\`
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

**Missing sprites?**
- Ensure \`sprites/\` directory exists
- Check that sprite paths in \`style.json\` are correct

## License

[Your License Here]
`;

  writeFileSync(join(spinoffDir, "README.md"), content, "utf8");
}

function generateCustomizingDoc(docsDir: string, spinoffName: string): void {
  const spinoffCamel = toCamelCase(spinoffName);
  
  const content = `# Customizing Your Map

This guide explains how to customize the ${toTitleCase(spinoffName)} map.

## Color Customization

All colors are defined in \`styles/theme.ts\`. The theme file exports a \`${spinoffCamel}Theme\` object with color definitions.

### Background Colors

\`\`\`typescript
export const ${spinoffCamel}Theme = {
  background: "#1a1f2b",      // Map background
  backgroundFill: "#1e2330",  // Land fill color
  // ...
};
\`\`\`

### Water Colors

\`\`\`typescript
export const ${spinoffCamel}Theme = {
  // ...
  water: "#1e3a5f",           // Ocean/lake color
  waterLabel: "#5a8ab8",      // Water label text
  // ...
};
\`\`\`

### Road Colors

Roads are defined in the \`roads\` section with different colors for each class:

\`\`\`typescript
export const ${spinoffCamel}Theme = {
  // ...
  roads: {
    motorway: "#6b8199",      // Interstate/Freeway
    trunk: "#5f7389",         // Major highways
    primary: "#536479",       // Primary roads
    secondary: "#485669",     // Secondary roads
    // ...
  },
};
\`\`\`

### Label Colors

\`\`\`typescript
export const ${spinoffCamel}Theme = {
  // ...
  labels: {
    country: "#8a95a3",       // Country names
    state: "#7a8593",         // State names
    city: "#6a7583",          // City names
    // ...
  },
};
\`\`\`

## Map Configuration

Map behavior is controlled by \`${spinoffCamel}Settings\`:

### Projection

Choose between globe (3D) or mercator (flat) projection:

\`\`\`typescript
export const ${spinoffCamel}Settings = {
  projection: "globe",  // or "mercator"
  // ...
};
\`\`\`

### Initial View

Set the starting position and zoom:

\`\`\`typescript
export const ${spinoffCamel}Settings = {
  // ...
  view: {
    center: [-98.0, 39.0],  // [longitude, latitude]
    zoom: 4.25,              // Initial zoom level
    pitch: 0,                // Camera tilt (0-60)
    bearing: 0,              // Rotation (0-360)
  },
};
\`\`\`

### Zoom Levels

Control minimum zoom:

\`\`\`typescript
export const ${spinoffCamel}Settings = {
  // ...
  minZoom: {
    mercator: 0,  // Min zoom for flat projection
    globe: 2,     // Min zoom for globe projection
  },
};
\`\`\`

## Starfield Customization

The globe projection includes a starfield background. Customize it:

\`\`\`typescript
export const ${spinoffCamel}Starfield = {
  glowColors: {
    inner: "rgba(120, 180, 255, 0.9)",   // Inner glow
    middle: "rgba(100, 150, 255, 0.7)",  // Middle glow
    outer: "rgba(70, 120, 255, 0.4)",    // Outer glow
    fade: "rgba(40, 80, 220, 0)",        // Fade to transparent
  },
  starCount: 200,              // Number of stars
  glowIntensity: 1.0,          // Glow brightness (0-1)
  glowSizeMultiplier: 1.5,     // Glow size
  glowBlurMultiplier: 0.15,    // Blur amount
};
\`\`\`

## Highway Shield Colors

Customize highway shield colors:

\`\`\`typescript
export const ${spinoffCamel}Theme = {
  // ...
  shields: {
    interstate: {
      upperBackground: "#2a3444",
      lowerBackground: "#1e2530",
      strokeColor: "#4a5a6a",
      strokeWidth: 2,
    },
    usHighway: {
      background: "#1e2530",
      strokeColor: "#4a5a6a",
      strokeWidth: 3,
    },
    stateHighway: {
      background: "#1e2530",
      strokeColor: "#4a5a6a",
      strokeWidth: 2,
    },
  },
};
\`\`\`

After changing shield colors, rebuild sprites:

\`\`\`bash
npm run build:shields
\`\`\`

## Layer Visibility

Control which map features are visible by editing layer definitions in \`styles/${spinoffCamel}Style.ts\`.

Common layers you might want to show/hide:

- \`landcover\` layers - Forests, parks, etc.
- \`bathymetry\` layers - Ocean depth shading
- \`hillshade\` - Terrain shading
- \`contours\` - Elevation contours
- \`ice\` - Ice/glacier coverage
- \`grid\` - Latitude/longitude grid

To hide a layer, comment it out or remove it from the layers array.

## Applying Changes

After making any changes to \`theme.ts\` or style files:

1. **Rebuild styles:**
   \`\`\`bash
   npm run build:styles
   \`\`\`

2. **Rebuild shields** (if you changed shield colors):
   \`\`\`bash
   npm run build:shields
   \`\`\`

3. **Refresh browser** to see changes

## Tips

- **Start small**: Change one color at a time and rebuild to see the effect
- **Use contrast**: Ensure labels are readable against backgrounds
- **Test zoom levels**: Some colors work better at different zoom levels
- **Reference the source**: Look at the original \`${spinoffCamel}Theme\` for inspiration

## Advanced Customization

For advanced customization (adding/removing layers, changing data sources, etc.), you'll need to edit:

- \`styles/${spinoffCamel}Style.ts\` - Main style builder
- \`shared/styles/layers/\` - Layer definitions

See the [Building Guide](building.md) for more details on the build system.
`;

  writeFileSync(join(docsDir, "customizing.md"), content, "utf8");
}

function generateBuildingDoc(docsDir: string, spinoffName: string): void {
  const spinoffCamel = toCamelCase(spinoffName);
  
  const content = `# Build System

Understanding how the ${toTitleCase(spinoffName)} map build system works.

## Overview

The map style is built from TypeScript source files, which are then compiled to JSON that MapLibre can read.

**Source files (TypeScript)** → **Build script** → **Generated files (JSON/JS)**

## Build Process

### 1. Build Styles

\`\`\`bash
npm run build:styles
\`\`\`

This runs \`scripts/build-styles.ts\`, which:

1. Imports the style generator function from \`styles/${spinoffCamel}Style.ts\`
2. Calls it with configuration (CDN URLs, etc.)
3. Formats the output JSON
4. Writes three files:
   - \`style.generated.json\` - Formatted MapLibre style
   - \`style.json\` - Copy of generated file (for compatibility)
   - \`map-config.js\` - JavaScript configuration for preview

### 2. Build Shields (Optional)

\`\`\`bash
npm run build:shields
\`\`\`

This runs \`scripts/build-shields.ts\`, which:

1. Reads shield color configuration from \`styles/theme.ts\`
2. Generates SVG shields with custom colors
3. Converts SVG to PNG
4. Adds shields to the sprite sheet (\`sprites/basemap.png\`)
5. Updates sprite metadata (\`sprites/basemap.json\`)

## Source Files

### styles/theme.ts

Defines all colors, configuration, and theme data:

\`\`\`typescript
export const ${spinoffCamel}Theme = {
  background: "#1a1f2b",
  water: "#1e3a5f",
  // ... all colors
};

export const ${spinoffCamel}Settings = {
  projection: "globe",
  view: { center: [-98, 39], zoom: 4.25 },
  // ... map configuration
};

export const ${spinoffCamel}Starfield = {
  glowColors: { /* ... */ },
  // ... starfield configuration
};
\`\`\`

### styles/${spinoffCamel}Style.ts

The main style builder function:

\`\`\`typescript
import { createBaseStyle } from "../shared/styles/baseStyle.js";
import { ${spinoffCamel}Theme, ${spinoffCamel}Settings } from "./theme.js";

export function create${toPascalCase(spinoffName)}Style(config: BaseStyleConfig) {
  return createBaseStyle(config, ${spinoffCamel}Theme, ${spinoffCamel}Settings);
}
\`\`\`

### shared/styles/

Shared utilities for building styles:

- \`baseStyle.ts\` - Base style builder
- \`layers/\` - Layer definition builders
  - \`water.ts\` - Water bodies
  - \`roads.ts\` - Road network
  - \`labels/\` - All label types
  - \`background.ts\`, \`land.ts\`, etc.
- \`expressions.ts\` - MapLibre expression helpers

## Build Configuration

The build script uses two configurations:

### Development Config (default)

\`\`\`typescript
const localConfig = {
  glyphsBaseUrl: "https://data.storypath.studio",
  glyphsPath: "glyphs",
  spriteBaseUrl: "http://localhost:8080",
  dataBaseUrl: "https://data.storypath.studio",
};
\`\`\`

- Sprites served from local dev server
- Glyphs and data from CDN

### Production Config

\`\`\`bash
NODE_ENV=production npm run build:styles
\`\`\`

\`\`\`typescript
const productionConfig = {
  glyphsBaseUrl: "https://data.storypath.studio",
  glyphsPath: "glyphs",
  spriteBaseUrl: "http://localhost:8080",  // Update for production
  dataBaseUrl: "https://data.storypath.studio",
};
\`\`\`

For production, update \`spriteBaseUrl\` to your CDN or hosting URL.

## Generated Files

### style.json

The main MapLibre style file. Contains:

- \`version\`: MapLibre style spec version (8)
- \`sources\`: Data sources (PMTiles URLs)
- \`sprite\`: Sprite sheet URL
- \`glyphs\`: Font glyph URL pattern
- \`layers\`: Array of layer definitions
- \`projection\`: Map projection type

### style.generated.json

Same as \`style.json\`, but clearly marked as generated.

### map-config.js

JavaScript file with map initialization config:

\`\`\`javascript
window.mapProjection = "globe";
window.mapMinZoom = { mercator: 0, globe: 2 };
window.mapCenter = [-98, 39];
window.mapZoom = 4.25;
// ...
\`\`\`

Used by \`preview.html\` to configure the map.

## TypeScript Compilation

The build uses \`tsx\` to run TypeScript directly, no separate compilation needed.

TypeScript configuration is in \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    // ...
  }
}
\`\`\`

## Format JSON

The \`scripts/format-json.ts\` utility formats the generated JSON:

- Compact simple arrays/objects
- Proper indentation for expressions
- Consistent formatting

This makes the output readable and easier to debug.

## Sprite Building

Sprites are PNG image atlases with JSON metadata:

- \`basemap.png\` - 1x resolution sprite atlas
- \`basemap.json\` - 1x sprite metadata
- \`basemap@2x.png\` - 2x resolution sprite atlas (retina)
- \`basemap@2x.json\` - 2x sprite metadata

The sprite contains:
- POI icons (from shared assets)
- Highway shields (generated with custom colors)

## Development Workflow

1. Edit \`styles/theme.ts\`
2. Run \`npm run build:styles\`
3. Refresh browser
4. See changes immediately

No need to restart the dev server.

## Debugging

### Check generated style.json

Open \`style.json\` to see the full MapLibre style definition.

### Validate JSON

The build script will error if it generates invalid JSON.

### Check console

The browser console will show MapLibre errors if the style is invalid.

### Test in Maputnik

You can load \`style.json\` into [Maputnik](https://maputnik.github.io/) for visual editing.

## Advanced: Custom Layers

To add custom layers, edit \`styles/${spinoffCamel}Style.ts\`:

\`\`\`typescript
export function create${toPascalCase(spinoffName)}Style(config: BaseStyleConfig) {
  const baseStyle = createBaseStyle(config, ${spinoffCamel}Theme, ${spinoffCamel}Settings);
  
  // Add custom layer
  baseStyle.layers.push({
    id: "my-custom-layer",
    type: "fill",
    source: "my-source",
    paint: {
      "fill-color": "#ff0000",
    },
  });
  
  return baseStyle;
}
\`\`\`

## Build Scripts Reference

### scripts/build-styles.ts

Main style builder. Reads TypeScript, generates JSON.

### scripts/build-shields.ts

Shield sprite builder. Reads theme colors, generates PNG sprites.

### scripts/format-json.ts

JSON formatter utility. Formats MapLibre style JSON.

## Troubleshooting

**Build fails with module error:**
- Run \`npm install\` to ensure dependencies are installed
- Check that all imports in source files are correct

**Generated style doesn't work:**
- Check browser console for MapLibre errors
- Validate \`style.json\` structure
- Ensure sprite and glyph URLs are accessible

**Shields not appearing:**
- Run \`npm run build:shields\` to rebuild sprites
- Check that shield colors are defined in \`theme.ts\`
- Verify sprite files exist in \`sprites/\` directory
`;

  writeFileSync(join(docsDir, "building.md"), content, "utf8");
}

function generateDeployingDoc(docsDir: string, spinoffName: string): void {
  const content = `# Deploying to Production

Guide for deploying the ${toTitleCase(spinoffName)} map to production.

## Overview

This map is designed to work with static hosting platforms like:

- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages
- Amazon S3 + CloudFront
- Any static file server

## Assets Strategy

The map uses a hybrid approach for assets:

### Local Assets (bundle with your app)

- **Sprites** - \`sprites/\` directory
  - \`basemap.png\` and \`basemap.json\`
  - \`basemap@2x.png\` and \`basemap@2x.json\`
  - These must be served from your domain

### External Assets (loaded from CDN)

- **Glyphs** (fonts) - \`https://data.storypath.studio/glyphs/\`
- **Starfield script** - \`https://data.storypath.studio/js/maplibre-gl-starfield.js\`
- **PMTiles data** - Map data URLs in \`style.json\`

## Deployment Steps

### 1. Build for Production

\`\`\`bash
NODE_ENV=production npm run build:styles
\`\`\`

This generates:
- \`style.json\` - MapLibre style definition
- \`map-config.js\` - Map initialization config

### 2. Update Sprite URLs (if needed)

If you're hosting sprites on a CDN, update the sprite URL in \`scripts/build-styles.ts\`:

\`\`\`typescript
const productionConfig = {
  glyphsBaseUrl: "https://data.storypath.studio",
  glyphsPath: "glyphs",
  spriteBaseUrl: "https://your-cdn.com",  // Your CDN URL
  dataBaseUrl: "https://data.storypath.studio",
};
\`\`\`

Then rebuild:

\`\`\`bash
NODE_ENV=production npm run build:styles
\`\`\`

### 3. Files to Deploy

Deploy these files to your static host:

\`\`\`
/
├── style.json          # Generated MapLibre style
├── sprites/            # Sprite files (required)
│   ├── basemap.json
│   ├── basemap.png
│   ├── basemap@2x.json
│   └── basemap@2x.png
├── preview.html        # Or your custom HTML page
└── map-config.js       # Map initialization config (if using)
\`\`\`

**Do NOT deploy:**
- \`node_modules/\`
- \`styles/\` (source files)
- \`scripts/\` (build scripts)
- \`shared/\` (build utilities)

## Platform-Specific Guides

### Cloudflare Pages

1. **Connect your repository** to Cloudflare Pages

2. **Build settings:**
   - Build command: \`npm run build:styles\`
   - Build output directory: \`/\` (root)
   - Root directory: \`/\`

3. **Deploy!**

Your map will be available at \`https://your-project.pages.dev\`

### Netlify

1. **Connect your repository** to Netlify

2. **Build settings:**
   \`\`\`
   Build command: npm run build:styles
   Publish directory: /
   \`\`\`

3. **Deploy!**

### Vercel

1. **Import your repository** in Vercel

2. **Build settings:**
   \`\`\`
   Framework Preset: Other
   Build Command: npm run build:styles
   Output Directory: /
   \`\`\`

3. **Deploy!**

### GitHub Pages

1. **Build locally:**
   \`\`\`bash
   npm run build:styles
   \`\`\`

2. **Commit generated files:**
   \`\`\`bash
   git add style.json map-config.js sprites/
   git commit -m "Build for production"
   \`\`\`

3. **Push to GitHub and enable Pages** in repository settings

### Manual Deployment

1. **Build locally:**
   \`\`\`bash
   NODE_ENV=production npm run build:styles
   \`\`\`

2. **Upload files** to your server:
   - \`style.json\`
   - \`sprites/\` directory
   - Your HTML file
   - \`map-config.js\` (if using)

3. **Configure your server:**
   - Enable CORS headers
   - Set proper MIME types
   - Enable gzip compression

## Server Configuration

### CORS Headers

Your server must send CORS headers for assets:

\`\`\`
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
\`\`\`

### MIME Types

Ensure correct MIME types:

\`\`\`
.json -> application/json
.png -> image/png
.js -> text/javascript
.html -> text/html
.pbf -> application/x-protobuf
\`\`\`

### Compression

Enable gzip compression for:
- \`.json\` files (especially \`style.json\`)
- \`.js\` files
- \`.html\` files

## Using in Your Application

### HTML Integration

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <link href="https://unpkg.com/maplibre-gl@5.13.0/dist/maplibre-gl.css" rel="stylesheet" />
  <style>
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  
  <script src="https://unpkg.com/maplibre-gl@5.13.0/dist/maplibre-gl.js"></script>
  <script src="https://unpkg.com/pmtiles@4.3.0/dist/pmtiles.js"></script>
  <script src="https://data.storypath.studio/js/maplibre-gl-starfield.js"></script>
  <script src="./map-config.js"></script>
  <script>
    const protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    
    const map = new maplibregl.Map({
      container: "map",
      style: "./style.json",
      center: window.mapCenter || [-98, 39],
      zoom: window.mapZoom || 4,
      projection: { type: window.mapProjection || "globe" }
    });
  </script>
</body>
</html>
\`\`\`

### JavaScript Integration

\`\`\`javascript
import maplibregl from 'maplibre-gl';
import * as pmtiles from 'pmtiles';

const protocol = new pmtiles.Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

const map = new maplibregl.Map({
  container: 'map',
  style: '/path/to/style.json',
  center: [-98, 39],
  zoom: 4
});
\`\`\`

## CDN Assets

The map loads these assets from CDN:

### Glyphs (Fonts)

\`\`\`
https://data.storypath.studio/glyphs/{fontstack}/{range}.pbf
\`\`\`

These are loaded on-demand as the map needs different character ranges.

### Starfield Script

\`\`\`
https://data.storypath.studio/js/maplibre-gl-starfield.js
\`\`\`

Required for globe projection with starfield effect.

### PMTiles Data

Map data sources are referenced in \`style.json\`:

\`\`\`json
{
  "sources": {
    "world_low": {
      "type": "vector",
      "url": "pmtiles://https://data.storypath.studio/pmtiles/world.pmtiles"
    }
  }
}
\`\`\`

## Performance Optimization

### 1. Enable Caching

Set cache headers for static assets:

\`\`\`
style.json -> Cache-Control: public, max-age=3600
sprites/* -> Cache-Control: public, max-age=31536000
\`\`\`

### 2. Use CDN

Serve your \`style.json\` and \`sprites/\` from a CDN for better global performance.

### 3. Compress Assets

Enable gzip/brotli compression for:
- \`style.json\` (can be quite large)
- JavaScript files

### 4. Lazy Load

If the map isn't immediately visible, lazy load MapLibre and PMTiles libraries.

## Environment Variables

For different environments, you can use environment variables:

\`\`\`typescript
// scripts/build-styles.ts
const productionConfig = {
  glyphsBaseUrl: process.env.GLYPHS_CDN || "https://data.storypath.studio",
  spriteBaseUrl: process.env.SPRITE_CDN || "http://localhost:8080",
  // ...
};
\`\`\`

Then build with:

\`\`\`bash
GLYPHS_CDN=https://my-cdn.com SPRITE_CDN=https://my-cdn.com npm run build:styles
\`\`\`

## Monitoring

### Check Asset Loading

Monitor that all assets load correctly:
- Style JSON
- Sprites (check Network tab)
- Glyphs (loaded on-demand)
- PMTiles data

### Error Tracking

Use browser console to track MapLibre errors:

\`\`\`javascript
map.on('error', (e) => {
  console.error('Map error:', e);
  // Send to error tracking service
});
\`\`\`

## Troubleshooting

**Map not rendering:**
- Check \`style.json\` is accessible
- Verify sprite URLs are correct
- Check browser console for errors

**Sprites not loading:**
- Ensure sprites are deployed
- Check CORS headers
- Verify sprite path in \`style.json\`

**Fonts not showing:**
- Check glyph URL in \`style.json\`
- Verify CDN is accessible
- Check Network tab for 404s

**Slow loading:**
- Enable compression
- Use CDN for assets
- Check PMTiles URLs are reachable

## Security

### Content Security Policy

If using CSP, allow these domains:

\`\`\`
connect-src 'self' https://data.storypath.studio;
script-src 'self' https://unpkg.com https://data.storypath.studio;
style-src 'self' https://unpkg.com;
img-src 'self' data: blob:;
\`\`\`

### HTTPS

Always serve your map over HTTPS in production.

## Updating

To update the map:

1. Edit \`styles/theme.ts\`
2. Build: \`npm run build:styles\`
3. Deploy updated files
4. Browser caches will update based on cache headers

## Rollback

Keep previous versions of \`style.json\` for quick rollback if needed.

\`\`\`bash
# Before deploying
cp style.json style.json.backup-$(date +%Y%m%d)
\`\`\`
`;

  writeFileSync(join(docsDir, "deploying.md"), content, "utf8");
}

// ============================================================================
// Main
// ============================================================================

function main(): void {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("Usage: npx tsx scripts/spinoff-basemap.ts <source-basemap> <spinoff-name>");
    console.error("");
    console.error("Example: npx tsx scripts/spinoff-basemap.ts dark-gray my-custom-map");
    console.error("");
    console.error("Creates a fully independent project at: spinoffs/<spinoff-name>/");
    process.exit(1);
  }

  const sourceBasemap = args[0];
  const spinoffName = args[1];

  spinoffBasemap(sourceBasemap, spinoffName);
}

main();
