'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCursor, CursorType } from '@/app/context/CursorContext';

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
  outerBorderColor = 'rgba(251, 191, 36, 0.5)',
  outerBorderWidth = 1,
  outerGlowColor = 'rgba(251, 191, 36, 0.3)',
  innerSpeed = 0.5, // Slower as requested
  outerSpeed = 0.15, // Faster
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const { cursorType, setCursorType } = useCursor();
  useCursor();

  useEffect(() => {
    if (!innerRef.current || !outerRef.current || !labelRef.current) return;

    const isTouchOrMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;
    if (isTouchOrMobile) {
      gsap.set([innerRef.current, outerRef.current, labelRef.current], { display: 'none' });
      return;
    }

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

    const scaleXOuterTo = gsap.quickTo(outerRef.current, 'scaleX', {
      duration: 0.15,
      ease: 'power2.out',
    });
    const scaleYOuterTo = gsap.quickTo(outerRef.current, 'scaleY', {
      duration: 0.15,
      ease: 'power2.out',
    });

    let xPrev = 0;
    let yPrev = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;
    let isScrolling = false;
    let wasOverCanvas = false;
    let lastScrollTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      xInnerTo(e.clientX);
      yInnerTo(e.clientY);
      xOuterTo(e.clientX);
      yOuterTo(e.clientY);
      xLabelTo(e.clientX);
      yLabelTo(e.clientY);

      // Squeeze & Squash calculations (ratio velocity-based)
      const deltaX = e.clientX - xPrev;
      const deltaY = e.clientY - yPrev;

      const scaleX = gsap.utils.clamp(0.6, 1.4, 1 + Math.abs(deltaX) * 0.005 - Math.abs(deltaY) * 0.005);
      const scaleY = gsap.utils.clamp(0.6, 1.4, 1 - Math.abs(deltaX) * 0.005 + Math.abs(deltaY) * 0.005);

      scaleXOuterTo(scaleX);
      scaleYOuterTo(scaleY);

      xPrev = e.clientX;
      yPrev = e.clientY;

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        scaleXOuterTo(1);
        scaleYOuterTo(1);
      }, 80);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const interactive = target.closest('a, button, [data-cursor]');
      if (interactive) {
        const type = interactive.getAttribute('data-cursor');
        setCursorType((type as CursorType) || 'link');
      } else {
        setCursorType('default');
      }
    };

    const checkCursorUnderMouse = () => {
      if (xPrev === 0 && yPrev === 0) {
        isScrolling = false;
        return;
      }
      
      const element = document.elementFromPoint(xPrev, yPrev);
      if (!element) {
        isScrolling = false;
        return;
      }

      // Fast path tag check before DOM traversal
      const isOverCanvas = element.tagName === 'CANVAS' || !!element.closest('canvas');
      
      // Dispatch a synthetic pointermove event ONLY if we are over a canvas,
      // or if we were previously over a canvas (to notify it that we left).
      if (isOverCanvas || wasOverCanvas) {
        const fakeEvent = new PointerEvent('pointermove', {
          clientX: xPrev,
          clientY: yPrev,
          bubbles: true,
          cancelable: true,
          view: window
        });
        element.dispatchEvent(fakeEvent);
      }
      
      wasOverCanvas = isOverCanvas;

      const interactive = element.closest('a, button, [data-cursor]');
      if (interactive) {
        const type = interactive.getAttribute('data-cursor');
        setCursorType((type as CursorType) || 'link');
      } else if (!isOverCanvas) {
        // Only force default if we are NOT over a canvas.
        setCursorType('default');
      }
      isScrolling = false;
    };

    const handleScroll = () => {
      const now = Date.now();
      // Increased throttle to 80ms (~12 FPS) for extreme optimization during scroll
      if (!isScrolling && now - lastScrollTime > 80) {
        isScrolling = true;
        lastScrollTime = now;
        rafId = requestAnimationFrame(checkCursorUnderMouse);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [innerSpeed, outerSpeed, setCursorType]);

  useEffect(() => {
    if (!innerRef.current || !outerRef.current || !labelRef.current) return;

    const isTouchOrMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;
    if (isTouchOrMobile) return;

    if (cursorType === 'drag' || cursorType === 'view') {
      gsap.to(outerRef.current, {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(251, 191, 36, 0.15)',
        borderColor: 'rgba(251, 191, 36, 0.8)',
        duration: 0.4,
        ease: 'power3.out'
      });
      gsap.to(innerRef.current, { scale: 0, autoAlpha: 0, duration: 0.3 });
      gsap.to(labelRef.current, { scale: 1, autoAlpha: 1, duration: 0.4 });
    } else if (cursorType === 'dragging') {
      gsap.to(outerRef.current, {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(251, 191, 36, 0.4)',
        borderColor: 'rgba(251, 191, 36, 1)',
        duration: 0.3,
        ease: 'power3.out'
      });
      gsap.to(innerRef.current, { scale: 0, autoAlpha: 0, duration: 0.2 });
      gsap.to(labelRef.current, { scale: 0.5, autoAlpha: 0, duration: 0.2 });
    } else if (cursorType === 'link') {
      gsap.to(innerRef.current, {
        width: outerSize,
        height: outerSize,
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power3.out'
      });
      gsap.to(outerRef.current, {
        width: outerSize * 1.2,
        height: outerSize * 1.2,
        borderColor: 'rgba(251, 191, 36, 0.8)',
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
        autoAlpha: 1,
        duration: 0.3
      });
      gsap.to(labelRef.current, { scale: 0, autoAlpha: 0, duration: 0.3 });
    }
  }, [cursorType, outerSize, innerSize, outerBorderColor]);

  return (
    <>
      {/* Outer Circle */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none z-100 rounded-full transition-[background-color,border-color] mix-blend-difference hidden lg:block"
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
        className="fixed top-0 left-0 pointer-events-none z-100 rounded-full backdrop-invert hidden lg:block"
        style={{
          width: innerSize,
          height: innerSize,
        }}
      />
      {/* Label for Drag/View Text */}
      <div
        ref={labelRef}
        className="fixed top-0 left-0 pointer-events-none z-100 items-center justify-center opacity-0 scale-0 hidden lg:flex"
      >
        <span className={`text-[10px] font-black tracking-[0.2em] uppercase drop-shadow-md ${cursorType === 'view' ? 'text-gray-400' : 'text-white'}`}>
          {cursorType === 'view' ? 'VIEW' : 'DRAG'}
        </span>
      </div>
    </>
  );
};

export default CustomCursor;
