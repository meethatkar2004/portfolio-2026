'use client';
import CertificateCard from "./components/certificateCard/CertificateCard";
import ProjectList from "./components/projectList/ProjectList";
import { useScroll } from "./context/ScrollContext";
import { useRef, useState } from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import InitialLoad from "./commonComponents/Loader/InitialLoad";
import Navbar from "./components/navbar/Navbar";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { setIsPinned } = useScroll();
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  // const heroTextRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const text = "FORGET NORMAL. CREATE IMPACT";

  useGSAP(() => {
    if (isLoading || !sectionRef.current || !mainRef.current) return;

    // Ensure layout is settled before calculating ScrollTrigger
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);

    const scrollWidth = sectionRef.current.scrollWidth - window.innerWidth;

    // gsap.to(sectionRef.current, {
    //   x: -scrollWidth,
    //   ease: "none",
    //   scrollTrigger: {
    //     trigger: heroTextRef.current,
    //     start: "bottom bottom",
    //     pin: true,
    //     anticipatePin: 1,
    //     scrub: 1,
    //     end: `left left`,
    //     invalidateOnRefresh: true,
    //     onToggle: (self) => setIsPinned(self.isActive),
    //   }
    // });

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
        {/* Horizontal Scroll Section */}
        {/* <div ref={heroTextRef} className="relative w-full py-[5%] overflow-hidden bg-background z-10 flex items-center">
          <div
            ref={sectionRef}
            className="flex items-center w-max px-[5vw] whitespace-nowrap"
          >
            <h1 className="text-[13vmax] font-black leading-none tracking-tighter text-heading select-none">
              {text}
            </h1>
          </div>
        </div> */}

        <ProjectList />
        <CertificateCard isLoading={isLoading} />
      </div>
    </main>
  );
}
