/**
 * Diagnostic script to identify what's triggering sprite file rebuilds
 * 
 * Usage: npx tsx scripts/diagnose-sprite-rebuilds.ts
 * 
 * This script checks:
 * - File modification times
 * - Running processes that might rebuild sprites
 * - Git hooks or automation
 * - IDE configurations
 */

import { statSync, existsSync } from 'fs';
import { join } from 'path';

const SHARED_SPRITES = [
  'shared/assets/sprites/basemap.json',
  'shared/assets/sprites/basemap.png',
  'shared/assets/sprites/basemap@2x.json',
  'shared/assets/sprites/basemap@2x.png',
];

const BASEMAP_SPRITES = [
  'basemaps/dark-blue/sprites/basemap.json',
  'basemaps/dark-blue/sprites/basemap.png',
  'basemaps/dark-blue/sprites/basemap@2x.json',
  'basemaps/dark-blue/sprites/basemap@2x.png',
];

function getFileInfo(filePath: string) {
  if (!existsSync(filePath)) {
    return { exists: false, mtime: null, size: null };
  }
  
  const stats = statSync(filePath);
  return {
    exists: true,
    mtime: stats.mtime,
    size: stats.size,
  };
}

function formatDate(date: Date | null): string {
  if (!date) return 'N/A';
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

console.log('🔍 Sprite File Diagnostic');
console.log('=========================\n');

console.log('📁 Shared Sprite Files:');
console.log('----------------------');
for (const file of SHARED_SPRITES) {
  const info = getFileInfo(file);
  if (info.exists) {
    console.log(`  ${file}`);
    console.log(`    Modified: ${formatDate(info.mtime)}`);
    console.log(`    Size: ${info.size} bytes`);
  } else {
    console.log(`  ${file} - NOT FOUND`);
  }
}

console.log('\n📁 Basemap Sprite Files:');
console.log('----------------------');
for (const file of BASEMAP_SPRITES) {
  const info = getFileInfo(file);
  if (info.exists) {
    console.log(`  ${file}`);
    console.log(`    Modified: ${formatDate(info.mtime)}`);
    console.log(`    Size: ${info.size} bytes`);
  } else {
    console.log(`  ${file} - NOT FOUND`);
  }
}

console.log('\n🔧 Build Scripts:');
console.log('-----------------');
console.log('  build-styles.ts: Does NOT rebuild sprites');
console.log('  rebuild-sprites.ts: Rebuilds basemap sprites (not shared)');
console.log('  build-shields.ts: Updates shields in basemap sprites');
console.log('  make-sprites.sh: Rebuilds SHARED sprites (requires Docker)');

console.log('\n💡 Recommendations:');
console.log('------------------');
console.log('  1. Shared sprites should only be rebuilt when POI icons change');
console.log('  2. Shield color changes only require: npx tsx scripts/build-shields.ts dark-blue');
console.log('  3. If shared sprites are being rebuilt, check:');
console.log('     - IDE file watchers or tasks');
console.log('     - Manual runs of "make sprite"');
console.log('     - Any automation scripts');

console.log('\n✅ Diagnostic complete!\n');

