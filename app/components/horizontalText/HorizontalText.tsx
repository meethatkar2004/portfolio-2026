'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import FilmGrain from '../../commonComponents/FilmGrain/FilmGrain';
import { useLoading } from '../../context/LoadingContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HorizontalText() {
  const { isLoading } = useLoading();
  const containerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isLoading || !containerRef.current || !scrollRef.current) return;

      // 1. Horizontal scroll layout calculation with dynamic functions
      // This ensures that when fonts load or window is resized, GSAP dynamically recalculates the exact scroll widths!
      gsap.to(scrollRef.current, {
        x: () => {
          if (!scrollRef.current || !containerRef.current) return 0;
          const scrollWidth = scrollRef.current.scrollWidth;
          const viewportWidth = containerRef.current.offsetWidth;
          return -(scrollWidth - viewportWidth + 300); // 300px extra buffer for complete visual clearance
        },
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'center center',
          end: () => {
            if (!scrollRef.current) return '+2000';
            return `+=${scrollRef.current.scrollWidth}`;
          },
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 2. Page background color transition
      // Transitions background to dark (#343434) on enter, keeping it dark for subsequent sections,
      // and transitions it back to cream when scrolling back up past the top of this section.
      gsap.to([document.body, document.documentElement], {
        backgroundColor: '#343434',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 30%',
          toggleActions: 'play reverse play reverse',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // 3. Handle late custom font rendering (e.g. Anton SC) which changes word widths dynamically
      if (typeof window !== 'undefined' && 'fonts' in document) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: containerRef, dependencies: [isLoading] }
  );

  return (
    <section
      ref={containerRef}
      className="w-full mt-[20%] min-h-screen flex flex-col justify-center bg-transparent relative overflow-hidden py-32 select-none"
    >
      <FilmGrain opacity={0.15} zIndex={1} />

      {/* Dynamic atmospheric ambient glows */}
      <div className="absolute top-[10%] left-[-15%] w-[60vw] h-[60vw] rounded-full blur-[160px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-[10%] right-[-15%] w-[60vw] h-[60vw] rounded-full blur-[160px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '14s' }} />

      {/* SEO Friendly Screen-Reader Semantic Heading */}
      <h2 className="sr-only">
        Forget Normal Create Impact - Dynamic Typographic Statement
      </h2>

      {/* Brand contextual label */}
      <div className="w-full max-w-[1900px] mx-auto px-8 md:px-20 mb-8 md:mb-12 relative z-10">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
          <p className="font-mono text-xs md:text-sm tracking-[0.4em] text-yellow-400/80 uppercase font-bold">
            CREATIVE CREDO
          </p>
        </div>
      </div>

      {/* Horizontal Scrolling Track containing only the ultra-massive text */}
      <div
        ref={scrollRef}
        className="flex flex-row items-center flex-nowrap h-fit pl-[10vw] pr-[30vw] gap-[8vw] md:gap-[10vw] will-change-transform relative z-10"
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        {/* FORGET */}
        <div className="font-[family:var(--font-anton)]  text-white uppercase text-[clamp(10rem,28vw,36rem)] font-black leading-none tracking-tighter shrink-0 select-none">
          FORGET
        </div>

        {/* NORMAL */}
        <div className="font-[family:var(--font-anton)]  text-white uppercase text-[clamp(10rem,28vw,36rem)] font-black leading-none tracking-tighter shrink-0 select-none">
          NORMAL
        </div>

        {/* CREATE */}
        <div className="font-[family:var(--font-anton)]  text-white uppercase text-[clamp(10rem,28vw,36rem)] font-black leading-none tracking-tighter shrink-0 select-none">
          CREATE
        </div>

        {/* IMPACT */}
        <div className="font-[family:var(--font-anton)]  text-white uppercase text-[clamp(10rem,28vw,36rem)] font-black leading-none tracking-tighter shrink-0 select-none pr-12">
          IMPACT
        </div>
      </div>
    </section>
  );
}
