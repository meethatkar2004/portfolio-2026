'use client';
import CertificateCard from "./components/certificateCard/CertificateCard";
import ProjectList from "./components/projectList/ProjectList";
import Playful from "./components/playful/Playful";
import HeroText from "./components/heroText/HeroText";
import { useRef, useState } from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import InitialLoad from "./commonComponents/Loader/InitialLoad";
import Whyme from "./components/whyMe/Whyme";

import Footer from "./components/footer/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const marqueeSectionRef = useRef<HTMLDivElement>(null);
  const bottomSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isLoading || !mainRef.current || !marqueeSectionRef.current || !bottomSectionRef.current) return;

    // Ensure layout is settled before calculating ScrollTrigger
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);

    // Animate Marquee background as it reaches the end
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: marqueeSectionRef.current,
        start: 'bottom 100%', // Trigger when the bottom of the section hits the bottom of the viewport
        end: 'bottom 20%', // End when the bottom of the section reaches 20% from the top
        scrub: true,
        // markers: true,
      }
    });

    tl.to(bottomSectionRef.current, {
      backgroundColor: '#ffffeb',
    }, 0);

    return () => clearTimeout(refreshTimer);
}, [isLoading]);

  return (
    <main
      ref={mainRef}
      id="main-wrapper"
      className="relative flex flex-col items-center w-full"
    >
      <InitialLoad onComplete={() => setIsLoading(false)} />
      <div className={`relative ${isLoading ? "opacity-0 invisible h-screen overflow-hidden" : "opacity-100 w-full"}`}>
        <ProjectList />
        <CertificateCard isLoading={isLoading} />
        <Whyme isLoading={isLoading}/>
        <Playful isLoading={isLoading} />

        {/* Bottom Section containing both Marquee and Footer to change background at the same time */}
        <div
          ref={bottomSectionRef}
          className="w-full bg-[#343434] relative z-10 transition-colors duration-150"
        >
          {/* Interactive Double Marquee Section */}
          <div
            ref={marqueeSectionRef}
            className="relative w-full py-[12vh] md:py-[15vh] overflow-hidden flex flex-col gap-6 md:gap-12 justify-center select-none md:pb-[20%]"
          >
            <HeroText
              speed={10}
              direction="left"
              textArray={[
                "FORGET NORMAL CREATE IMPACT",
                "BREAK THE ORDINARY BUILD THE UNFORGETTABLE"
              ]}
            />
            <HeroText
              speed={10}
              direction="right"
              textArray={[
                "KING IS EXPERIENCE DEAD IS ORIDNARY",
                "OBSESSION TURN CLICK INTO OBSESSION",
              ]}
            />
          </div>

          <Footer isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
