'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CustomCursorProps {
  innerSize?: number;
  outerSize?: number;
  innerBorderColor?: string;
  outerBorderColor?: string;
  innerBorderWidth?: number;
  outerBorderWidth?: number;
  outerGlowColor?: string;
  innerSpeed?: number;
  outerSpeed?: number;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  innerSize = 20,
  outerSize = 60,
  innerBorderColor = '#000000',
  outerBorderColor = 'rgba(71, 106, 253, 0.5)',
  innerBorderWidth = 2,
  outerBorderWidth = 1,
  outerGlowColor = 'rgba(71, 106, 253, 0.3)',
  innerSpeed = 0.5, // Slower as requested
  outerSpeed = 0.15, // Faster
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!innerRef.current || !outerRef.current) return;

    // Set initial positions
    gsap.set([innerRef.current, outerRef.current], {
      xPercent: -50,
      yPercent: -50,
    });

    const xInnerTo = gsap.quickTo(innerRef.current, 'x', {
      duration: innerSpeed,
      ease: 'power3.out',
    });
    const yInnerTo = gsap.quickTo(innerRef.current, 'y', {
      duration: innerSpeed,
      ease: 'power3.out',
    });

    const xOuterTo = gsap.quickTo(outerRef.current, 'x', {
      duration: outerSpeed,
      ease: 'power3.out',
    });
    const yOuterTo = gsap.quickTo(outerRef.current, 'y', {
      duration: outerSpeed,
      ease: 'power3.out',
    });

    const handleMouseMove = (e: MouseEvent) => {
      xInnerTo(e.clientX);
      yInnerTo(e.clientY);
      xOuterTo(e.clientX);
      yOuterTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [innerSpeed, outerSpeed]);

  return (
    <>
      {/* Outer Circle */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none z-100 rounded-full transition-[width,height] duration-300"
        style={{
          width: outerSize,
          height: outerSize,
          border: `${outerBorderWidth}px solid ${outerBorderColor}`,
          boxShadow: `0 0 15px ${outerGlowColor}`,
        }}
      />
      {/* Inner Circle */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 pointer-events-none z-100 rounded-full backdrop-invert"
        style={{
          width: innerSize,
          height: innerSize,
        }}
      />
    </>
  );
};

export default CustomCursor;
