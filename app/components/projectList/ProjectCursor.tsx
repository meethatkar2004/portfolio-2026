'use client';

import { useEffect, useRef } from 'react';

export default function ProjectCursor({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const container = containerRef.current;
    if (!cursor || !container) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isHovering = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseEnter = (e: MouseEvent) => {
      isHovering = true;
      cursor.style.opacity = '1';
      // instantly snap to mouse on enter to avoid cursor flying from across screen
      cursorX = e.clientX;
      cursorY = e.clientY;
    };

    const onMouseLeave = () => {
      isHovering = false;
      cursor.style.opacity = '0';
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    const render = () => {
      if (isHovering) {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%)) rotate(-4deg)`;
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center opacity-0 transition-opacity duration-300"
    >
      <div className="bg-blue-700 text-white font-bold tracking-wider px-5 py-2 text-sm sm:text-base whitespace-nowrap shadow-lg">
        DISCOVER
      </div>
    </div>
  );
}
