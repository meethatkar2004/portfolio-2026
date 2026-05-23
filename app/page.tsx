'use client';
import CertificateCard from "./components/certificateCard/CertificateCard";
import ProjectList from "./components/projectList/ProjectList";
import Playful from "./components/playful/Playful";
import { useRef, useState } from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import InitialLoad from "./commonComponents/Loader/InitialLoad";
import Navbar from "./components/navbar/Navbar";
import Whyme from "./components/whyMe/Whyme";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const text = "FORGET NORMAL. CREATE IMPACT";

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
      </div>
    </main>
  );
}
