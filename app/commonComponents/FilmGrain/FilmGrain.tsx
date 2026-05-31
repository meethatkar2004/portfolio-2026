'use client';

import { useEffect, useRef } from 'react';

interface FilmGrainProps {
  opacity?: number;
  zIndex?: number;
}

/**
 * FilmGrain — Generates a noise tile on an off-screen canvas,
 * converts it to a data-URL, and tiles it across a full-size overlay div.
 * Drop this inside any section wrapper with `position: relative`.
 */
export default function FilmGrain({ opacity = 0.75, zIndex = 10 }: FilmGrainProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Create a small off-screen canvas to generate the noise tile
    const size = 150;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const val = Math.random() * 255;
      data[i] = val;       // R
      data[i + 1] = val;   // G
      data[i + 2] = val;   // B
      data[i + 3] = 50;    // A — visible grain
    }

    ctx.putImageData(imageData, 0, 0);

    // Convert to data URL and set as a tiled background
    const dataUrl = canvas.toDataURL('image/png');
    overlay.style.backgroundImage = `url(${dataUrl})`;
    overlay.style.backgroundRepeat = 'repeat';
    overlay.style.backgroundSize = `${size}px ${size}px`;
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
        opacity,
        mixBlendMode: 'soft-light',
      }}
    />
  );
}
