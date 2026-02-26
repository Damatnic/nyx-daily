const fs = require('fs');
const path = require('path');

// Try using sharp (available via Next.js)
async function generateIcons() {
  try {
    const sharp = require('sharp');
    const publicDir = path.join(__dirname, '..', 'public');

    // Generate 192x192 icon
    const svg192 = fs.readFileSync(path.join(publicDir, 'icon-192.svg'));
    await sharp(svg192)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('Created icon-192.png');

    // Generate 512x512 icon
    const svg512 = fs.readFileSync(path.join(publicDir, 'icon-512.svg'));
    await sharp(svg512)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('Created icon-512.png');

    console.log('Done! Icons generated successfully.');
  } catch (err) {
    console.error('Error generating icons:', err.message);
    console.log('SVG icons are available as fallback.');
    process.exit(1);
  }
}

generateIcons();
