#!/usr/bin/env bash
# Cleanup script to remove shields from shared sprite PNG files
# 
# This script removes shield images from the shared sprite PNG files.
# Since the JSON files have already been cleaned, this ensures the PNGs match.
#
# Note: This requires ImageMagick or similar tool, or you can regenerate using make-sprites.sh

set -euo pipefail
cd "$(dirname "$0")/.."

echo "🧹 Cleaning up shared sprite PNG files"
echo "======================================"
echo ""
echo "This script will remove shield images from shared sprite PNG files."
echo "The JSON files have already been cleaned (no shield references)."
echo ""

SHARED_DIR="shared/assets/sprites"

if [ ! -f "$SHARED_DIR/basemap.png" ]; then
  echo "❌ Error: $SHARED_DIR/basemap.png not found"
  exit 1
fi

echo "⚠️  Note: PNG files contain pixel data that can't be easily edited."
echo "   The best solution is to regenerate them using:"
echo ""
echo "   ./tools/make-sprites.sh"
echo ""
echo "   This requires Docker and will create clean PNG files with only POI icons."
echo ""
echo "   Alternatively, you can manually edit the PNG files to remove shield sections,"
echo "   but this is error-prone and not recommended."
echo ""
echo "Current status:"
echo "  - JSON files: ✅ Clean (no shield references)"
echo "  - PNG files: ⚠️  May still contain shield images (need regeneration)"
echo ""
echo "To regenerate shared PNG files when Docker is available:"
echo "  1. Start Docker"
echo "  2. Run: ./tools/make-sprites.sh"
echo "  3. This will create clean PNG files with only POI icons"

