/**
 * Create Basemap Script
 * 
 * Scaffolds a new basemap from the dark-blue template.
 * 
 * Usage: npx tsx scripts/create-basemap.ts <basemap-name>
 * 
 * Example: npx tsx scripts/create-basemap.ts dark-gray
 * 
 * This will:
 * 1. Copy basemaps/dark-blue/ to basemaps/dark-gray/
 * 2. Rename files (darkBlueStyle.ts -> darkGrayStyle.ts)
 * 3. Transform content (replace darkBlue -> darkGray, etc.)
 * 4. Register the new basemap in scripts/build-styles.ts
 */

import { 
  existsSync, 
  mkdirSync, 
  readdirSync, 
  readFileSync, 
  writeFileSync, 
  statSync,
  copyFileSync 
} from "fs";
import { join, dirname } from "path";
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
 * Validate basemap name is valid kebab-case
 */
function isValidKebabCase(name: string): boolean {
  return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);
}

// ============================================================================
// File Operations
// ============================================================================

/**
 * Files to exclude when copying (generated files)
 */
const EXCLUDED_FILES = [
  "style.generated.json",
  "style.json",
  "map-config.js",
];

/**
 * Recursively copy a directory, transforming file names and contents
 */
function copyDirectory(
  srcDir: string,
  destDir: string,
  transforms: {
    srcCamel: string;
    destCamel: string;
    srcKebab: string;
    destKebab: string;
    srcTitle: string;
    destTitle: string;
    srcPascal: string;
    destPascal: string;
  }
): void {
  // Create destination directory
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  const entries = readdirSync(srcDir);

  for (const entry of entries) {
    // Skip excluded files
    if (EXCLUDED_FILES.includes(entry)) {
      continue;
    }

    const srcPath = join(srcDir, entry);
    const stat = statSync(srcPath);

    // Transform file name if it contains source patterns
    let destEntry = entry;
    destEntry = destEntry.replace(transforms.srcCamel, transforms.destCamel);
    destEntry = destEntry.replace(transforms.srcPascal, transforms.destPascal);

    const destPath = join(destDir, destEntry);

    if (stat.isDirectory()) {
      // Recursively copy subdirectory
      copyDirectory(srcPath, destPath, transforms);
    } else {
      // Check if file is text (for content transformation)
      const isTextFile = /\.(ts|js|html|json|md|css)$/.test(entry);

      if (isTextFile) {
        // Read, transform, and write
        let content = readFileSync(srcPath, "utf8");
        content = transformContent(content, transforms);
        writeFileSync(destPath, content, "utf8");
      } else {
        // Binary file - just copy
        copyFileSync(srcPath, destPath);
      }
    }
  }
}

/**
 * Transform file content with all naming replacements
 */
function transformContent(
  content: string,
  transforms: {
    srcCamel: string;
    destCamel: string;
    srcKebab: string;
    destKebab: string;
    srcTitle: string;
    destTitle: string;
    srcPascal: string;
    destPascal: string;
  }
): string {
  // Order matters: replace longer patterns first to avoid partial matches
  // Replace PascalCase (e.g., DarkBlue -> DarkGray)
  content = content.replace(
    new RegExp(transforms.srcPascal, "g"),
    transforms.destPascal
  );
  
  // Replace camelCase (e.g., darkBlue -> darkGray)
  content = content.replace(
    new RegExp(transforms.srcCamel, "g"),
    transforms.destCamel
  );
  
  // Replace Title Case (e.g., "Dark Blue" -> "Dark Gray")
  content = content.replace(
    new RegExp(transforms.srcTitle, "g"),
    transforms.destTitle
  );
  
  // Replace kebab-case (e.g., dark-blue -> dark-gray)
  content = content.replace(
    new RegExp(transforms.srcKebab, "g"),
    transforms.destKebab
  );

  return content;
}

/**
 * Update build-styles.ts to register the new basemap
 */
