import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const LOGO_PATH = path.resolve('public/logo.jpeg');
const RES_DIR = path.resolve('android/app/src/main/res');

async function generateAssets() {
  console.log('Generating App Icons and Splash Screens from public/logo.jpeg...');

  if (!fs.existsSync(LOGO_PATH)) {
    console.error('Error: public/logo.jpeg not found!');
    process.exit(1);
  }

  // 1. Icon resolutions (Mipmap)
  const mipmapSizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
  };

  for (const [folder, size] of Object.entries(mipmapSizes)) {
    const targetDir = path.join(RES_DIR, folder);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // Square Icon
    await sharp(LOGO_PATH)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round Icon with circular mask
    const circleSvg = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#fff"/></svg>`
    );
    const circularLogo = await sharp(LOGO_PATH)
      .resize(size, size, { fit: 'cover' })
      .composite([{ input: circleSvg, blend: 'dest-in' }])
      .png()
      .toBuffer();

    await sharp(circularLogo).toFile(path.join(targetDir, 'ic_launcher_round.png'));
    await sharp(LOGO_PATH).resize(size, size, { fit: 'cover' }).png().toFile(path.join(targetDir, 'ic_launcher_foreground.png'));
  }

  // 2. Splash Screen Resolutions (Portrait & Landscape)
  const splashSizes = [
    { folder: 'drawable', width: 1080, height: 1920 },
    { folder: 'drawable-port-mdpi', width: 320, height: 480 },
    { folder: 'drawable-port-hdpi', width: 480, height: 800 },
    { folder: 'drawable-port-xhdpi', width: 720, height: 1280 },
    { folder: 'drawable-port-xxhdpi', width: 960, height: 1600 },
    { folder: 'drawable-port-xxxhdpi', width: 1280, height: 1920 },
    { folder: 'drawable-land-mdpi', width: 480, height: 320 },
    { folder: 'drawable-land-hdpi', width: 800, height: 480 },
    { folder: 'drawable-land-xhdpi', width: 1280, height: 720 },
    { folder: 'drawable-land-xxhdpi', width: 1600, height: 960 },
    { folder: 'drawable-land-xxxhdpi', width: 1920, height: 1280 }
  ];

  for (const { folder, width, height } of splashSizes) {
    const targetDir = path.join(RES_DIR, folder);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // Calculate logo size as ~35% of shortest dimension
    const logoSize = Math.min(width, height) * 0.35;
    const logoBuffer = await sharp(LOGO_PATH)
      .resize(Math.round(logoSize), Math.round(logoSize), { fit: 'cover' })
      .png()
      .toBuffer();

    // Composite logo centered on slate-950 dark background (#0f172a)
    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 }
      }
    })
    .composite([{ input: logoBuffer, gravity: 'center' }])
    .png()
    .toFile(path.join(targetDir, 'splash.png'));
  }

  console.log('✅ Successfully generated all Android icons and splash screens!');
}

generateAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
