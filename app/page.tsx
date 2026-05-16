'use client';
import CertificateCard from "./components/certificateCard/CertificateCard";
import ProjectList from "./components/projectList/ProjectList";
import Hero from "./components/Hero/Hero";
import { useScroll } from "./context/ScrollContext";
import { useRef } from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import InitialLoad from "./commonComponents/Loader/InitialLoad";
import Loader from "./commonComponents/Loader/Loader";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { setIsPinned } = useScroll();
  const mainRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const text = "FORGET NORMAL. CREATE IMPACT";

  useGSAP(() => {
    if (!sectionRef.current || !heroTextRef.current || !mainRef.current) return;

    // Use scrollWidth - window.innerWidth to stop text at the right edge
    const scrollWidth = sectionRef.current.scrollWidth - window.innerWidth;

    gsap.to(sectionRef.current, {
      x: -scrollWidth,
      ease: "none",
        scrollTrigger: {
          trigger: heroTextRef.current,
          start: "center center",
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          end: `left left`,
          invalidateOnRefresh: true,
          markers: false,
          onToggle: (self) => setIsPinned(self.isActive),
        }
      });
    });
  
    return (
      <main 
        ref={mainRef}
        id="main-wrapper" 
        className="relative flex flex-col items-center w-full"
      >
        <InitialLoad />
        <Hero />
        
        {/* Horizontal Scroll Section - Now h-screen for full locking effect */}
        <div ref={heroTextRef} className="relative w-full py-[5%] overflow-hidden bg-background z-10 flex items-center">
          <div
            ref={sectionRef}
            className="flex items-center w-max px-[5vw] whitespace-nowrap"
          >
            <h1 className="text-[13vmax] font-black leading-none tracking-tighter text-heading select-none">
              {text}
            </h1>
          </div>
        </div>

      <ProjectList />
      <CertificateCard />
    </main>
  );
}
