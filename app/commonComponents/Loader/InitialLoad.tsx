'use client';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import React, { useRef, useState } from 'react'
import Loader from './Loader';
import Hero from '@/app/components/Hero/Hero';
import Navbar from '@/app/components/navbar/Navbar';

const RevealText = ({ children, isSlidingAnim = false }: { children: React.ReactNode, isSlidingAnim?: boolean }) => (
  <span className="inline-block overflow-hidden">
    <span className={`child inline-block ${isSlidingAnim ? 'w-screen text-center' : ''}`}>
      {children}
    </span>
  </span>
);

const InitialLoad = ({ onComplete }: { onComplete: () => void }) => {
  const container = useRef<HTMLDivElement>(null);
  const fullScreen = useRef<HTMLDivElement>(null);
  const GreenDiv = useRef<HTMLDivElement>(null);
  const heroBg = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const [isFixed, setisFixed] = useState(true);
  const [animateHero, setAnimateHero] = useState(false);

  useGSAP(() => {
    gsap.set(
      [fullScreen.current, GreenDiv.current, heroBg.current, loader.current],
      { willChange: "transform, opacity" }
    );

    // Initialize transitional layers as full-height and offset down to avoid layout shifts (CLS)
    gsap.set(GreenDiv.current, { yPercent: 100, height: "100vh" });
    gsap.set(heroBg.current, { yPercent: 100, height: "100vh" });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(
          [fullScreen.current, GreenDiv.current, heroBg.current, loader.current],
          { willChange: "auto" }
        );
        onComplete();
        setisFixed(false);
        setAnimateHero(true);
      }
    });

    const movingWords = gsap.utils.toArray(".moving-word", container.current);
    const children = gsap.utils.toArray(".child", container.current);

    // 1. Initial word-slide entry (optimized durations for better LCP)
    tl.from(movingWords, {
      xPercent: (index: number) => index * 10,
      opacity: 0.3,
      stagger: 0.05,
      duration: 0.6,
      delay: 0.1,
      ease: "expo.out",
      force3D: true,
    });

    // 2. Main reveal sequence
    tl.to(children, {
      yPercent: -100,
      duration: 0.6,
      ease: "power3.inOut",
      force3D: true,
    }, "reveal")
      .to(loader.current, {
        yPercent: -100,
        duration: 0.6,
        ease: "power3.inOut",
        force3D: true,
        lazy: false,
      }, "reveal");

    // 3. Screen transitions (using transform yPercent instead of height to achieve 0 CLS)
    tl.to(fullScreen.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut",
      force3D: true,
    }, "-=0.6")
      .to(GreenDiv.current, {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.inOut",
        force3D: true,
      }, "-=0.5")
      .to(heroBg.current, {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.inOut",
        force3D: true,
      }, "-=0.6");

    return () => {
      tl.kill();
    };
  }, { scope: container });

  return (
    <div ref={container} id="main-loader-container" className={`${isFixed ? 'fixed inset-0 z-[100]' : 'relative z-0'} w-screen h-screen overflow-hidden`}>
      {/* Intro Black Screen */}
      <div ref={fullScreen} className={`absolute inset-0 flex flex-col justify-center items-center bg-background z-10 overflow-hidden contain-layout contain-paint ${isFixed ? 'pointer-events-none' : ''}`}>
        <div className='absolute top-[5%] left-1/2 -translate-x-1/2 text-center uppercase w-full font-bold tracking-widest text-xs opacity-50'>
          <p><RevealText>PORTFOLIO</RevealText></p>
          <p><RevealText>&copy; 2026</RevealText></p>
        </div>

        <div className='text-[5vw] font-bold'>
          <RevealText isSlidingAnim>
            {["Meet", "Hatkar", "is", "a", ".", ".", "."].map((word, index) => (
              <span key={index} className='moving-word inline-block'>{word}&nbsp;</span>
            ))}
          </RevealText>
        </div>

        <div className='absolute bottom-[10%] overflow-clip'>
          <div ref={loader}><Loader /></div>
        </div>
      </div>

      {/* Transitional Green Layer */}
      <div ref={GreenDiv} className={`absolute bottom-0 left-0 w-full h-0 bg-primary z-40 contain-layout contain-paint ${isFixed ? 'pointer-events-none' : ''}`} />

      {/* Main Hero Background Layer */}
      <div ref={heroBg} className={`absolute bottom-0 left-0 w-full h-0 bg-background z-50 contain-layout contain-paint ${isFixed ? 'pointer-events-none' : ''}`}>
        <div className='absolute top-0 w-full'>
          <Navbar animateHero={animateHero} />
        </div>
        <Hero animateHero={animateHero} />
      </div>
    </div>
  )
}

export default InitialLoad;
