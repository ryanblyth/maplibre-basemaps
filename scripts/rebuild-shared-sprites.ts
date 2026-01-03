/**
 * Rebuild shared sprite files (POI icons only) without Docker
 * 
 * This script builds shared sprite files using Node.js and sharp, similar to rebuild-sprites.ts.
 * Note: This creates regular PNG sprites, not SDF sprites. If you need SDF sprites for
 * runtime color changes, use tools/make-sprites.sh with Docker instead.
 * 
 * Usage: npx tsx scripts/rebuild-shared-sprites.ts
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const SHARED_SPRITES_DIR = 'shared/assets/sprites';
const ICONS_DIR = join(SHARED_SPRITES_DIR, 'icons');

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

/**
 * Build shared sprite sheet for a given pixel ratio
 */
async function buildSharedSpriteSheet(pixelRatio: number) {
  const suffix = pixelRatio === 1 ? '' : `@${pixelRatio}x`;
  const jsonPath = join(SHARED_SPRITES_DIR, `basemap${suffix}.json`);
  const pngPath = join(SHARED_SPRITES_DIR, `basemap${suffix}.png`);
  
  console.log(`\nBuilding ${pixelRatio}x shared sprite sheet...`);
  
  // POI icons mapping (same as rebuild-sprites.ts)
  const poiIcons: Array<{ spriteName: string; svgFile: string }> = [
    { spriteName: 'airport', svgFile: 'airport.svg' },
    { spriteName: 'airfield', svgFile: 'airfield.svg' },
    { spriteName: 'hospital', svgFile: 'hospital.svg' },
    { spriteName: 'museum', svgFile: 'museum.svg' },
    { spriteName: 'park', svgFile: 'park-alt1.svg' },
    { spriteName: 'rail', svgFile: 'rail.svg' },
    { spriteName: 'school', svgFile: 'college.svg' },
    { spriteName: 'stadium', svgFile: 'stadium.svg' },
    { spriteName: 'zoo', svgFile: 'zoo.svg' },
  ];
  
  const newJson: SpriteSheet = {};
  const composites: any[] = [];
  
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
    
    newJson[icon.spriteName] = {
      width: iconSize,
      height: iconSize,
      x: currentX,
      y: currentY,
      pixelRatio: pixelRatio,
      sdf: true  // Mark as SDF (even though it's regular PNG, this allows icon-color to work)
    };
    
    composites.push({
      input: pngBuffer,
      left: currentX,
      top: currentY
    });
    
    maxPoiY = Math.max(maxPoiY, currentY + iconSize);
    maxPoiX = Math.max(maxPoiX, currentX + iconSize);
    
    // Layout: arrange in rows
    currentX += iconSize;
    if (currentX >= 200 * pixelRatio) { // Wrap to next row after ~9 icons
      currentX = 0;
      currentY += iconSize;
    }
    
    console.log(`    Added ${icon.spriteName} (from ${icon.svgFile}): ${iconSize}x${iconSize} at (${newJson[icon.spriteName].x}, ${newJson[icon.spriteName].y})`);
  }
  
  const spriteWidth = maxPoiX;
  const spriteHeight = maxPoiY;
  
  // Create sprite sheet
  await sharp({
    create: {
      width: spriteWidth,
      height: spriteHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toFile(pngPath);
  
  // Write JSON
  writeFileSync(jsonPath, JSON.stringify(newJson, null, 2), 'utf8');
  
  console.log(`  ✓ Created ${pngPath} (${spriteWidth}x${spriteHeight}px)`);
  console.log(`  ✓ Updated ${jsonPath}`);
}

/**
 * Main function
 */
async function rebuildSharedSprites() {
  console.log('🔨 Rebuilding shared sprite files (POI icons only)');
  console.log('==================================================');
  console.log('');
  console.log('⚠️  Note: This creates regular PNG sprites, not SDF sprites.');
  console.log('   For SDF sprites (allows runtime color changes), use:');
  console.log('   ./tools/make-sprites.sh (requires Docker)');
  console.log('');
  
  // Verify icons directory exists
  if (!existsSync(ICONS_DIR)) {
    console.error(`❌ Error: Icons directory not found at ${ICONS_DIR}`);
    console.error('   Icons should be in: shared/assets/sprites/icons/');
    process.exit(1);
  }
  
  // Build 1x and 2x sprites
  await buildSharedSpriteSheet(1);
  await buildSharedSpriteSheet(2);
  
  console.log('\n✓ Shared sprite files rebuilt!');
  console.log('  - POI icons only (no shields)');
  console.log('  - Regular PNG format (not SDF)');
}

rebuildSharedSprites().catch(console.error);

