export const logo = [
  '700 116',
  `<g>
    <!-- Sun -->
    <defs>
      <linearGradient id="sunGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFB347"/>
        <stop offset="100%" stop-color="#FFCC33"/>
      </linearGradient>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFD27F" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#FFD27F" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Sun -->
    <circle cx="90" cy="50" r="40" fill="url(#sunGlow)" />
    <circle cx="90" cy="50" r="30" fill="url(#sunGradient)" />

    <!-- Mountains (slightly lighter purple-gray) -->
    <polygon points="20,95 80,40 140,95" fill="#7D6EAB" />
    <polygon points="60,95 120,50 180,95" fill="#9580C1" />

    <!-- California Palm Tree -->
    <path d="M152 90 C150 65, 155 55, 152 45" stroke="#2E7D32" stroke-width="5" fill="none" />
    <path d="M152 45 C134 23, 172 23, 152 45" fill="#66BB6A" />
    <path d="M152 45 C132 21, 172 21, 152 45" fill="#4CAF50" />
    <path d="M152 45 C130 19, 170 19, 152 45" fill="#43A047" />
    <path d="M152 45 C128 17, 170 17, 152 45" fill="#388E3C" />
    <path d="M152 45 C126 15, 168 15, 152 45" fill="#2E7D32" />

    <!-- Golf ball slightly higher -->
    <circle cx="152" cy="83" r="3" fill="#FFFFFF" />

    <!-- Text -->
    <text x="200" y="90" font-size="60" fill="white" font-family='papyrus' font-weight="700">
      Tournament du Sol
    </text>
  </g>`
]
