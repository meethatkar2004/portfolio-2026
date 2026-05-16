import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react'
import Loader from './Loader';

/**
 * A reusable component that wraps text in a parent/child span structure
 * for reveal animations.
 */
const RevealText = ({ children, isSlidingAnim=false }: { children: React.ReactNode, isSlidingAnim?: boolean }) => {
  return (
    <span className="inline-block overflow-hidden">
      <span className={`child inline-block ${isSlidingAnim ? 'w-screen text-center' : ''}`}>
        {children}
      </span>
    </span>
  );
};

const InitialLoad = () => {
  const GreenDiv = useRef<HTMLDivElement>(null);
  const fullScreen = useRef<HTMLDivElement>(null);
  const heroBg = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".moving-word", {
      x: (index) => `${index * 10}%`,
      opacity: 0,
      stagger: 0.12,
      duration: 1.2,
      ease: "sine"
    })

    // 1. Reveal the text by moving the child span up
    tl.to(".child", {
      y: "-100%",
      stagger: 0.1,
      duration: 1,
      // delay: 2,
      ease: "power3.out"
    }, "up")
    .to(loader.current, {
      y: "-100%",
      duration: 1,
      ease: "power3.out"
    }, "up")

    // 2. Hide the loader elements
    tl.to(fullScreen.current, {
      height: '0vh',
      duration: 1.5,
      ease: "expo.inOut",
      delay: 0.5 // Keep text visible for a moment
    })

    tl.to(GreenDiv.current, {
      height: "100vh",
      ease: "expo.inOut",
      duration: 1.5,
    }, "-=1.5")

    tl.to(heroBg.current, {
      height: "100vh",
      ease: "expo.inOut",
      duration: 1.2,
    }, "-=1.2")

  }, { scope: container });

  return (
    <div ref={container} id="main" className='relative w-screen h-screen'>
      <div ref={fullScreen} id="loader" className='w-screen h-screen relative overflow-hidden flex flex-col justify-center items-center'>
        <div id="top-heading" className='absolute top-[2.5%] left-1/2 -translate-x-1/2 text-center uppercase w-full font-semibold'>
          <h1>
            <RevealText>PORTFOLIO</RevealText>
          </h1>
          <h1>
             <RevealText>&copy; 2026</RevealText>
          </h1>
        </div>
        <div>
          <h1 className='text-[5vw]'>
            <RevealText isSlidingAnim={true}>
              {["Meet", "Hatkar", "is", "a", ".", ".", "."].map((word, index) => (
                <span key={index} className='moving-word inline-block'>
                  {word}&nbsp;
                </span>
              ))}
            </RevealText>
          </h1>
        </div>
        <div className='absolute bottom-[5%] overflow-hidden'>
          <div ref={loader}>
            <Loader />
          </div>
        </div>
      </div>
      <div ref={GreenDiv} id="green" className='absolute bottom-0 w-full h-0 bg-green-400'></div>
      <div id="hero-bg" ref={heroBg} className='absolute bottom-0 w-full h-0 bg-green-100'></div>
    </div>
  )
}

export default InitialLoad
