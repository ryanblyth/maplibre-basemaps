/**
 * Rebuild clean sprite sheet with only POI icons and used shields for a specific basemap
 * 
 * Removes the large gap in the sprite sheet and keeps only:
 * - POI icons (airport, bar, bus, cafe, charging-station, fuel, hospital, lodging, museum, park, parking, police, rail, restaurant, school)
 * - Custom shields (shield-interstate-custom, shield-ushighway-custom, shield-state-custom)
 * 
 * Usage: npx tsx scripts/rebuild-sprites.ts <basemap-name>
 * Example: npx tsx scripts/rebuild-sprites.ts dark-blue
 * 
 * Note: Requires 'sharp' package: npm install sharp --save-dev
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

// Get basemap name from command line argument
const basemapName = process.argv[2] || 'dark-blue';
const BASEMAP_DIR = join('basemaps', basemapName);
const BASEMAP_SPRITES_DIR = join(BASEMAP_DIR, 'sprites');
const SHARED_SPRITES_DIR = 'shared/assets/sprites';
const SHIELDS_DIR = join(SHARED_SPRITES_DIR, 'shields');
const ICONS_DIR = join(SHARED_SPRITES_DIR, 'icons');

// Dynamically import theme based on basemap name
async function getBasemapShields() {
  try {
    // Try to import the theme module
    const themeModule = await import(`../${BASEMAP_DIR}/styles/theme.js`);
    const theme = themeModule[`${basemapName.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Theme`] || 
                  themeModule[`${basemapName}Theme`] ||
                  themeModule.default;
    
    if (theme?.shields) {
      return theme.shields;
    }
    
    throw new Error(`No shields configuration found in theme for ${basemapName}`);
  } catch (error) {
    console.error(`Error loading theme for ${basemapName}:`, error);
    throw error;
  }
}

interface SpriteDefinition {
  width: number;
  height: number;
  x: number;
  y: number;
  pixelRatio: number;
  sdf?: boolean;
}

interface SpriteSheet {
  [name: string]: SpriteDefinition;
}

// POI icons to use - only icons from shared/assets/sprites/icons/ folder
// Map: sprite name -> SVG filename
const poiIcons: Array<{ spriteName: string; svgFile: string }> = [
  { spriteName: 'airport', svgFile: 'airport.svg' },
  { spriteName: 'airfield', svgFile: 'airfield.svg' },  // Added airfield icon
  { spriteName: 'hospital', svgFile: 'hospital.svg' },
  { spriteName: 'museum', svgFile: 'museum.svg' },
  { spriteName: 'park', svgFile: 'park-alt1.svg' },  // park-alt1.svg -> park sprite
  { spriteName: 'rail', svgFile: 'rail.svg' },
  { spriteName: 'school', svgFile: 'college.svg' },  // college.svg -> school sprite
  { spriteName: 'stadium', svgFile: 'stadium.svg' },
  { spriteName: 'zoo', svgFile: 'zoo.svg' },
];

// Custom shields to keep (only the ones actually used)
const shields = [
  { name: 'shield-interstate-custom', file: 'shield-interstate-custom.svg', width: 28, height: 28, useTheme: 'interstate' },
  { name: 'shield-ushighway-custom', file: 'shield-ushighway-custom.svg', width: 26, height: 26, useTheme: 'usHighway' },
  { name: 'shield-state-custom', file: 'shield-state-custom.svg', width: 34, height: 34, useTheme: 'stateHighway' },
];

/**
 * Generate custom Interstate shield SVG with theme colors
 */
