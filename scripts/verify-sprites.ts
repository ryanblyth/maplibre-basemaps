/**
 * Verify sprite files for duplicate shields
 * 
 * Usage: npx tsx scripts/verify-sprites.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SHARED_SPRITES = 'shared/assets/sprites/basemap.json';
const BASEMAP_SPRITES = 'basemaps/dark-blue/sprites/basemap.json';

console.log('🔍 Verifying Sprite Files\n');

// Check shared sprites
if (existsSync(SHARED_SPRITES)) {
  const sharedJson = JSON.parse(readFileSync(SHARED_SPRITES, 'utf8'));
  const sharedShields = Object.keys(sharedJson).filter(k => k.startsWith('shield-'));
  
  console.log('📁 Shared Sprites (shared/assets/sprites/basemap.json):');
  if (sharedShields.length > 0) {
    console.log(`  ❌ Found ${sharedShields.length} shield(s) (should be 0):`);
    sharedShields.forEach(s => console.log(`     - ${s}`));
    console.log('  ⚠️  Shields should NOT be in shared sprites!');
  } else {
    console.log('  ✅ No shields found (correct)');
  }
  console.log(`  📊 Total sprites: ${Object.keys(sharedJson).length}`);
} else {
  console.log('  ⚠️  Shared sprite JSON not found');
}

console.log('');

// Check basemap sprites
if (existsSync(BASEMAP_SPRITES)) {
  const basemapJson = JSON.parse(readFileSync(BASEMAP_SPRITES, 'utf8'));
  const basemapShields = Object.keys(basemapJson).filter(k => k.startsWith('shield-'));
  
  console.log('📁 Basemap Sprites (basemaps/dark-blue/sprites/basemap.json):');
  if (basemapShields.length === 3) {
    console.log(`  ✅ Found ${basemapShields.length} shield(s) (correct):`);
    basemapShields.forEach(s => console.log(`     - ${s}`));
  } else if (basemapShields.length > 3) {
    console.log(`  ❌ Found ${basemapShields.length} shield(s) (should be 3):`);
    basemapShields.forEach(s => console.log(`     - ${s}`));
    console.log('  ⚠️  Duplicate shields detected!');
  } else {
    console.log(`  ⚠️  Found ${basemapShields.length} shield(s) (expected 3)`);
  }
  console.log(`  📊 Total sprites: ${Object.keys(basemapJson).length}`);
} else {
  console.log('  ⚠️  Basemap sprite JSON not found');
}

console.log('\n💡 Note: PNG files may still contain shield images even if JSON is clean.');
console.log('   To regenerate PNG files:');
console.log('   - Shared: npx tsx scripts/rebuild-shared-sprites.ts (no Docker)');
console.log('            or ./tools/make-sprites.sh (requires Docker, creates SDF sprites)');
console.log('   - Basemap: npx tsx scripts/rebuild-sprites.ts dark-blue');

