'use client';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export default function AdBanner({
  slot = 'XXXXXXXXXX',
  format = 'auto',
  className = '',
}: AdBannerProps) {
  // Placeholder for Google AdSense
  // Replace with actual ad code after AdSense approval
  return (
    <div
      className={`flex items-center justify-center bg-[var(--color-bg-secondary)] border border-dashed border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] text-xs ${className}`}
      style={{ minHeight: format === 'horizontal' ? 90 : 250 }}
    >
      <span>Ad Space</span>
      {/*
        After AdSense approval, replace this div with:
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true" />
      */}
    </div>
  );
}
