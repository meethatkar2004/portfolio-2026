'use client';
import React, { useRef, useState, useEffect } from 'react'
import Lanyard from '../../reactBitsComponents/lanyard/Lanyard'
import DotField from '../../reactBitsComponents/dotField/DotField'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Hero = ({ animateHero }: { animateHero: boolean }) => {
  const container = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useGSAP(() => {
    if (!animateHero) {
      // Initially hide the text blocks below the overflow wrapper
      gsap.set(".hero-text", { y: "100%" });
      // Initially blur the lanyard wrapper and keep opacity low
      gsap.set(".lanyard-wrapper", { filter: "blur(12px)", opacity: 0.4 });
      return;
    }

    // Once loader is complete and animateHero is true, slide them up beautifully
    gsap.to(".hero-text", {
      y: "0%",
      duration: 1,
      stagger: 0.1,
      ease: "power4.out"
    });

    // Remove blur and fade opacity to 1 for the lanyard wrapper
    gsap.to(".lanyard-wrapper", {
      filter: "blur(0px)",
      opacity: 1,
      duration: 1.5,
      ease: "power3.out"
    });
  }, { dependencies: [animateHero], scope: container });

  return (
    <div
      ref={container}
      id="hero"
      className='relative w-full h-screen overflow-hidden bg-background'
    >
      {/* Background Interactive Layer */}
      <div className='absolute inset-0 z-0 pointer-events-none'>
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          bulgeStrength={67}
          glowRadius={0}
          sparkle={false}
          waveAmplitude={2}
          gradientFrom="#476afd"
          gradientTo="#011257"
          glowColor="transparent"
        />
      </div>

      {/* Hero Typography */}
      <div className='absolute left-[3vw] bottom-[10%] md:bottom-auto md:top-[45%] -translate-y-0 md:-translate-y-1/2 z-30 pointer-events-none'>
        <h1 className='text-[clamp(1.6rem,7vmax,10rem)] md:text-[clamp(2.2rem,10vmax,10rem)] font-black leading-[0.95] md:leading-[0.8] tracking-tighter text-heading uppercase'>
          <span className="block overflow-hidden">
            <span className="hero-text block">WEBSITE</span>
          </span>
          <span className="block overflow-hidden ml-[4vw] md:ml-[12vw]">
            <span className="hero-text block">
              DESIGNER
            </span>
          </span>
        </h1>
        <div className="overflow-hidden mt-6=[2%]">
          <p className='hero-text text-[clamp(0.875rem,0.7rem+0.8vw,1.25rem)] text-primary ml-[45vw] md:ml-[50vw] font-bold tracking-widest uppercase opacity-80 block'>
            BASED IN MUMBAI
          </p>
        </div>
      </div>

      {/* Lanyard Interactive Layer */}
      <div className='lanyard-wrapper absolute inset-x-0 top-[0%] h-[80vh] md:h-screen w-full z-20 overflow-hidden pointer-events-none'>
        {/* We use pointer-events-none on the container but Lanyard's internal Canvas handles its own raycasting */}
        <Lanyard isMobile={isMobile} position={isMobile ? [0, 0, 9.5] : [0, 0, 8]} gravity={[0, -40, -5]} />
      </div>

      {/* Bottom Aesthetic Gradient Fade */}
      <div className='absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none' />
    </div>
  )
}

export default Hero;