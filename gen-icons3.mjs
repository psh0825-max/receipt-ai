import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="40%" stop-color="#047857"/>
      <stop offset="100%" stop-color="#0d9488"/>
    </linearGradient>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="badge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
    <filter id="paperShadow">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000" flood-opacity="0.2"/>
    </filter>
    <filter id="badgeShadow">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#f59e0b" flood-opacity="0.4"/>
    </filter>
    <filter id="innerGlow">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#fff" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="115" fill="url(#bg)"/>
  
  <!-- Subtle mesh pattern -->
  <circle cx="100" cy="100" r="120" fill="white" opacity="0.03"/>
  <circle cx="420" cy="420" r="100" fill="white" opacity="0.03"/>
  <circle cx="400" cy="120" r="80" fill="white" opacity="0.02"/>
  
  <!-- Receipt paper - main -->
  <g filter="url(#paperShadow)" transform="translate(256, 235)">
    <!-- Paper body -->
    <path d="M-90,-145 h180 a8,8 0 0 1 8,8 v260 
      l-8,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-10,-6 l-10,6 l-8,-6
      v-260 a8,8 0 0 1 8,-8 z" 
      fill="url(#paper)"/>
    
    <!-- Header accent bar -->
    <rect x="-90" y="-145" width="196" height="4" rx="2" fill="#059669" opacity="0.8"/>
    
    <!-- Store icon circle -->
    <circle cx="0" cy="-108" r="18" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
    <text x="0" y="-103" text-anchor="middle" font-size="16" fill="#059669">$</text>
    
    <!-- Store name -->
    <rect x="-45" y="-82" width="90" height="6" rx="3" fill="#1e293b" opacity="0.7"/>
    
    <!-- Date -->
    <rect x="-30" y="-68" width="60" height="4" rx="2" fill="#94a3b8" opacity="0.4"/>
    
    <!-- Divider -->
    <line x1="-70" y1="-52" x2="70" y2="-52" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,2"/>
    
    <!-- Item rows -->
    <rect x="-70" y="-38" width="85" height="4" rx="2" fill="#475569" opacity="0.35"/>
    <rect x="35" y="-38" width="35" height="4" rx="2" fill="#059669" opacity="0.5"/>
    
    <rect x="-70" y="-22" width="70" height="4" rx="2" fill="#475569" opacity="0.35"/>
    <rect x="35" y="-22" width="35" height="4" rx="2" fill="#059669" opacity="0.5"/>
    
    <rect x="-70" y="-6" width="78" height="4" rx="2" fill="#475569" opacity="0.35"/>
    <rect x="35" y="-6" width="35" height="4" rx="2" fill="#059669" opacity="0.5"/>
    
    <!-- Total divider -->
    <line x1="-70" y1="14" x2="70" y2="14" stroke="#1e293b" stroke-width="1.5"/>
    
    <!-- Total row -->
    <rect x="-70" y="24" width="40" height="6" rx="3" fill="#1e293b" opacity="0.7"/>
    <rect x="15" y="22" width="55" height="9" rx="4" fill="#059669"/>
    
    <!-- Barcode -->
    <g transform="translate(-35, 50)" opacity="0.25">
      <rect x="0" width="2.5" height="22" fill="#1e293b"/>
      <rect x="5" width="4" height="22" fill="#1e293b"/>
      <rect x="12" width="1.5" height="22" fill="#1e293b"/>
      <rect x="16" width="3.5" height="22" fill="#1e293b"/>
      <rect x="22" width="2" height="22" fill="#1e293b"/>
      <rect x="27" width="4" height="22" fill="#1e293b"/>
      <rect x="34" width="1.5" height="22" fill="#1e293b"/>
      <rect x="38" width="3" height="22" fill="#1e293b"/>
      <rect x="44" width="2.5" height="22" fill="#1e293b"/>
      <rect x="49" width="4" height="22" fill="#1e293b"/>
      <rect x="56" width="2" height="22" fill="#1e293b"/>
      <rect x="61" width="3.5" height="22" fill="#1e293b"/>
      <rect x="67" width="1.5" height="22" fill="#1e293b"/>
    </g>
    
    <!-- Category tag -->
    <rect x="-70" y="82" width="42" height="16" rx="8" fill="#ecfdf5" stroke="#059669" stroke-width="1"/>
    <text x="-49" y="93" text-anchor="middle" font-size="8" font-weight="bold" fill="#059669" font-family="Arial">식비</text>
    
    <rect x="-20" y="82" width="42" height="16" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1"/>
    <text x="1" y="93" text-anchor="middle" font-size="8" font-weight="bold" fill="#3b82f6" font-family="Arial">교통</text>
  </g>
  
  <!-- AI Badge - gold/orange -->
  <g filter="url(#badgeShadow)">
    <circle cx="370" cy="370" r="50" fill="white"/>
    <circle cx="370" cy="370" r="44" fill="url(#badge)"/>
    
    <!-- AI text -->
    <text x="370" y="378" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="Arial, sans-serif" letter-spacing="-1">AI</text>
  </g>
  
  <!-- Scan lines effect (subtle) -->
  <g opacity="0.06">
    <line x1="130" y1="100" x2="130" y2="400" stroke="white" stroke-width="0.5"/>
    <line x1="382" y1="100" x2="382" y2="400" stroke="white" stroke-width="0.5"/>
    <line x1="130" y1="100" x2="382" y2="100" stroke="white" stroke-width="0.5"/>
    <line x1="130" y1="400" x2="382" y2="400" stroke="white" stroke-width="0.5"/>
    <!-- Corner brackets -->
    <path d="M130,120 v-20 h20" stroke="white" stroke-width="2" fill="none"/>
    <path d="M382,120 v-20 h-20" stroke="white" stroke-width="2" fill="none"/>
    <path d="M130,380 v20 h20" stroke="white" stroke-width="2" fill="none"/>
    <path d="M382,380 v20 h-20" stroke="white" stroke-width="2" fill="none"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).resize(512, 512).png().toFile('public/icon-512x512.png');
await sharp(Buffer.from(svg)).resize(192, 192).png().toFile('public/icon-192x192.png');
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(svg)).resize(32, 32).png().toFile('public/favicon-32x32.png');
await sharp(Buffer.from(svg)).resize(16, 16).png().toFile('public/favicon-16x16.png');
console.log('Premium icons done!');
