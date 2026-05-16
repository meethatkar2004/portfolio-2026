'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCursor } from '../../context/CursorContext';

interface CustomCursorProps {
  innerSize?: number;
  outerSize?: number;
  outerBorderColor?: string;
  outerBorderWidth?: number;
  outerGlowColor?: string;
  innerSpeed?: number;
  outerSpeed?: number;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  innerSize = 20,
  outerSize = 60,
  outerBorderColor = 'rgba(71, 106, 253, 0.5)',
  outerBorderWidth = 1,
  outerGlowColor = 'rgba(71, 106, 253, 0.3)',
  innerSpeed = 0.5, // Slower as requested
  outerSpeed = 0.15, // Faster
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const { cursorType } = useCursor();

  useEffect(() => {
    if (!innerRef.current || !outerRef.current || !labelRef.current) return;

    // Set initial positions
    gsap.set([innerRef.current, outerRef.current, labelRef.current], {
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

    const xLabelTo = gsap.quickTo(labelRef.current, 'x', {
      duration: outerSpeed,
      ease: 'power3.out',
    });
    const yLabelTo = gsap.quickTo(labelRef.current, 'y', {
      duration: outerSpeed,
      ease: 'power3.out',
    });

    const handleMouseMove = (e: MouseEvent) => {
      xInnerTo(e.clientX);
      yInnerTo(e.clientY);
      xOuterTo(e.clientX);
      yOuterTo(e.clientY);
      xLabelTo(e.clientX);
      yLabelTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [innerSpeed, outerSpeed]);

  useEffect(() => {
    if (!innerRef.current || !outerRef.current || !labelRef.current) return;

    if (cursorType === 'drag') {
      gsap.to(outerRef.current, {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(71, 106, 253, 0.15)',
        borderColor: 'rgba(71, 106, 253, 0.8)',
        duration: 0.4,
        ease: 'power3.out'
      });
      gsap.to(innerRef.current, { scale: 0, opacity: 0, duration: 0.3 });
      gsap.to(labelRef.current, { scale: 1, opacity: 1, duration: 0.4 });
    } else if (cursorType === 'dragging') {
      gsap.to(outerRef.current, {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(71, 106, 253, 0.4)',
        borderColor: 'rgba(71, 106, 253, 1)',
        duration: 0.3,
        ease: 'power3.out'
      });
      gsap.to(innerRef.current, { scale: 0, opacity: 0, duration: 0.2 });
      gsap.to(labelRef.current, { scale: 0.5, opacity: 0, duration: 0.2 });
    } else if (cursorType === 'link') {
      gsap.to(innerRef.current, {
        width: outerSize,
        height: outerSize,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out'
      });
      gsap.to(outerRef.current, {
        width: outerSize * 1.2,
        height: outerSize * 1.2,
        borderColor: 'rgba(71, 106, 253, 0.8)',
        duration: 0.4,
        ease: 'power3.out'
      });
    } else {
      // Default and 'project' types
      gsap.to(outerRef.current, {
        width: outerSize,
        height: outerSize,
        backgroundColor: 'transparent',
        borderColor: outerBorderColor,
        duration: 0.4,
        ease: 'power3.out'
      });
      gsap.to(innerRef.current, { 
        width: innerSize,
        height: innerSize,
        scale: 1, 
        opacity: 1, 
        duration: 0.3 
      });
      gsap.to(labelRef.current, { scale: 0, opacity: 0, duration: 0.3 });
    }
  }, [cursorType, outerSize, innerSize, outerBorderColor]);

  return (
    <>
      {/* Outer Circle */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none z-100 rounded-full transition-[background-color,border-color] backdrop-blur-[2px]"
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
      {/* Label for Drag Text */}
      <div
        ref={labelRef}
        className="fixed top-0 left-0 pointer-events-none z-[101] flex items-center justify-center opacity-0 scale-0"
      >
        <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase drop-shadow-md">
          DRAG
        </span>
      </div>
    </>
  );
};

export default CustomCursor;
