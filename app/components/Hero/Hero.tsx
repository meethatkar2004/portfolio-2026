'use client';
import React, { useRef } from 'react'
import DotField from '../../reactBitsComponents/dotField/DotField'
import Lanyard from '../../reactBitsComponents/lanyard/Lanyard'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lanyardRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLSpanElement[]>([]);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.5 } });

    // Animate lanyard container growing up from the bottom anchor
    tl.fromTo(lanyardRef.current,
      { height: 0, opacity: 0 },
      { height: "85%", opacity: 1, duration: 2 }
    );

    // Animate text elements sliding up
    tl.fromTo(textRefs.current,
      { y: "100%" },
      { y: "0%", stagger: 0.1, duration: 1.2 },
      "-=1.5" // Overlap with lanyard animation
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className='w-full h-screen relative overflow-hidden bg-background'>
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
      {/* Main Typography */}
      <div className='absolute left-[5%] top-1/2 -translate-y-1/2 z-20 pointer-events-none uppercase font-bold'>
        <h1 className='text-[10vw] md:text-[8vw] leading-[0.85] text-secondary tracking-tighter opacity-90 overflow-hidden'>
          <span ref={el => { if (el) textRefs.current[0] = el }} className="inline-block will-change-transform">
            WEBSITE
          </span>
        </h1>
        <h1 className='text-[10vw] md:text-[8vw] leading-[0.85] text-secondary tracking-tighter opacity-90 ml-[8vw] md:ml-[10vw] overflow-hidden'>
          <span ref={el => { if (el) textRefs.current[1] = el }} className="inline-block will-change-transform">
            DESIGNER
          </span>
        </h1>
        <p className='text-sm md:text-xl text-primary ml-[8.5vw] md:ml-[37vw] mt-4 font-semibold tracking-normal overflow-hidden'>
          <span ref={el => { if (el) textRefs.current[2] = el }} className="inline-block will-change-transform">
            BASED IN MUMBAI
          </span>
        </p>
      </div>

      {/* Lanyard on the right */}
      <div
        ref={lanyardRef}
        className='absolute left-0 top-0 w-full h-full z-10 overflow-hidden will-change-[height] pl-[60%]'
      >
        <Lanyard position={[0, 0, 8]} gravity={[0, -40, -5]} />
      </div>

      {/* Bottom Gradient Fade */}
      <div className='absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none' />
    </div >
  )
}

export default Hero