function generateCustomInterstateShield(config: any): string {
  const upperBg = config.upperBackground || '#2a3444';
  const lowerBg = config.lowerBackground || '#1e2530';
  const stroke = config.strokeColor || '#4a5a6a';
  const strokeWidth = config.strokeWidth || 2;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126 127.195">
  <path id="upper-bg" fill="${upperBg}" d="M105.641,6.931c1.471,1.92,4.06,5.614,6.623,10.817c1.428,2.898,2.965,6.522,4.295,10.774H9.442c3.471-11.056,8.596-18.556,10.921-21.592c3.528,1.204,11.163,3.373,20.353,3.373c10.34,0,19.353-2.578,22.285-3.515c2.934,0.937,11.946,3.515,22.286,3.515C94.478,10.304,102.112,8.136,105.641,6.931z"/>
  <path id="lower-bg" fill="${lowerBg}" d="M5.939,51.446c0-7.455,1.067-14.154,2.643-19.985h108.831c1.549,5.745,2.649,12.468,2.649,19.985c0,8-1.564,23.702-12.037,38.992C98.106,104.921,82.959,115.16,63,120.883c-19.959-5.723-35.106-15.962-45.024-30.444C7.502,75.148,5.939,59.446,5.939,51.446z"/>
  <path id="outline" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" d="M107.388,0.007l-1.957,0.817c-0.088,0.037-8.947,3.686-20.146,3.686c-11.3,0-21.18-3.465-21.276-3.499L63,0.652L61.993,1.01c-0.099,0.035-9.979,3.5-21.279,3.5c-11.198,0-20.057-3.648-20.142-3.684L18.612,0l-1.428,1.577C16.482,2.353,0,20.91,0,51.591c0,28.054,16.338,62.589,62.194,75.38L63,127.195l0.806-0.225C109.662,114.18,126,79.645,126,51.591c0-30.681-16.482-49.238-17.184-50.014L107.388,0.007z"/>
</svg>`;
}

/**
 * Generate custom US Highway shield SVG with theme colors
 */
function generateCustomUSHighwayShield(config: any): string {
  const background = config.background || '#1e2530';
  const stroke = config.strokeColor || '#4a5a6a';
  const strokeWidth = config.strokeWidth || 3;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path id="background" fill="${background}" d="M50,91.8c2.8-3.4,9.3-5.5,15.5-7.3c2-0.6,3.8-1.1,5.4-1.7c0.4-0.1,0.8-0.3,1.3-0.4c6.5-2.2,17.4-5.9,17.4-16.9c0-8-2.3-13-4.3-17.5c-1.5-3.3-2.8-6.2-2.8-9.5c0-6.5,5.1-14.8,6.6-17.2l-12-12.2c-9,4.6-19.5,3.7-24.9,0.5C51.4,9,50,8,50,8S48.6,9,47.6,9.6c-5.4,3.2-15.8,4-24.9-0.5l-12,12.2c1.6,2.4,6.6,10.7,6.6,17.2c0,3.3-1.3,6.2-2.8,9.5c-2,4.5-4.3,9.5-4.3,17.5c0,10.9,10.9,14.6,17.4,16.9c0.5,0.2,0.9,0.3,1.3,0.4c1.6,0.6,3.5,1.1,5.4,1.7C40.7,86.3,47.2,88.4,50,91.8z"/>
  <path id="outline" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" d="M50,95c0,0-2.6-4.5-15-8.3c-2-0.6-5-1.5-6.6-2c-0.4-0.1-0.8-0.3-1.3-0.4C20.6,82,8.4,77.9,8.4,65.5c0-8.4,2.5-13.9,4.5-18.3c1.4-3.1,2.6-5.8,2.6-8.6c0-7-6.7-16.7-6.7-16.8L8.2,21L22.4,6.6L23.1,7c9.1,4.9,19.2,3.5,23.5,0.9C48.1,7,50,5,50,5s1.9,2,3.4,2.9c4.3,2.6,14.5,4,23.5-0.9l0.7-0.4L91.8,21l-0.5,0.7c-0.1,0.1-6.7,9.8-6.7,16.8c0,2.9,1.2,5.6,2.6,8.6c2,4.4,4.5,9.9,4.5,18.3c0,12.4-12.2,16.5-18.7,18.8c-0.5,0.2-0.9,0.3-1.3,0.4c-1.6,0.6-4.6,1.4-6.6,2C52.6,90.5,50,95,50,95L50,95z"/>
</svg>`;
}

/**
 * Generate custom State Highway shield SVG with theme colors
 */
function generateCustomStateHighwayShield(config: any): string {
  const background = config.background || '#1a2433';
  const stroke = config.strokeColor || '#3a4a5c';
  const strokeWidth = config.strokeWidth || 2;
  
  // Read the SVG template and replace template variables
  const svgPath = join(SHIELDS_DIR, 'shield-state-custom.svg');
  let svgTemplate = readFileSync(svgPath, 'utf8');
  
  // Replace template variables
  svgTemplate = svgTemplate.replace(/\{\{background\}\}/g, background);
  svgTemplate = svgTemplate.replace(/\{\{stroke\}\}/g, stroke);
  svgTemplate = svgTemplate.replace(/\{\{strokeWidth\}\}/g, strokeWidth.toString());
  
  return svgTemplate;
}

async function rebuildSprites() {
  console.log(`Rebuilding clean sprite sheets for basemap: ${basemapName}\n`);
  
  // Ensure basemap sprite directory exists
  mkdirSync(BASEMAP_SPRITES_DIR, { recursive: true });
  
  // Load basemap-specific theme
  const basemapShields = await getBasemapShields();
  
  // Verify icons directory exists
  if (!existsSync(ICONS_DIR)) {
    console.error(`Error: Icons directory not found at ${ICONS_DIR}`);
    process.exit(1);
  }
  
  await rebuildSpriteSheet(1, basemapShields);
  await rebuildSpriteSheet(2, basemapShields);
  
  console.log(`\n✓ Clean sprite sheets rebuilt for ${basemapName}!`);
  console.log('  - POI icons: ' + poiIcons.length + ' icons (from shared/assets/sprites/icons/)');
  console.log('  - Shields: ' + shields.length + ' custom shields (basemap-specific)');
}

