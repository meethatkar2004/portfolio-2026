'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  text: string;
  className?: string;
  isLoading?: boolean;
}

export default function TextReveal({ text, className = '', isLoading = false }: TextRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const chars = text.split('');

  useGSAP(() => {
    if (!containerRef.current || isLoading) return;

    // Clean up any stale ScrollTriggers for this element
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === containerRef.current) {
        st.kill();
      }
    });

    gsap.fromTo(
      containerRef.current.querySelectorAll('.reveal-char'),
      {
        yPercent: 0,
        scaleY: 1,
        transformOrigin: 'bottom center',
      },
      {
        yPercent: 0,
        scaleY: 1.8,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 95%',
          toggleActions: 'play none none reverse',
          // markers: true,
          scrub: true,
        },
      }
    );
  }, { dependencies: [isLoading], scope: containerRef });

  return (
    <h1
      ref={containerRef}
      className={`select-none ${className}`}
    >
      {chars.map((char, index) => {
        if (char === ' ') {
          return (
            <span key={index} className="inline-block">
              &nbsp;
            </span>
          );
        }
        return (
          <span key={index} className="inline-block leading-none">
            <span className="reveal-char inline-block will-change-transform leading-none">
              {char}
            </span>
          </span>
        );
      })}
    </h1>
  );
}
