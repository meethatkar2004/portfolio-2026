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

    // 1. Initial word-slide entry
    tl.from(movingWords, {
      xPercent: (index: number) => index * 10,
      opacity: 0.3,
      stagger: 0.1,
      duration: 1,
      delay: 0.3,
      ease: "expo.inOut",
      force3D: true,
    });

    // 2. Main reveal sequence
    tl.to(children, {
      yPercent: -100,
      duration: 1,
      ease: "power3.inOut",
      force3D: true,
    }, "reveal")
    .to(loader.current, {
      yPercent: -100,
      duration: 1,
      ease: "power3.inOut",
      force3D: true,
      lazy: false,
    }, "reveal");

    // 3. Screen transitions
    tl.to(fullScreen.current, {
      height: '0vh',
      duration: 1.2,
      ease: "expo.inOut",
      force3D: true,
    }, "-=1")
    .to(GreenDiv.current, {
      height: "100vh",
      duration: 1.2,
      ease: "expo.inOut",
      force3D: true,
    }, "-=0.9")
    .to(heroBg.current, {
      height: "100vh",
      duration: 1.2,
      ease: "expo.inOut",
      force3D: true,
    }, "-=1");

    return () => {
      tl.kill();
    };
  }, { scope: container });

  return (
    <div ref={container} id="main-loader-container" className={`${isFixed ? 'fixed inset-0 z-[100]' : 'relative z-0'} w-screen h-screen overflow-hidden`}>
      {/* Intro Black Screen */}
      <div ref={fullScreen} className={`absolute inset-0 flex flex-col justify-center items-center bg-background z-10 overflow-hidden contain-layout contain-paint ${isFixed ? 'pointer-events-none' : ''}`}>
        <div className='absolute top-[5%] left-1/2 -translate-x-1/2 text-center uppercase w-full font-bold tracking-widest text-xs opacity-50'>
          <h1><RevealText>PORTFOLIO</RevealText></h1>
          <h1><RevealText>&copy; 2026</RevealText></h1>
        </div>

        <h1 className='text-[5vw] font-bold'>
          <RevealText isSlidingAnim>
            {["Meet", "Hatkar", "is", "a", ".", ".", "."].map((word, index) => (
              <span key={index} className='moving-word inline-block'>{word}&nbsp;</span>
            ))}
          </RevealText>
        </h1>

        <div className='absolute bottom-[10%] overflow-clip'>
          <div ref={loader}><Loader /></div>
        </div>
      </div>

      {/* Transitional Green Layer */}
      <div ref={GreenDiv} className={`absolute bottom-0 left-0 w-full h-0 bg-primary z-20 contain-layout contain-paint ${isFixed ? 'pointer-events-none' : ''}`} />

      {/* Main Hero Background Layer */}
      <div ref={heroBg} className={`absolute bottom-0 left-0 w-full h-0 bg-background z-30 contain-layout contain-paint ${isFixed ? 'pointer-events-none' : ''}`}>
        <div className='absolute top-0 w-full'>
            <Navbar animateHero={animateHero} />
        </div>
        <Hero animateHero={animateHero}/>
      </div>
    </div>
  )
}

export default InitialLoad;
