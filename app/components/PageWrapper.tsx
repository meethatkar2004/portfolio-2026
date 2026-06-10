"use client";

import React, { useRef, useEffect } from "react";
import InitialLoad from "../commonComponents/Loader/InitialLoad";
import { useLoading } from "../context/LoadingContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, setIsLoading } = useLoading();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <main
      ref={mainRef}
      id="main-wrapper"
      className="relative flex flex-col items-center w-full"
    >
      <InitialLoad onComplete={() => setIsLoading(false)} />
      <div className={`relative ${isLoading ? "opacity-0 invisible h-screen overflow-hidden" : "opacity-100 w-full"}`}>
        {children}
      </div>
    </main>
  );
}