async function rebuildSpriteSheet(
  pixelRatio: number, 
  basemapShields: any
) {
  const suffix = pixelRatio === 1 ? '' : `@${pixelRatio}x`;
  const jsonPath = join(BASEMAP_SPRITES_DIR, `basemap${suffix}.json`);
  const pngPath = join(BASEMAP_SPRITES_DIR, `basemap${suffix}.png`);
  
  console.log(`\nBuilding ${pixelRatio}x sprite sheet...`);
  
  // Build POI icons directly from SVG files
  const poiDefinitions: { name: string; def: SpriteDefinition; buffer: Buffer }[] = [];
  const poiComposites: any[] = [];
  const newJson: SpriteSheet = {};
  
  // Standard POI icon size (21x21 at 1x, 42x42 at 2x)
  const iconSize = 21 * pixelRatio;
  let currentX = 0;
  let currentY = 0;
  let maxPoiY = 0;
  let maxPoiX = 0;
  
  console.log('  Building POI icons from SVG files...');
  for (const icon of poiIcons) {
    const svgPath = join(ICONS_DIR, icon.svgFile);
    
    if (!existsSync(svgPath)) {
      console.warn(`    Warning: ${icon.svgFile} not found, skipping ${icon.spriteName}`);
      continue;
    }
    
    // Read SVG and convert to PNG
    const svgBuffer = readFileSync(svgPath);
    const pngBuffer = await sharp(svgBuffer)
      .resize(iconSize, iconSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();
    
    poiDefinitions.push({
      name: icon.spriteName,
      def: {
        width: iconSize,
        height: iconSize,
        x: currentX,
        y: currentY,
        pixelRatio: pixelRatio,
        sdf: true  // POI icons are SDF for color flexibility
      },
      buffer: pngBuffer
    });
    
    newJson[icon.spriteName] = {
      width: iconSize,
      height: iconSize,
      x: currentX,
      y: currentY,
      pixelRatio: pixelRatio,
      sdf: true
    };
    
    poiComposites.push({
      input: pngBuffer,
      left: currentX,
      top: currentY
    });
    
    // Arrange icons in a grid (5 icons per row)
    // Update max width BEFORE moving to next position
    maxPoiX = Math.max(maxPoiX, currentX + iconSize);
    maxPoiY = Math.max(maxPoiY, currentY + iconSize);
    
    // Move to next position
    currentX += iconSize;
    if (currentX >= iconSize * 5) {
      currentX = 0;
      currentY += iconSize;
    }
    
    console.log(`    Added ${icon.spriteName} (from ${icon.svgFile}): ${iconSize}x${iconSize} at (${newJson[icon.spriteName].x}, ${newJson[icon.spriteName].y})`);
  }
  
  const poiSheetHeight = maxPoiY;
  const poiSheetWidth = maxPoiX;
  
  console.log(`  POI icons: ${poiDefinitions.length} icons in ${poiSheetWidth}x${poiSheetHeight}px`);
  
  // Build shields with basemap-specific colors
  console.log('  Building shields with basemap-specific colors...');
  let shieldY = poiSheetHeight;
  const shieldComposites: any[] = [];
  let maxShieldWidth = 0;
  
  for (const shield of shields) {
    let svgBuffer: Buffer;
    const shieldWithTheme = shield as any;
    
    if (shieldWithTheme.useTheme === 'interstate') {
      svgBuffer = Buffer.from(generateCustomInterstateShield(basemapShields.interstate));
    } else if (shieldWithTheme.useTheme === 'usHighway') {
      svgBuffer = Buffer.from(generateCustomUSHighwayShield(basemapShields.usHighway));
    } else if (shieldWithTheme.useTheme === 'stateHighway') {
      svgBuffer = Buffer.from(generateCustomStateHighwayShield(basemapShields.stateHighway));
    } else {
      const svgPath = join(SHIELDS_DIR, shield.file);
      if (!existsSync(svgPath)) {
        console.warn(`    Warning: ${svgPath} not found, skipping`);
        continue;
      }
      svgBuffer = readFileSync(svgPath);
    }
    
    const physicalWidth = shield.width * pixelRatio;
    const physicalHeight = shield.height * pixelRatio;
    
    const pngBuffer = await sharp(svgBuffer)
      .resize(physicalWidth, physicalHeight)
      .png()
      .toBuffer();
    
    newJson[shield.name] = {
      width: physicalWidth,
      height: physicalHeight,
      x: 0,
      y: shieldY,
      pixelRatio: pixelRatio,
    };
    
    shieldComposites.push({
      input: pngBuffer,
      left: 0,
      top: shieldY
    });
    
    maxShieldWidth = Math.max(maxShieldWidth, physicalWidth);
    shieldY += physicalHeight;
    
    console.log(`    Added ${shield.name}: ${physicalWidth}x${physicalHeight} at y=${newJson[shield.name].y}`);
  }
  
  const totalWidth = Math.max(poiSheetWidth, maxShieldWidth);
  const totalHeight = shieldY;
  
  // Create new sprite sheet
  await sharp({
    create: {
      width: totalWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([...poiComposites, ...shieldComposites])
    .png()
    .toFile(pngPath);
  
  // Write JSON
  writeFileSync(jsonPath, JSON.stringify(newJson, null, 2), 'utf8');
  
  console.log(`  ✓ Created ${pngPath} (${totalWidth}x${totalHeight}px)`);
  console.log(`  ✓ Updated ${jsonPath}`);
}

rebuildSprites().catch(console.error);
