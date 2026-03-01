#!/bin/bash
# StealthGuard - Codebase Export Script

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
OUTPUT_FILE="codebase-export-${TIMESTAMP}.md"

echo "🛡️ StealthGuard - Exporting codebase..."

cat > "$OUTPUT_FILE" << EOF
# StealthGuard Rescue - Codebase Export

**Generated:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")
**Version:** 3.2.0

---

## Project Structure

\`\`\`
$(find . -type f -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./dist/*" | sort)
\`\`\`

---

EOF

# Add all source files
for file in $(find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.sol" -o -name "*.html" -o -name "*.css" -o -name "*.json" \) -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./dist/*" | sort); do
  echo "Adding: $file"
  echo "### $file" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "\`\`\`${file##*.}" >> "$OUTPUT_FILE"
  cat "$file" >> "$OUTPUT_FILE"
  echo "\`\`\`" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
done

echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "*End of export*" >> "$OUTPUT_FILE"

chmod +x "$OUTPUT_FILE" 2>/dev/null || true

echo ""
echo "✅ Export complete: $OUTPUT_FILE"
echo "📊 Size: $(du -h "$OUTPUT_FILE" | cut -f1)"
