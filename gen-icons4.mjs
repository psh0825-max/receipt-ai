import sharp from 'sharp';

// Clean, minimal, professional - like Toss/Kakao style
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#065f46"/>
      <stop offset="100%" stop-color="#0d9488"/>
    </linearGradient>
    <filter id="s1">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.18"/>
    </filter>
    <filter id="s2">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.15"/>
    </filter>
  </defs>
  
  <!-- BG -->
  <rect width="512" height="512" rx="115" fill="url(#bg)"/>
  
  <!-- Large receipt paper -->
  <g filter="url(#s1)">
    <rect x="145" y="85" width="222" height="300" rx="16" fill="white"/>
    <!-- Torn bottom -->
    <path d="M145,370 l11,-9 l11,9 l11,-9 l11,9 l11,-9 l11,9 l11,-9 l11,9 l11,-9 l11,9 l11,-9 l11,9 l11,-9 l11,9 l11,-9 l11,9 l11,-9 l11,9 l8,-6.5 v16.5 a16,16 0 0 1 -16,16 h-190 a16,16 0 0 1 -16,-16 v-16.5 z" fill="white"/>
  </g>
  
  <!-- Receipt content -->
  <!-- Amount - big and bold -->
  <text x="256" y="165" text-anchor="middle" font-size="42" font-weight="900" fill="#065f46" font-family="Arial, Helvetica, sans-serif">₩12,500</text>
  
  <!-- Store -->
  <text x="256" y="195" text-anchor="middle" font-size="15" fill="#94a3b8" font-family="Arial, sans-serif">카페 모닝</text>
  
  <!-- Divider -->
  <line x1="180" y1="215" x2="332" y2="215" stroke="#e2e8f0" stroke-width="1.5"/>
  
  <!-- Items -->
  <text x="185" y="243" font-size="13" fill="#64748b" font-family="Arial, sans-serif">아메리카노</text>
  <text x="327" y="243" text-anchor="end" font-size="13" fill="#334155" font-weight="bold" font-family="Arial, sans-serif">₩4,500</text>
  
  <text x="185" y="268" font-size="13" fill="#64748b" font-family="Arial, sans-serif">카페라떼</text>
  <text x="327" y="268" text-anchor="end" font-size="13" fill="#334155" font-weight="bold" font-family="Arial, sans-serif">₩5,000</text>
  
  <text x="185" y="293" font-size="13" fill="#64748b" font-family="Arial, sans-serif">치즈케이크</text>
  <text x="327" y="293" text-anchor="end" font-size="13" fill="#334155" font-weight="bold" font-family="Arial, sans-serif">₩3,000</text>
  
  <!-- Divider -->
  <line x1="180" y1="308" x2="332" y2="308" stroke="#1e293b" stroke-width="2"/>
  
  <!-- Total -->
  <text x="185" y="332" font-size="14" font-weight="bold" fill="#1e293b" font-family="Arial, sans-serif">합계</text>
  <text x="327" y="332" text-anchor="end" font-size="16" font-weight="900" fill="#059669" font-family="Arial, sans-serif">₩12,500</text>

  <!-- Category tag -->
  <rect x="205" y="348" width="102" height="26" rx="13" fill="#ecfdf5"/>
  <text x="256" y="366" text-anchor="middle" font-size="12" font-weight="bold" fill="#059669" font-family="Arial, sans-serif">☕ 식비 · 카드</text>
  
  <!-- AI Scan indicator -->
  <g filter="url(#s2)">
    <circle cx="370" cy="410" r="46" fill="white"/>
    <circle cx="370" cy="410" r="40" fill="#059669"/>
    <!-- Sparkle star -->
    <path d="M370,390 l4,12 l12,4 l-12,4 l-4,12 l-4,-12 l-12,-4 l12,-4 z" fill="white"/>
    <circle cx="386" cy="396" r="3" fill="white" opacity="0.7"/>
    <circle cx="358" cy="424" r="2.5" fill="white" opacity="0.5"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).resize(512, 512).png().toFile('public/icon-512x512.png');
await sharp(Buffer.from(svg)).resize(192, 192).png().toFile('public/icon-192x192.png');
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(svg)).resize(32, 32).png().toFile('public/favicon-32x32.png');
await sharp(Buffer.from(svg)).resize(16, 16).png().toFile('public/favicon-16x16.png');
console.log('Pro icons v4 done!');
