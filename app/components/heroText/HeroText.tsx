'use client';

import React, { forwardRef, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


interface HeroTextProps {
  speed?: number;                // Duration of one complete loop in seconds (default: 35)
  textArray?: string[];          // Array of strings to cycle (default: brand phrase)
  direction?: 'left' | 'right';  // Scroll direction (default: 'left')
}

const HeroText = forwardRef<HTMLDivElement, HeroTextProps>(
  ({ speed = 35, textArray, direction = 'left' }, ref) => {
    const textArr = textArray || ["CODE IT, DESIGN IT, EXECUTE IT"];
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const trackDupRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
      if (!containerRef.current || !trackRef.current || !trackDupRef.current)
        return;

      const trackWidth = trackRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;

      const calculatedDuration = (trackWidth / viewportWidth) * speed;

      const targets = [trackRef.current, trackDupRef.current];

      // Base direction
      const baseDirection = direction === "left" ? -100 : 100;

      // Initial positions
      gsap.set(trackDupRef.current, {
        xPercent: baseDirection,
      });

      // Infinite marquee
      const tween = gsap.to(targets, {
        xPercent: `+=${baseDirection}`,
        duration: calculatedDuration,
        force3D: true,
        ease: "none",
        repeat: -1,
        modifiers: {
          xPercent: gsap.utils.wrap(-100, 0),
        },
      });

      return () => {
        tween.kill();
      };
    }, { dependencies: [speed, direction], scope: containerRef });

    // Repeat items to ensure it exceeds viewport width
    const repeatedItems = [...textArr, ...textArr, ...textArr];

    return (
      <div
        ref={ref}
        className="w-full overflow-hidden select-none"
      >
        <div ref={containerRef} className="w-full overflow-hidden flex whitespace-nowrap">
          <div ref={trackRef} className="flex items-center whitespace-nowrap shrink-0 will-change-transform">
            {repeatedItems.map((text, idx) => (
              <div key={`track-${idx}`} className="flex items-center text-[12vmax] font-heading font-black leading-none tracking-tighter text-background uppercase">
                <span>{text}</span>
                <span className="text-background px-[2vw]">•</span>
              </div>
            ))}
          </div>
          <div ref={trackDupRef} className="flex items-center whitespace-nowrap shrink-0 will-change-transform" aria-hidden="true">
            {repeatedItems.map((text, idx) => (
              <div key={`track-dup-${idx}`} className="flex items-center text-[12vmax] font-heading font-black leading-none tracking-tighter text-background uppercase">
                <span>{text}</span>
                <span className="text-background px-[2vw]">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

HeroText.displayName = 'HeroText';

export default HeroText;