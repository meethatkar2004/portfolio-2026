'use client';

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Header from "@/app/commonComponents/Header/Header";
import { useLoading } from "@/app/context/LoadingContext";
import FilmGrain from "@/app/commonComponents/FilmGrain/FilmGrain";

gsap.registerPlugin(ScrollTrigger);

interface WhymeClientProps {
  text: string;
}

export default function WhymeClient({ text }: WhymeClientProps) {
  const { isLoading } = useLoading();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isLoading) return;

      gsap.set(".reveal-word", {
        opacity: 0.03,
        scaleX: 0.9,
        y: "80%",
        scaleY: -1
      });

      gsap.to(".reveal-word", {
        opacity: 1,
        scaleX: 1,
        y: 0,
        stagger: 0.08,
        scaleY: 1,
        ease: "power2.out",

        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Slightly extended to ensure reveal trigger captures early scroll states
          end: "bottom 65%",
          scrub: 1,
        },
      });
    },
    { scope: containerRef, dependencies: [isLoading] }
  );

  return (
    <Header
      title="Why Me ?!"
      titleClass="text-[clamp(2.25rem,5vw,4.5rem)] 2xl:text-7xl 4k:text-9xl font-extrabold text-background tracking-tight text-center"
    >
      <section
        ref={containerRef}
        className="w-full min-h-[50vh] flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 2xl:px-32 4k:px-44 py-12 md:py-20 relative overflow-hidden"
      >
        <FilmGrain />

        {/* Optimized fluid typographic clamps to handle text scaling safely from mobile to 4K displays */}
        <p className="max-w-6xl 2xl:max-w-7xl 4k:max-w-[120rem] text-background/90 font-sans text-[clamp(1.5rem,3.5vw,3rem)] md:text-[clamp(3rem,4.5vw,5rem)] 4k:text-8xl leading-[1.25] md:leading-[1.15] font-bold tracking-tight flex flex-wrap justify-center gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-1 sm:gap-y-2 relative z-10 text-center">
          {text.split(" ").map((word, index) => (
            <span
              key={index}
              className="reveal-word inline-block will-change-transform"
              style={{ transformOrigin: "bottom center" }}
            >
              {word}
            </span>
          ))}
        </p>
      </section>
    </Header>
  );
}