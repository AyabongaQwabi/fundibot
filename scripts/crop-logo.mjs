import sharp from 'sharp';

const src = 'public/brand/logo-green-tag.png'; // blue mascot on white
// Image is 1142x1144. Crop the mascot region (top portion).
const left = 350, top = 230, width = 430, height = 445;

// Bot icon on white background (for use on dark surfaces)
await sharp(src)
  .extract({ left, top, width, height })
  .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .png()
  .toFile('public/brand/bot-icon-white.png');

// Bot icon transparent: crop then knock out near-white to transparent
const cropped = await sharp(src)
  .extract({ left, top, width, height })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { data, info } = cropped;
for (let i = 0; i < data.length; i += info.channels) {
  const r = data[i],
    g = data[i + 1],
    b = data[i + 2];
  if (r > 235 && g > 235 && b > 235) {
    data[i + 3] = 0;
  }
}
await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('public/brand/bot-icon.png');

// Favicons from transparent icon
for (const size of [16, 32, 48, 180, 192, 512]) {
  await sharp('public/brand/bot-icon.png')
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(`public/brand/favicon-${size}.png`);
}
console.log('done');
