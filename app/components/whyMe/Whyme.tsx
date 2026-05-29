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
    "I build websites that don’t just look good x they feel interactive, modern, and unforgettable. With startup experience, 30+ landing pages, and 20+ animation-driven experiences, I focus on creating products that stand out in today’s web culture.";

  useGSAP(
    
    () => {
      if(isLoading) return false;
      gsap.set(".reveal-word", {
        opacity: 0.15,
        scale: 0.9,
        filter: "blur(10px)",
      });

      gsap.to(".reveal-word", {
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.08,
        scale: 1,
        ease: "none",

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
      <h1 className="max-w-7xl text-background/80 font-heading text-4xl md:text-7xl leading-[1.4] font-medium flex flex-wrap justify-center gap-x-4">
        {text.split(" ").map((word, index) => (
          <span key={index} className="reveal-word">
            {word}
          </span>
        ))}
      </h1>
    </section>
      </Header>
  );
};

export default Whyme;