#!/usr/bin/env bash
# Quick script to view sprite PNG files

SPRITE_PATH="${1:-basemaps/dark-blue/sprites/basemap}"

if [ ! -f "${SPRITE_PATH}.png" ]; then
    echo "Error: ${SPRITE_PATH}.png not found"
    exit 1
fi

echo "Viewing: ${SPRITE_PATH}.png"
echo ""

# Try different methods to open the image
if command -v open > /dev/null; then
    # macOS
    open "${SPRITE_PATH}.png"
elif command -v xdg-open > /dev/null; then
    # Linux
    xdg-open "${SPRITE_PATH}.png"
elif command -v start > /dev/null; then
    # Windows
    start "${SPRITE_PATH}.png"
else
    echo "Please open this file manually: ${SPRITE_PATH}.png"
fi

# Also show dimensions and info
if command -v identify > /dev/null; then
    echo "Image info:"
    identify "${SPRITE_PATH}.png"
elif command -v file > /dev/null; then
    echo "File info:"
    file "${SPRITE_PATH}.png"
fi

echo ""
echo "To view with grid overlay in browser:"
echo "  Open: http://localhost:8080/scripts/view-sprite.html?path=${SPRITE_PATH}"
