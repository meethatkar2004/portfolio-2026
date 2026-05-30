"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Header from "@/app/commonComponents/Header/Header";

gsap.registerPlugin(ScrollTrigger);

import { useLoading } from "@/app/context/LoadingContext";

const Whyme = () => {
  const { isLoading } = useLoading();
  const containerRef = useRef(null);

  const text =
    "I build websites that don’t just look good, But they feel interactive, modern, and unforgettable. With startup experience, 30+ landing pages, and 20+ animation-driven experiences, I focus on creating products that stand out in today’s web culture.";

  useGSAP(

    () => {
      if (isLoading) return false;
      gsap.set(".reveal-word", {
        opacity: 0.03,
        scaleX: 0.9, // Switched from 'scale' to 'scaleX' to avoid conflict with scaleY
        y: "80%", // Using y translation instead of blur for a smooth, performant reveal
        scaleY: -1
      });

      gsap.to(".reveal-word", {
        opacity: 1,
        scaleX: 1,
        y: 0,
        stagger: 0.08,
        scaleY: 1,
        ease: "power2.out", // A smoother ease

        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          end: "bottom 70%",
          scrub: 1,
        },
      });
    },
    { scope: containerRef, dependencies: [isLoading] }
  );

  return (
    <Header
      title="Why Me ??!"
      titleClass="text-[5vmax] text-background"
    >
      <section
        ref={containerRef}
        className="pb-[5%] flex items-center justify-center px-6"
      >
        <h1 className="max-w-7xl text-background/90 font-sans text-[clamp(3rem,5vw,6rem)] leading-[1.2] font-bold tracking-tight flex flex-wrap justify-center gap-x-3 md:gap-x-4">
          {text.split(" ").map((word, index) => (
            <span key={index} className="reveal-word inline-block will-change-[transform,opacity]">
              {word}
            </span>
          ))}
        </h1>
      </section>
    </Header>
  );
};

export default Whyme;