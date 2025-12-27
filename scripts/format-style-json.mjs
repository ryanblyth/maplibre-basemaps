#!/usr/bin/env node

/**
 * Standalone script to reformat an existing style.json file
 * Follows the formatting rules defined in docs/style-json-formatting.md
 * 
 * Usage: npx tsx scripts/format-style-json.mjs
 * 
 * This script reads and reformats an existing style.json file.
 * For build-time formatting, see scripts/build-styles.ts which uses
 * the shared formatJSON function from scripts/format-json.ts
 * 
 * Note: This script must be run with tsx (not node) to import the TypeScript module.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatJSON } from './format-json.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main execution
const styleJsonPath = path.join(__dirname, '..', 'basemaps', 'dark-blue', 'style.json');

console.log('Reading style.json...');
const content = fs.readFileSync(styleJsonPath, 'utf8');

console.log('Parsing JSON...');
let json;
try {
  json = JSON.parse(content);
} catch (e) {
  console.error('❌ Failed to parse JSON:', e.message);
  process.exit(1);
}

console.log('Formatting according to rules...');
const formatted = formatJSON(json);

console.log('Writing formatted JSON...');
fs.writeFileSync(styleJsonPath, formatted + '\n', 'utf8');

// Validate by parsing again
console.log('Validating formatted JSON...');
try {
  JSON.parse(formatted);
  console.log('✅ JSON is valid!');
  
  const originalLines = content.split('\n').length;
  const formattedLines = formatted.split('\n').length;
  const reduction = ((originalLines - formattedLines) / originalLines * 100).toFixed(1);
  
  console.log(`\n📊 Results:`);
  console.log(`   Original: ${originalLines} lines`);
  console.log(`   Formatted: ${formattedLines} lines`);
  console.log(`   Reduction: ${reduction}%`);
} catch (e) {
  console.error('❌ JSON validation failed:', e.message);
  console.error('   Error at position:', e.message.match(/position (\d+)/)?.[1] || 'unknown');
  process.exit(1);
}
