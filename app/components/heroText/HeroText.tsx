'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const HeroText = () => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const text = "FORGET NORMAL. CREATE IMPACT";

  useGSAP(() => {
    if (!sectionRef.current || !triggerRef.current) return;

    // Use scrollWidth to accurately measure the true width of the overflowing text
    const scrollWidth = sectionRef.current.scrollWidth - window.innerWidth;

    gsap.to(sectionRef.current, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        pin: true,
        scrub: 1,
        start: "top 70%",
        end: `+=${scrollWidth}`,
        invalidateOnRefresh: true,
        markers: true
      }
    });
  }, { scope: triggerRef });

  return (
    <div ref={triggerRef} className="relative w-full overflow-hidden bg-background z-10">
      <div
        ref={sectionRef}
        className="flex items-center h-full w-max px-[5vw] whitespace-nowrap"
      >
        <h1 className="text-[13vmax] font-heading font-black leading-none tracking-tighter text-heading select-none">
          {text}
        </h1>
      </div>
    </div>
  );
};

export default HeroText;