import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'PuzzlePlay - Turn Your Photos into Puzzles';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
  const isKo = params.locale === 'ko';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #09090b 0%, #1a1025 50%, #09090b 100%)',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Puzzle grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: 200,
            gap: 8,
            marginBottom: 40,
          }}
        >
          {['rgba(139,92,246,0.3)', 'rgba(99,102,241,0.25)', 'rgba(139,92,246,0.2)', 'rgba(79,70,229,0.25)'].map(
            (color, i) => (
              <div
                key={i}
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 16,
                  background: color,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              />
            )
          )}
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: -2,
            marginBottom: 16,
          }}
        >
          <span style={{ color: '#f4f4f5' }}>Puzzle</span>
          <span style={{ color: '#8b5cf6' }}>Play</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#a1a1aa',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          {isKo
            ? '내 사진으로 직소 퍼즐 & 슬라이드 퍼즐'
            : 'Turn Your Photos into Jigsaw & Slide Puzzles'}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            gap: 24,
            fontSize: 18,
            color: '#71717a',
          }}
        >
          <span>Free</span>
          <span>·</span>
          <span>No Sign-up</span>
          <span>·</span>
          <span>No Photos Stored</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