function updateBuildStyles(
  basemapName: string,
  camelCase: string,
  pascalCase: string
): void {
  const buildStylesPath = join(projectRoot, "scripts/build-styles.ts");
  let content = readFileSync(buildStylesPath, "utf8");

  // Check if already registered
  if (content.includes(`"${basemapName}"`)) {
    console.log(`  ⚠ Basemap "${basemapName}" already registered in build-styles.ts`);
    return;
  }

  // Add import statement after the last basemap import
  const importStatement = `import { create${pascalCase}Style } from "../basemaps/${basemapName}/styles/${camelCase}Style.js";`;
  
  // Find the last import from basemaps and add after it
  const lastBasemapImportMatch = content.match(/import \{ create\w+Style \} from "\.\.\/basemaps\/[^"]+";/g);
  if (lastBasemapImportMatch) {
    const lastImport = lastBasemapImportMatch[lastBasemapImportMatch.length - 1];
    content = content.replace(
      lastImport,
      `${lastImport}\n${importStatement}`
    );
  }

  // Add entry to stylesToBuild array
  const newEntry = `  {
    name: "${basemapName}",
    outputPath: "basemaps/${basemapName}/style.generated.json",
    generator: create${pascalCase}Style,
  },`;

  // Find the stylesToBuild array and add entry before the closing bracket
  const arrayMatch = content.match(/const stylesToBuild: StyleBuild\[\] = \[([\s\S]*?)\];/);
  if (arrayMatch) {
    const arrayContent = arrayMatch[1];
    const updatedArrayContent = arrayContent.trimEnd() + "\n" + newEntry + "\n";
    content = content.replace(
      `const stylesToBuild: StyleBuild[] = [${arrayContent}];`,
      `const stylesToBuild: StyleBuild[] = [${updatedArrayContent}];`
    );
  }

  writeFileSync(buildStylesPath, content, "utf8");
  console.log(`  ✓ Registered in scripts/build-styles.ts`);
}

// ============================================================================
// Main
// ============================================================================

function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("Usage: npx tsx scripts/create-basemap.ts <basemap-name>");
    console.error("");
    console.error("Example: npx tsx scripts/create-basemap.ts dark-gray");
    console.error("");
    console.error("The basemap name should be in kebab-case (lowercase with hyphens).");
    process.exit(1);
  }

  const basemapName = args[0];

  // Validate name format
  if (!isValidKebabCase(basemapName)) {
    console.error(`Error: "${basemapName}" is not valid kebab-case.`);
    console.error("Use lowercase letters, numbers, and hyphens (e.g., dark-gray, ocean-blue, light-v2)");
    process.exit(1);
  }

  // Generate naming variants
  const srcKebab = "dark-blue";
  const srcCamel = "darkBlue";
  const srcPascal = "DarkBlue";
  const srcTitle = "Dark Blue";

  const destKebab = basemapName;
  const destCamel = toCamelCase(basemapName);
  const destPascal = toPascalCase(basemapName);
  const destTitle = toTitleCase(basemapName);

  const transforms = {
    srcCamel,
    destCamel,
    srcKebab,
    destKebab,
    srcTitle,
    destTitle,
    srcPascal,
    destPascal,
  };

  // Check paths
  const srcDir = join(projectRoot, "basemaps", srcKebab);
  const destDir = join(projectRoot, "basemaps", destKebab);

  if (!existsSync(srcDir)) {
    console.error(`Error: Template directory not found: ${srcDir}`);
    process.exit(1);
  }

  if (existsSync(destDir)) {
    console.error(`Error: Target directory already exists: ${destDir}`);
    console.error("Remove it first if you want to recreate the basemap.");
    process.exit(1);
  }

  console.log(`\nCreating basemap: ${basemapName}`);
  console.log(`  From template: ${srcKebab}`);
  console.log(`  Naming: ${destCamel} / ${destPascal} / "${destTitle}"`);
  console.log("");

  // Step 1: Copy and transform files
  console.log("Step 1: Copying and transforming files...");
  copyDirectory(srcDir, destDir, transforms);
  console.log(`  ✓ Created basemaps/${destKebab}/`);

  // Step 2: Register in build system
  console.log("\nStep 2: Registering in build system...");
  updateBuildStyles(destKebab, destCamel, destPascal);

  // Step 3: Print next steps
  console.log("\n" + "=".repeat(60));
  console.log("✓ Basemap scaffolding complete!");
  console.log("=".repeat(60));
  console.log("\nNext steps:");
  console.log("");
  console.log(`  1. Customize the theme colors and settings:`);
  console.log(`     basemaps/${destKebab}/styles/theme.ts`);
  console.log("");
  console.log(`  2. Build the styles:`);
  console.log(`     npm run build:styles`);
  console.log("");
  console.log(`  3. Preview your basemap:`);
  console.log(`     node serve.js`);
  console.log(`     http://localhost:8080/basemaps/${destKebab}/preview.html`);
  console.log("");
  console.log(`  4. (Optional) Customize shield sprites:`);
  console.log(`     npx tsx scripts/build-shields.ts ${destKebab}`);
  console.log("");
}

main();
