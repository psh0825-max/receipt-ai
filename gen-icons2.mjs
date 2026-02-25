import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="50%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f0fdf4"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.15"/>
    </filter>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#059669" flood-opacity="0.4"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  
  <!-- Subtle pattern -->
  <circle cx="420" cy="80" r="60" fill="white" opacity="0.05"/>
  <circle cx="80" cy="430" r="45" fill="white" opacity="0.05"/>
  
  <!-- Receipt paper with torn edge -->
  <g filter="url(#shadow)" transform="translate(256, 245)">
    <!-- Main paper -->
    <rect x="-85" y="-135" width="170" height="240" rx="12" fill="url(#paper)"/>
    
    <!-- Torn bottom edge -->
    <path d="M-85,105 l10,-8 l12,8 l10,-8 l12,8 l10,-8 l12,8 l10,-8 l12,8 l10,-8 l12,8 l10,-8 l12,8 l10,-8 l12,8 l7,-5.6 v5.6 l0,0 h-170 z" fill="url(#paper)"/>
    
    <!-- Store name line -->
    <rect x="-55" y="-105" width="80" height="6" rx="3" fill="#059669" opacity="0.8"/>
    
    <!-- Date line -->
    <rect x="-55" y="-85" width="50" height="4" rx="2" fill="#94a3b8" opacity="0.5"/>
    
    <!-- Divider -->
    <line x1="-55" y1="-68" x2="55" y2="-68" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="4,3"/>
    
    <!-- Item lines -->
    <rect x="-55" y="-55" width="70" height="4" rx="2" fill="#64748b" opacity="0.4"/>
    <rect x="25" y="-55" width="30" height="4" rx="2" fill="#059669" opacity="0.6"/>
    
    <rect x="-55" y="-38" width="55" height="4" rx="2" fill="#64748b" opacity="0.4"/>
    <rect x="25" y="-38" width="30" height="4" rx="2" fill="#059669" opacity="0.6"/>
    
    <rect x="-55" y="-21" width="65" height="4" rx="2" fill="#64748b" opacity="0.4"/>
    <rect x="25" y="-21" width="30" height="4" rx="2" fill="#059669" opacity="0.6"/>
    
    <!-- Divider -->
    <line x1="-55" y1="-4" x2="55" y2="-4" stroke="#e2e8f0" stroke-width="1.5"/>
    
    <!-- Total -->
    <rect x="-55" y="10" width="35" height="5" rx="2.5" fill="#334155" opacity="0.6"/>
    <rect x="5" y="8" width="50" height="8" rx="3" fill="#059669" opacity="0.9"/>
    
    <!-- Barcode lines -->
    <g transform="translate(-30, 35)">
      <rect x="0" y="0" width="2" height="18" fill="#1e293b" opacity="0.3"/>
      <rect x="5" y="0" width="3" height="18" fill="#1e293b" opacity="0.3"/>
      <rect x="11" y="0" width="1.5" height="18" fill="#1e293b" opacity="0.3"/>
      <rect x="15" y="0" width="3" height="18" fill="#1e293b" opacity="0.3"/>
      <rect x="21" y="0" width="2" height="18" fill="#1e293b" opacity="0.3"/>
      <rect x="26" y="0" width="1.5" height="18" fill="#1e293b" opacity="0.3"/>
      <rect x="30" y="0" width="3" height="18" fill="#1e293b" opacity="0.3"/>
      <rect x="36" y="0" width="2" height="18" fill="#1e293b" opacity="0.3"/>
      <rect x="41" y="0" width="1.5" height="18" fill="#1e293b" opacity="0.3"/>
      <rect x="45" y="0" width="3" height="18" fill="#1e293b" opacity="0.3"/>
      <rect x="51" y="0" width="2" height="18" fill="#1e293b" opacity="0.3"/>
      <rect x="56" y="0" width="3" height="18" fill="#1e293b" opacity="0.3"/>
    </g>
  </g>
  
  <!-- AI Badge -->
  <g filter="url(#glow)">
    <circle cx="355" cy="355" r="52" fill="white"/>
    <circle cx="355" cy="355" r="46" fill="#059669"/>
    <!-- Sparkle -->
    <path d="M340,345 L348,335 L350,345 L360,348 L350,350 L348,360 L345,350 L335,348 Z" fill="white" opacity="0.9"/>
    <path d="M360,330 L363,325 L364,330 L369,332 L364,333 L363,338 L361,333 L356,332 Z" fill="white" opacity="0.7"/>
    <circle cx="370" cy="365" r="3" fill="white" opacity="0.5"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).resize(512, 512).png().toFile('public/icon-512x512.png');
await sharp(Buffer.from(svg)).resize(192, 192).png().toFile('public/icon-192x192.png');
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(svg)).resize(32, 32).png().toFile('public/favicon-32x32.png');
await sharp(Buffer.from(svg)).resize(16, 16).png().toFile('public/favicon-16x16.png');
console.log('All icons generated!');
