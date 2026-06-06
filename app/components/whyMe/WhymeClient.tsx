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
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (isLoading) return false;
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
          start: "top 80%",
          end: "bottom 60%",
          scrub: 1,
        },
      });
    },
    { scope: containerRef, dependencies: [isLoading] }
  );

  return (
    <Header
      title="Why Me ?!"
      titleClass="text-[clamp(2.5rem,5vmax,5.5rem)] text-background"
    >
      <section
        ref={containerRef}
        className="pb-[5%] flex items-center justify-center px-6 relative overflow-hidden"
      >
        <FilmGrain />
        <p className="max-w-7xl text-background/90 font-sans text-[clamp(3rem,5vw,6rem)] leading-[1.2] font-bold tracking-tight flex flex-wrap justify-center gap-x-3 md:gap-x-4 relative z-10">
          {text.split(" ").map((word, index) => (
            <span key={index} className="reveal-word inline-block will-change-[transform,opacity]">
              {word}
            </span>
          ))}
        </p>
      </section>
    </Header>
  );
}
