import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#0d9488"/>
  </linearGradient></defs>
  <rect width="512" height="512" rx="100" fill="url(#bg)"/>
  <g transform="translate(256,240)">
    <rect x="-80" y="-120" width="160" height="200" rx="12" fill="white" opacity="0.95"/>
    <line x1="-50" y1="-70" x2="50" y2="-70" stroke="#059669" stroke-width="6" stroke-linecap="round"/>
    <line x1="-50" y1="-40" x2="30" y2="-40" stroke="#059669" stroke-width="4" opacity="0.6"/>
    <line x1="-50" y1="-10" x2="50" y2="-10" stroke="#059669" stroke-width="4" opacity="0.6"/>
    <line x1="-50" y1="20" x2="40" y2="20" stroke="#059669" stroke-width="4" opacity="0.6"/>
    <line x1="-50" y1="50" x2="50" y2="50" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
    <circle cx="55" cy="55" r="40" fill="#10b981"/>
    <text x="55" y="68" text-anchor="middle" font-size="40" font-weight="bold" fill="white" font-family="Arial">AI</text>
  </g>
</svg>`;
await sharp(Buffer.from(svg)).resize(512,512).png().toFile('public/icon-512x512.png');
await sharp(Buffer.from(svg)).resize(192,192).png().toFile('public/icon-192x192.png');
console.log('icons done');
