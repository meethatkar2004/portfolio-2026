import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          background: 'linear-gradient(135deg, #ffffeb 0%, #f5f0d0 50%, #e8d89c 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#b99400',
            }}
          />
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase' as const,
              color: '#6b5900',
            }}
          >
            Portfolio 2026
          </span>
        </div>

        {/* Name */}
        <h1
          style={{
            fontSize: '96px',
            fontWeight: 900,
            color: '#2a1209',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            margin: 0,
            textTransform: 'uppercase' as const,
          }}
        >
          Meet Hatkar
        </h1>

        {/* Title */}
        <p
          style={{
            fontSize: '36px',
            fontWeight: 600,
            color: '#241600',
            marginTop: '24px',
            opacity: 0.7,
          }}
        >
          Website Designer & Creative Developer
        </p>

        {/* Bottom label */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginTop: 'auto',
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: '#6b5900',
            opacity: 0.6,
          }}
        >
          <span>Next.js</span>
          <span>•</span>
          <span>Three.js</span>
          <span>•</span>
          <span>GSAP</span>
          <span>•</span>
          <span>TypeScript</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
