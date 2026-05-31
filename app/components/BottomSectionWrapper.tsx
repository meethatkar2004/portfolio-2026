"use client";

import React, { useRef } from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLoading } from "../context/LoadingContext";

gsap.registerPlugin(ScrollTrigger);

export default function BottomSectionWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLoading();
  const bottomSectionRef = useRef<HTMLDivElement>(null);
  const marqueeSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isLoading || !bottomSectionRef.current || !marqueeSectionRef.current) return;

    // Ensure layout is settled before calculating ScrollTrigger
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);

    // Animate Marquee background as it reaches the end
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: marqueeSectionRef.current,
        start: 'bottom 100%',
        end: 'bottom 20%',
        scrub: true,
      }
    });

    tl.to([document.body, document.documentElement], {
      backgroundColor: '#ffffeb',
    }, 0);

    return () => clearTimeout(refreshTimer);
  }, [isLoading]);

  return (
    <div
      ref={bottomSectionRef}
      className="w-full bg-transparent relative z-10 transition-colors duration-150"
    >
      <div ref={marqueeSectionRef}>
        {/* We expect the first child to be the marquee content */}
        {React.Children.toArray(children)[0]}
      </div>
      {/* And the second child to be the Footer */}
      {React.Children.toArray(children).slice(1)}
    </div>
  );
}
