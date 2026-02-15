export const logoTiny = [
    '100 100', // square for favicon
    `<g>
      <!-- Sun -->
      <defs>
        <linearGradient id="sunGradientTiny" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FFB347"/>
          <stop offset="100%" stop-color="#FFCC33"/>
        </linearGradient>
        <radialGradient id="sunGlowTiny" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFD27F" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#FFD27F" stop-opacity="0"/>
        </radialGradient>
      </defs>
  
      <circle cx="50" cy="30" r="20" fill="url(#sunGlowTiny)" />
      <circle cx="50" cy="30" r="15" fill="url(#sunGradientTiny)" />
  
      <!-- Mountains simplified -->
      <polygon points="10,90 50,30 90,90" fill="#6B5B95" />
      <polygon points="30,90 60,40 90,90" fill="#836FA9" />
  
      <!-- Palm tree simplified -->
      <path d="M65 80 C63 60, 67 55, 65 45" stroke="#2E7D32" stroke-width="3" fill="none" />
      <path d="M65 45 C58 30, 72 30, 65 45" fill="#66BB6A" />
    </g>`
  ]
  