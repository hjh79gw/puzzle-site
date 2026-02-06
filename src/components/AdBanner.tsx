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
  return (
    <div
      className={`glass-card border-dashed border-white/[0.06] flex items-center justify-center ${
        format === 'horizontal' ? 'min-h-[90px]' : 'min-h-[250px]'
      } ${className}`}
      aria-hidden="true"
    >
      <span className="text-zinc-700 text-xs">Ad</span>
      {/*
        After AdSense approval, replace this div with:
        <ins className="adsbygoogle"
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true" />
        And add the AdSense script to layout.tsx <head>
      */}
    </div>
  );
}
