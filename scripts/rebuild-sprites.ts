/**
 * Rebuild clean sprite sheet with only POI icons and used shields
 * 
 * Removes the large gap in the sprite sheet and keeps only:
 * - POI icons (airport, bar, bus, cafe, charging-station, fuel, hospital, lodging, museum, park, parking, police, rail, restaurant, school)
 * - Custom shields (shield-interstate-custom, shield-ushighway-custom, shield-state-custom)
 * 
 * Usage: npx tsx scripts/rebuild-sprites.ts
 * 
 * Note: Requires 'sharp' package: npm install sharp --save-dev
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { darkBlueShields } from '../basemaps/dark-blue/styles/theme.js';

const SPRITES_DIR = 'shared/assets/sprites';
const SHIELDS_DIR = join(SPRITES_DIR, 'shields');

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

// POI icons to keep (all of them)
const poiIcons = [
  'airport', 'bar', 'bus', 'cafe', 'charging-station', 'fuel',
  'hospital', 'lodging', 'museum', 'park', 'parking', 'police',
  'rail', 'restaurant', 'school'
];

// Custom shields to keep (only the ones actually used)
const shields = [
  { name: 'shield-interstate-custom', file: 'shield-interstate-custom.svg', width: 28, height: 28, useTheme: 'interstate' },
  { name: 'shield-ushighway-custom', file: 'shield-ushighway-custom.svg', width: 26, height: 26, useTheme: 'usHighway' },
  { name: 'shield-state-custom', file: 'shield-state-custom.svg', width: 32, height: 34, useTheme: 'stateHighway' },
];

/**
 * Generate custom Interstate shield SVG with theme colors
 */
function generateCustomInterstateShield(): string {
  const config = darkBlueShields.interstate;
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
function generateCustomUSHighwayShield(): string {
  const config = darkBlueShields.usHighway;
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
function generateCustomStateHighwayShield(): string {
  const config = darkBlueShields.stateHighway;
  const background = config.background || '#1a2433';
  const stroke = config.strokeColor || '#3a4a5c';
  const strokeWidth = config.strokeWidth || 2;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 34">
  <rect x="2" y="5" width="28" height="24" rx="1" ry="1" fill="${background}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
</svg>`;
}

async function rebuildSprites() {
  console.log('Rebuilding clean sprite sheets...\n');
  
  await rebuildSpriteSheet(1);
  await rebuildSpriteSheet(2);
  
  console.log('\n✓ Clean sprite sheets rebuilt!');
  console.log('  - POI icons: ' + poiIcons.length + ' icons');
  console.log('  - Shields: ' + shields.length + ' custom shields');
}

async function rebuildSpriteSheet(pixelRatio: number) {
  const suffix = pixelRatio === 1 ? '' : `@${pixelRatio}x`;
  const jsonPath = join(SPRITES_DIR, `basemap${suffix}.json`);
  const pngPath = join(SPRITES_DIR, `basemap${suffix}.png`);
  
  console.log(`\nBuilding ${pixelRatio}x sprite sheet...`);
  
  // Load existing sprite sheet to extract POI icons
  const existingJson: SpriteSheet = JSON.parse(readFileSync(jsonPath, 'utf8'));
  const existingPng = sharp(pngPath);
  const metadata = await existingPng.metadata();
  
  // Extract POI icons from existing sprite, preserving their layout
  const poiDefinitions: { name: string; def: SpriteDefinition; buffer: Buffer }[] = [];
  let maxPoiY = 0;
  let maxPoiX = 0;
  
  console.log('  Extracting POI icons...');
  for (const iconName of poiIcons) {
    const def = existingJson[iconName];
    if (!def) {
      console.warn(`    Warning: ${iconName} not found in existing sprite`);
      continue;
    }
    
    // POI icons are already at the correct pixel ratio in the existing sprite
    // We just need to extract them as-is
    const physicalWidth = def.width;
    const physicalHeight = def.height;
    const physicalX = def.x;
    const physicalY = def.y;
    
    // Extract icon from existing sprite
    const iconBuffer = await existingPng
      .clone()
      .extract({
        left: physicalX,
        top: physicalY,
        width: physicalWidth,
        height: physicalHeight
      })
      .png()
      .toBuffer();
    
    poiDefinitions.push({
      name: iconName,
      def: {
        width: physicalWidth,
        height: physicalHeight,
        x: physicalX,
        y: physicalY, // Keep original positions
        pixelRatio: pixelRatio,
        sdf: def.sdf
      },
      buffer: iconBuffer
    });
    
    maxPoiX = Math.max(maxPoiX, physicalX + physicalWidth);
    maxPoiY = Math.max(maxPoiY, physicalY + physicalHeight);
  }
  
  // Use original POI layout (they're already arranged nicely)
  const poiComposites: any[] = [];
  const newJson: SpriteSheet = {};
  
  for (const { name, def, buffer } of poiDefinitions) {
    newJson[name] = def;
    poiComposites.push({
      input: buffer,
      left: def.x,
      top: def.y
    });
  }
  
  const poiSheetHeight = maxPoiY;
  const poiSheetWidth = maxPoiX;
  
  console.log(`  POI icons: ${poiDefinitions.length} icons in ${poiSheetWidth}x${poiSheetHeight}px`);
  
  // Build shields
  console.log('  Building shields...');
  let shieldY = poiSheetHeight;
  const shieldComposites: any[] = [];
  let maxShieldWidth = 0;
  
  for (const shield of shields) {
    let svgBuffer: Buffer;
    const shieldWithTheme = shield as any;
    
    if (shieldWithTheme.useTheme === 'interstate') {
      svgBuffer = Buffer.from(generateCustomInterstateShield());
    } else if (shieldWithTheme.useTheme === 'usHighway') {
      svgBuffer = Buffer.from(generateCustomUSHighwayShield());
    } else if (shieldWithTheme.useTheme === 'stateHighway') {
      svgBuffer = Buffer.from(generateCustomStateHighwayShield());
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

