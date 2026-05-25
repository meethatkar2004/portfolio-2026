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

import Footer from "./components/footer/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isLoading || !sectionRef.current || !mainRef.current) return;

    // Ensure layout is settled before calculating ScrollTrigger
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);
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
        {/* <Whyme /> */}
        <ProjectList />
        <CertificateCard isLoading={isLoading} />
        <Playful isLoading={isLoading} />

        {/* Interactive Double Marquee Section */}
        <div className="relative w-full py-[12vh] md:py-[15vh] overflow-hidden z-10 flex flex-col gap-6 md:gap-12 justify-center select-none md:pb-[20%] bg-linear-to-b from-transparent via-transparent to-background">
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
    </main>
  );
}
