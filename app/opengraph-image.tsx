import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Roast My CV — AI-Powered Resume Destruction';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(226,75,74,0.15) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 999,
            border: '1px solid rgba(226,75,74,0.4)',
            background: 'rgba(226,75,74,0.12)',
            color: '#E24B4A',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 32,
          }}
        >
          AI-Powered · Free · No signup
        </div>

        {/* Heading */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 80 }}>🔪</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: 'white',
                lineHeight: 1,
                letterSpacing: -2,
              }}
            >
              Roast{' '}
              <span style={{ color: '#E24B4A' }}>My CV</span>
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 24,
            textAlign: 'center',
            maxWidth: 600,
            lineHeight: 1.5,
          }}
        >
          Upload your resume. Get brutally honest AI feedback.
          No more polite lies from friends.
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            color: 'rgba(255,255,255,0.2)',
            fontSize: 16,
            letterSpacing: 1,
            display: 'flex',
          }}
        >
          roastmycv.live
        </div>
      </div>
    ),
    { ...size }
  );
}
