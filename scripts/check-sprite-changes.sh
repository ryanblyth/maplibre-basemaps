#!/usr/bin/env bash
# Diagnostic script to check if sprite files are being modified
# Usage: ./scripts/check-sprite-changes.sh

set -euo pipefail
cd "$(dirname "$0")/.."

echo "🔍 Sprite File Change Monitor"
echo "=============================="
echo ""
echo "This script will monitor sprite files for changes."
echo "Press Ctrl+C to stop monitoring."
echo ""

SHARED_SPRITES="shared/assets/sprites/basemap.json shared/assets/sprites/basemap.png"
BASEMAP_SPRITES="basemaps/dark-blue/sprites/basemap.json basemaps/dark-blue/sprites/basemap.png"

# Get initial timestamps
get_timestamps() {
  for file in $SHARED_SPRITES $BASEMAP_SPRITES; do
    if [ -f "$file" ]; then
      stat -f "%Sm %N" -t "%Y-%m-%d %H:%M:%S" "$file" 2>/dev/null || ls -l "$file" | awk '{print $6, $7, $8, $9}'
    fi
  done
}

echo "Initial timestamps:"
get_timestamps
echo ""
echo "Monitoring for changes (checking every 5 seconds)..."
echo ""

LAST_CHECK=$(date +%s)
while true; do
  sleep 5
  CURRENT_CHECK=$(date +%s)
  
  # Check if files changed
  for file in $SHARED_SPRITES $BASEMAP_SPRITES; do
    if [ -f "$file" ]; then
      CURRENT_TIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file" 2>/dev/null || stat -c "%y" "$file" 2>/dev/null | cut -d'.' -f1)
      echo "[$(date +%H:%M:%S)] Checking $file..."
    fi
  done
  
  # Check for processes that might be modifying sprites
  SPRITE_PROCESSES=$(ps aux | grep -E "(make-sprites|rebuild-sprites|build-shields|spreet|docker.*sprites)" | grep -v grep || true)
  if [ -n "$SPRITE_PROCESSES" ]; then
    echo "⚠️  WARNING: Sprite-related processes detected:"
    echo "$SPRITE_PROCESSES"
    echo ""
  fi
done

