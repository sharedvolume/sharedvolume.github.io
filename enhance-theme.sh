#!/bin/bash

# Light Theme Enhancement Script
# This script adds additional light theme CSS to the generated GitBook

echo "🎨 Applying beautiful light theme enhancements..."

# Add light enhancement CSS to all HTML files
find _site -name "*.html" -type f -exec sed -i '' 's/<\/head>/<link rel="stylesheet" href="..\/book\/styles\/light-enhancements.css"><\/head>/g' {} \;

# Add modern favicon
echo "📱 Adding modern favicon..."

# Create a simple SVG favicon
cat > _site/favicon.ico << 'EOF'
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="url(#grad)"/>
  <path d="M8 12h16v2H8zm0 4h16v2H8zm0 4h12v2H8z" fill="white"/>
</svg>
EOF

echo "✨ Light theme enhancements applied successfully!"
echo "🚀 Your GitBook now has a beautiful, modern light theme!"
