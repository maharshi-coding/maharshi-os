import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * A stylized developer-avatar caricature, animated for a seamless loop:
 * a gentle idle float, periodic blinking, and a friendly wave. Everything is
 * driven by useCurrentFrame() (no CSS animations) so it renders correctly in
 * both @remotion/player and a headless render, and returns to its start pose
 * at the last frame so the loop is invisible.
 */
export const AVATAR = { width: 400, height: 400, fps: 30, durationInFrames: 150 };

const ACCENT_1 = "#6d5cff";
const ACCENT_2 = "#4d9fff";
const SKIN = "#e8b48f";
const SKIN_SHADE = "#d69f78";
const HAIR = "#241f2b";

export const Avatar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = (frame / durationInFrames) * Math.PI * 2; // 0..2π across the loop

  // Idle float + breathing.
  const floatY = Math.sin(p) * 7;
  const breathe = 1 + Math.sin(p * 2) * 0.012;

  // Ambient glow pulse behind the figure.
  const glow = 0.5 + Math.sin(p * 2) * 0.18;

  // Two blinks per loop (quick eye close), open at start/end.
  const blink = (center: number) =>
    interpolate(frame, [center - 3, center, center + 3], [1, 0.08, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const eyeScaleY = Math.min(blink(42), blink(112));

  // One wave mid-loop: ramp in, oscillate, ramp out to rest (0deg) by the ends.
  const waveAmt = interpolate(frame, [55, 68, 100, 112], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const waveAngle = waveAmt * Math.sin((frame - 68) * 0.5) * 18 - waveAmt * 6;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <svg width={AVATAR.width} height={AVATAR.height} viewBox="0 0 400 400">
        <defs>
          <linearGradient id="hoodie" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={ACCENT_1} />
            <stop offset="1" stopColor={ACCENT_2} />
          </linearGradient>
          <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={ACCENT_1} stopOpacity="0.55" />
            <stop offset="1" stopColor={ACCENT_1} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient glow */}
        <circle cx="200" cy="215" r="150" fill="url(#glow)" style={{ opacity: glow }} />

        {/* Whole figure: idle float + subtle breathing scale */}
        <g style={{ translate: `0px ${floatY}px`, scale: String(breathe), transformOrigin: "200px 300px" }}>
          {/* Hoodie / shoulders */}
          <path d="M120 400 L120 300 Q200 250 280 300 L280 400 Z" fill="url(#hoodie)" />
          <path d="M175 262 L225 262 L232 300 Q200 315 168 300 Z" fill={SKIN_SHADE} />
          {/* Hoodie collar */}
          <path d="M168 300 Q200 320 232 300 L226 288 Q200 305 174 288 Z" fill={ACCENT_1} opacity="0.85" />

          {/* Neck */}
          <rect x="185" y="250" width="30" height="30" rx="12" fill={SKIN} />

          {/* Head */}
          <g style={{ transformOrigin: "200px 180px" }}>
            <circle cx="200" cy="180" r="62" fill={SKIN} />
            {/* Ears */}
            <circle cx="140" cy="184" r="11" fill={SKIN} />
            <circle cx="260" cy="184" r="11" fill={SKIN} />
            {/* Hair */}
            <path d="M142 168 Q150 108 200 108 Q250 108 258 168 Q250 140 200 138 Q150 140 142 168 Z" fill={HAIR} />
            <path d="M142 168 Q140 150 150 132 L156 150 Q148 160 148 172 Z" fill={HAIR} />

            {/* Glasses */}
            <g stroke="#20202a" strokeWidth="4" fill="rgba(77,159,255,0.14)">
              <rect x="158" y="170" width="36" height="27" rx="8" />
              <rect x="206" y="170" width="36" height="27" rx="8" />
            </g>
            <line x1="194" y1="181" x2="206" y2="181" stroke="#20202a" strokeWidth="4" />

            {/* Eyes (blink via scaleY) */}
            <g fill="#241f2b">
              <ellipse cx="176" cy="184" rx="5" ry={5 * eyeScaleY} />
              <ellipse cx="224" cy="184" rx="5" ry={5 * eyeScaleY} />
            </g>

            {/* Smile */}
            <path d="M182 212 Q200 226 218 212" stroke="#b9805f" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Headphones */}
            <path d="M132 182 Q132 108 200 108 Q268 108 268 182" stroke="#15151d" strokeWidth="10" fill="none" strokeLinecap="round" />
            <rect x="122" y="176" width="24" height="40" rx="10" fill="#15151d" />
            <rect x="254" y="176" width="24" height="40" rx="10" fill="#15151d" />
            <rect x="127" y="184" width="14" height="24" rx="7" fill={ACCENT_2} opacity="0.8" />
            <rect x="259" y="184" width="14" height="24" rx="7" fill={ACCENT_2} opacity="0.8" />
          </g>

          {/* Left arm (resting) */}
          <path d="M128 306 Q112 340 120 378" stroke="url(#hoodie)" strokeWidth="26" fill="none" strokeLinecap="round" />

          {/* Right arm — waves. Pivot at the shoulder (272,300). */}
          <g transform="translate(272 300)">
            <g style={{ rotate: `${waveAngle}deg`, transformOrigin: "0px 0px" }}>
              <path d="M0 6 Q26 -18 22 -66" stroke="url(#hoodie)" strokeWidth="26" fill="none" strokeLinecap="round" />
              {/* Hand */}
              <circle cx="21" cy="-72" r="15" fill={SKIN} />
            </g>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
