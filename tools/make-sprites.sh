#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "⚠️  WARNING: This will rebuild shared sprite files in shared/assets/sprites/"
echo "   These files are only needed if you've added/modified POI icons."
echo "   Shield color changes do NOT require rebuilding shared sprites."
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

mkdir -p shared/assets/sprites

# Build SDF sprite (normal)
docker run --rm   -v "$PWD/assets-src/icons:/app/icons:ro"   -v "$PWD/shared/assets/sprites:/app/output"   ghcr.io/flother/spreet:latest   --sdf /app/icons /app/output/basemap

# Build SDF sprite (retina @2x)
docker run --rm   -v "$PWD/assets-src/icons:/app/icons:ro"   -v "$PWD/shared/assets/sprites:/app/output"   ghcr.io/flother/spreet:latest   --sdf --retina /app/icons /app/output/basemap@2x

echo "✓ Sprites written to shared/assets/sprites/"
echo "  Add this to your style:  \"sprite\": \"http://localhost:8080/shared/assets/sprites/basemap\""
