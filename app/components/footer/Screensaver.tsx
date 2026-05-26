'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScreensaverProps {
  textArr?: string[];
  className?: string;
}

const DEFAULT_WORDS = ['DESIGN', 'DEVELOP', 'CODE', 'ANIMATE', 'LAUNCH'];

export default function Screensaver({ textArr = DEFAULT_WORDS, className = '' }: ScreensaverProps) {
  const words = textArr.length > 0 ? textArr : DEFAULT_WORDS;

  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);

  const [cornerHits, setCornerHits] = useState(() => {
    if (typeof window !== 'undefined') {
      const localVal = localStorage.getItem('corner_hits');
      return localVal ? parseInt(localVal, 10) : 0;
    }
    return 0;
  });
  const [textIndex, setTextIndex] = useState(0);

  // Use refs for physical values to bypass React state overhead during the animation loop
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ vx: 1.8, vy: 1.8 });
  const dimensionsRef = useRef({ cw: 0, ch: 0, ew: 0, eh: 0 });

  // Randomize initial direction signs
  useEffect(() => {
    const speed = 1.8;
    velRef.current = {
      vx: Math.random() > 0.5 ? speed : -speed,
      vy: Math.random() > 0.5 ? speed : -speed,
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !elementRef.current) return;

    // Monitor sizes using ResizeObserver to maintain frame-rate independent boundaries on window resize or text changes
    const resizeObserver = new ResizeObserver((entries) => {
      const cw = containerRef.current?.clientWidth || 0;
      const ch = containerRef.current?.clientHeight || 0;
      const ew = elementRef.current?.offsetWidth || 0;
      const eh = elementRef.current?.offsetHeight || 0;

      // Update ref dimensions
      const prevDimensions = dimensionsRef.current;
      dimensionsRef.current = { cw, ch, ew, eh };

      // If dimensions were previously 0 (first mount), initialize position to the center of the box
      if (prevDimensions.cw === 0 && cw > 0) {
        posRef.current = {
          x: Math.max(0, (cw - ew) / 2),
          y: Math.max(0, (ch - eh) / 2),
        };
      } else {
        // Clamp existing position to ensure the text doesn't overflow upon resizing
        posRef.current.x = Math.min(posRef.current.x, Math.max(0, cw - ew));
        posRef.current.y = Math.min(posRef.current.y, Math.max(0, ch - eh));
      }
    });

    resizeObserver.observe(containerRef.current);
    resizeObserver.observe(elementRef.current);

    let animationFrameId: number;

    const updatePhysics = () => {
      const { cw, ch, ew, eh } = dimensionsRef.current;
      if (cw === 0 || ch === 0 || ew === 0 || eh === 0) {
        animationFrameId = requestAnimationFrame(updatePhysics);
        return;
      }

      let { x, y } = posRef.current;
      let { vx, vy } = velRef.current;

      let nextX = x + vx;
      let nextY = y + vy;

      const maxX = cw - ew;
      const maxY = ch - eh;

      // Smart Snapping Threshold for satisfying corner hits (within 8px of two intersecting bounds, heading towards the edge)
      const isNearLeft = nextX <= 8 && vx < 0;
      const isNearRight = nextX >= maxX - 8 && vx > 0;
      const isNearTop = nextY <= 8 && vy < 0;
      const isNearBottom = nextY >= maxY - 8 && vy > 0;

      if ((isNearLeft || isNearRight) && (isNearTop || isNearBottom)) {
        // Corner Hit Event!
        nextX = isNearLeft ? 0 : maxX;
        nextY = isNearTop ? 0 : maxY;
        velRef.current.vx = isNearLeft ? Math.abs(vx) : -Math.abs(vx);
        velRef.current.vy = isNearTop ? Math.abs(vy) : -Math.abs(vy);

        // Trigger visual flash
        if (flashOverlayRef.current) {
          flashOverlayRef.current.style.opacity = '0.08';
          setTimeout(() => {
            if (flashOverlayRef.current) {
              flashOverlayRef.current.style.opacity = '0';
            }
          }, 300);
        }

        // Update HUD and localStorage
        setCornerHits((prev) => {
          const newVal = prev + 1;
          localStorage.setItem('corner_hits', String(newVal));
          return newVal;
        });
        setTextIndex((prev) => (prev + 1) % words.length);
      } else {
        // Regular Wall Collisions
        if (nextX <= 0) {
          nextX = 0;
          velRef.current.vx = -vx;
        } else if (nextX >= maxX) {
          nextX = maxX;
          velRef.current.vx = -vx;
        }

        if (nextY <= 0) {
          nextY = 0;
          velRef.current.vy = -vy;
        } else if (nextY >= maxY) {
          nextY = maxY;
          velRef.current.vy = -vy;
        }
      }

      posRef.current = { x: nextX, y: nextY };
      if (elementRef.current) {
        elementRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [words]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.9] flex select-none ${className}`}
    >
      {/* Subtle ambient background */}
      <div className="absolute inset-0 bg-background opacity-90 pointer-events-none" />

      {/* Dynamic Flash Overlay for Corner Hits */}
      <div
        ref={flashOverlayRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 z-10 bg-foreground"
      />

      {/* Minimalistic HUD for Corner Hits count */}
      <div className="absolute top-4 left-4 z-20 font-mono text-[20px] tracking-widest text-foreground/50 select-none">
        HITS: {String(cornerHits).padStart(2, '0')}
      </div>

      {/* Moving Screensaver Text */}
      <div
        ref={elementRef}
        className="absolute top-0 left-0 font-heading font-black tracking-widest text-4xl uppercase select-none pointer-events-none will-change-transform whitespace-nowrap text-foreground/80"
        style={{
          lineHeight: 'normal',
          padding: '6px 12px',
        }}
      >
        {words[textIndex]}
      </div>
    </div>
  );
}
