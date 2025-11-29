#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p shared/assets/sprites

# Build SDF sprite (normal)
docker run --rm   -v "$PWD/assets-src/icons:/app/icons:ro"   -v "$PWD/shared/assets/sprites:/app/output"   ghcr.io/flother/spreet:latest   --sdf /app/icons /app/output/basemap

# Build SDF sprite (retina @2x)
docker run --rm   -v "$PWD/assets-src/icons:/app/icons:ro"   -v "$PWD/shared/assets/sprites:/app/output"   ghcr.io/flother/spreet:latest   --sdf --retina /app/icons /app/output/basemap@2x

echo "✓ Sprites written to shared/assets/sprites/"
echo "  Add this to your style:  \"sprite\": \"http://localhost:8080/shared/assets/sprites/basemap\""
