"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Whyme = () => {
  const containerRef = useRef(null);

  const text =
    "I build websites that don’t just look good — they feel interactive, modern, and unforgettable. With startup experience, 30+ landing pages, and 20+ animation-driven experiences, I focus on creating products that stand out in today’s web culture.";

  useGSAP(
    () => {
      gsap.set(".reveal-word", {
        opacity: 0.15,
        filter: "blur(10px)",
      });

      gsap.to(".reveal-word", {
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.08,
        ease: "none",

        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 1,
          // markers: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-black flex items-center justify-center px-6"
    >
      <h1 className="max-w-6xl text-[#3a120c] text-4xl md:text-6xl leading-[1.4] font-medium flex flex-wrap gap-x-4">
        {text.split(" ").map((word, index) => (
          <span key={index} className="reveal-word">
            {word}
          </span>
        ))}
      </h1>
    </section>
  );
};

export default Whyme;