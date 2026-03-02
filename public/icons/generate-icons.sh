#!/bin/bash
# Generate icons from SVG

SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#28a745"/><path d="M20 32 L28 40 L44 22" stroke="white" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'

echo "$SVG" > icon.svg

# Note: In real scenario, use ImageMagick or similar
# For now, we'll use the SVG directly with different sizes

# Copy to different sizes
cp icon.svg icon-16.svg
cp icon.svg icon-32.svg
cp icon.svg icon-192.svg
cp icon.svg icon-512.svg

echo "Icons generated"
