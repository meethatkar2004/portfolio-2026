'use client';

import React, { forwardRef, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
      if (!containerRef.current || !trackRef.current || !trackDupRef.current) return;

      // Calculate dynamic duration based on physical pixel width to guarantee identical visual velocity
      const trackWidth = trackRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;
      // If speed represents duration per viewport width, dynamic duration = (trackWidth / viewportWidth) * speed
      const calculatedDuration = (trackWidth / viewportWidth) * speed;

      // Setup marquee animation based on direction prop
      let tween: gsap.core.Tween;
      const targets = [trackRef.current, trackDupRef.current];

      if (direction === 'left') {
        tween = gsap.to(targets, {
          xPercent: -100,
          ease: "none",
          repeat: -1,
          duration: calculatedDuration
        });
      } else {
        tween = gsap.fromTo(targets, 
          { xPercent: -100 },
          {
            xPercent: 0,
            ease: "none",
            repeat: -1,
            duration: calculatedDuration
          }
        );
      }

      // ScrollTrigger to track scroll direction and reverse dynamically on scroll movement
      let currentScrollDir = 1;

      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const scrollDir = self.direction; // 1 = scrolling down, -1 = scrolling up

          // Only trigger a new timeScale animation if the user actually reversed their scroll direction!
          if (scrollDir !== currentScrollDir) {
            currentScrollDir = scrollDir;

            // Smoothly reverse direction, using overwrite to kill any active timeScale tweens immediately
            gsap.to(tween, {
              timeScale: scrollDir === 1 ? 1 : -1,
              duration: 1.2, // increased duration for a buttery smooth physical deceleration/acceleration
              ease: "power3.inOut",
              overwrite: "auto"
            });
          }
        }
      });

      return () => {
        tween.kill();
        scrollTriggerInstance.kill();
      };
    }, { dependencies: [speed, direction, textArr], scope: containerRef });

    // Repeat items to ensure it exceeds viewport width
    const repeatedItems = [...textArr, ...textArr, ...textArr];

    return (
      <div
        ref={ref}
        className="w-full overflow-hidden select-none"
      >
        <div ref={containerRef} className="w-full overflow-hidden flex whitespace-nowrap">
          <div ref={trackRef} className="flex items-center whitespace-nowrap shrink-0">
            {repeatedItems.map((text, idx) => (
              <div key={`track-${idx}`} className="flex items-center text-[12vmax] font-heading font-black leading-none tracking-tighter text-background uppercase">
                <span>{text}</span>
                <span className="text-background px-[2vw]">•</span>
              </div>
            ))}
          </div>
          <div ref={trackDupRef} className="flex items-center whitespace-nowrap shrink-0" aria-hidden="true">
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