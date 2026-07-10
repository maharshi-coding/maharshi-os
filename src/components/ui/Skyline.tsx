/**
 * Skyline — a pure-SVG Vice City sunset: retro sun with scan gaps, a neon
 * building silhouette and palm trees. No JS, no assets. Reused by the loading
 * screen and the hero's mobile / reduced-motion fallback.
 */
export function Skyline({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0a4a" />
          <stop offset="0.4" stopColor="#7b2ff7" />
          <stop offset="0.68" stopColor="#ff2e97" />
          <stop offset="0.85" stopColor="#ff6b3d" />
          <stop offset="1" stopColor="#ffb03a" />
        </linearGradient>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe36a" />
          <stop offset="0.5" stopColor="#ff8a3d" />
          <stop offset="1" stopColor="#ff2e97" />
        </linearGradient>
        <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0733" />
          <stop offset="1" stopColor="#0a0512" />
        </linearGradient>
        <clipPath id="sunClip">
          <circle cx="600" cy="250" r="160" />
        </clipPath>
      </defs>

      <rect width="1200" height="500" fill="url(#sky)" />

      {/* Retro sun with horizontal scan gaps */}
      <g clipPath="url(#sunClip)">
        <rect x="440" y="90" width="320" height="320" fill="url(#sun)" />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect
            key={i}
            x="440"
            y={250 + i * 12 + i * i * 1.4}
            width="320"
            height={4 + i * 1.5}
            fill="#2a0a4a"
            opacity="0.9"
          />
        ))}
      </g>

      {/* Building silhouette */}
      <g fill="url(#bld)">
        <rect x="0" y="330" width="90" height="170" />
        <rect x="95" y="290" width="70" height="210" />
        <rect x="170" y="350" width="60" height="150" />
        <rect x="235" y="250" width="85" height="250" />
        <rect x="325" y="320" width="55" height="180" />
        <rect x="770" y="300" width="70" height="200" />
        <rect x="845" y="240" width="95" height="260" />
        <rect x="945" y="330" width="60" height="170" />
        <rect x="1010" y="280" width="80" height="220" />
        <rect x="1095" y="340" width="105" height="160" />
      </g>
      {/* Lit windows */}
      <g fill="#05d9e8" opacity="0.65">
        {[
          [110, 310], [130, 310], [110, 335], [255, 275], [280, 275], [255, 305],
          [280, 305], [255, 335], [865, 265], [890, 265], [915, 265], [865, 300],
          [890, 300], [1030, 305], [1055, 305], [1030, 335],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="10" height="14" rx="1" />
        ))}
      </g>

      {/* Palm silhouettes */}
      <g fill="#0a0512">
        <g transform="translate(120,500)">
          <rect x="-6" y="-150" width="12" height="150" rx="4" />
          <path d="M0-150 C-40-170-80-160-110-140 C-78-158-40-158 0-150 Z" />
          <path d="M0-150 C40-170 80-160 110-140 C78-158 40-158 0-150 Z" />
          <path d="M0-150 C-20-190-14-220 4-244 C6-214 8-184 0-150 Z" />
          <path d="M0-150 C24-186 60-196 92-196 C60-182 26-176 0-150 Z" />
          <path d="M0-150 C-24-186-60-196-92-196 C-60-182-26-176 0-150 Z" />
        </g>
        <g transform="translate(1080,500) scale(-1,1)">
          <rect x="-6" y="-130" width="12" height="130" rx="4" />
          <path d="M0-130 C-40-150-80-140-110-120 C-78-138-40-138 0-130 Z" />
          <path d="M0-130 C40-150 80-140 110-120 C78-138 40-138 0-130 Z" />
          <path d="M0-130 C-20-170-14-200 4-224 C6-194 8-164 0-130 Z" />
          <path d="M0-130 C24-166 60-176 92-176 C60-162 26-156 0-130 Z" />
        </g>
      </g>
    </svg>
  );
}
