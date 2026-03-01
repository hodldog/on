#!/bin/bash
# HODL Dog - Codebase Export Script
# Создает единый markdown файл со всей кодовой базой для AI аудита

set -e

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
OUTPUT_FILE="codebase-export-${TIMESTAMP}.md"

echo "🐕 HODL Dog - Exporting codebase..."
echo "================================"

# Создаем заголовок
cat > "$OUTPUT_FILE" << 'EOF'
# HODL Dog - Codebase Export

**Generated:** TIMESTAMP_PLACEHOLDER
**Project:** HODL Dog Web3 Game
**Description:** Play-to-Earn platformer with Web3 integration

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [HTML Files](#html-files)
3. [JavaScript Files](#javascript-files)
4. [CSS Files](#css-files)
5. [Configuration](#configuration)

---

## 📁 Project Structure

EOF

# Заменяем timestamp
sed -i "s/TIMESTAMP_PLACEHOLDER/$(date -u +"%Y-%m-%d %H:%M:%S UTC")/" "$OUTPUT_FILE"

# Добавляем структуру проекта
echo "\`\`\`" >> "$OUTPUT_FILE"
find . -type f \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -not -path "./$OUTPUT_FILE" \
  -not -name "*.png" \
  -not -name "*.jpg" \
  -not -name "*.ico" \
  -not -name "*.svg" \
  | sort >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"

# Функция для добавления файла
add_file() {
    local file=$1
    local section=$2
    
    if [ -f "$file" ]; then
        echo "" >> "$OUTPUT_FILE"
        echo "### $file" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "\`\`\`${file##*.}" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
    fi
}

# HTML Files
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## 🌐 HTML Files" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for file in *.html; do
    [ -f "$file" ] && add_file "$file" "html"
done

# JavaScript Files
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## 📜 JavaScript Files" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for file in js/*.js; do
    [ -f "$file" ] && add_file "$file" "javascript"
done

# CSS Files
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## 🎨 CSS Files" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for file in css/*.css; do
    [ -f "$file" ] && add_file "$file" "css"
done

# Configuration Files
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## ⚙️ Configuration" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for file in manifest.json sw.js package.json .gitignore README.md; do
    [ -f "$file" ] && add_file "$file" "config"
done

# Завершение
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## 📊 Export Summary" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "- **Total Lines of Code:** $(find . -name "*.js" -o -name "*.html" -o -name "*.css" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')" >> "$OUTPUT_FILE"
echo "- **JavaScript Files:** $(find js -name "*.js" 2>/dev/null | wc -l)" >> "$OUTPUT_FILE"
echo "- **CSS Files:** $(find css -name "*.css" 2>/dev/null | wc -l)" >> "$OUTPUT_FILE"
echo "- **HTML Files:** $(find . -maxdepth 1 -name "*.html" 2>/dev/null | wc -l)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "*End of export*" >> "$OUTPUT_FILE"

echo ""
echo "✅ Export complete!"
echo "📄 File: $OUTPUT_FILE"
echo "📊 Size: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo ""
echo "Usage:"
echo "  cat $OUTPUT_FILE | xclip -selection clipboard  # Copy to clipboard"
echo "  # OR"
echo "  cat $OUTPUT_FILE | pbcopy                      # macOS"
echo ""
