'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';
  className?: string;
}

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  onHover = 'speedUp',
  className = 'w-[300px] h-[300px] text-2xl'
}) => {
  const letters = Array.from(text);
  const containerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Start infinite linear rotation using GSAP
    tweenRef.current = gsap.to(containerRef.current, {
      rotation: 360,
      duration: spinDuration,
      ease: 'none',
      repeat: -1
    });

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, { dependencies: [spinDuration], scope: containerRef });

  const handleMouseEnter = () => {
    if (!tweenRef.current || !onHover) return;

    let targetTimeScale = 1;
    let targetScale = 1;

    switch (onHover) {
      case 'slowDown':
        targetTimeScale = 0.5;
        break;
      case 'speedUp':
        targetTimeScale = 3;
        break;
      case 'pause':
        targetTimeScale = 0;
        break;
      case 'goBonkers':
        targetTimeScale = 12;
        targetScale = 0.85;
        break;
    }

    // Smoothly transition rotation speed via timeScale
    gsap.to(tweenRef.current, {
      timeScale: targetTimeScale,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Smoothly scale container for premium feedback
    gsap.to(containerRef.current, {
      scale: targetScale,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    if (!tweenRef.current) return;

    // Smoothly return to normal speed and scale
    gsap.to(tweenRef.current, {
      timeScale: 1,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(containerRef.current, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  return (
    <div
      ref={containerRef}
      className={`m-0 mx-auto rounded-full relative font-black text-center cursor-pointer origin-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        // Perfect symmetric circular layout with a proportional outward translation (12% of height) to increase the gap
        const transform = `rotateZ(${rotationDeg}deg) translate3d(0, -10%, 0)`;

        return (
          <span
            key={i}
            className="absolute inline-block inset-0 transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]"
            style={{ transform, WebkitTransform: transform }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};

export default CircularText;
