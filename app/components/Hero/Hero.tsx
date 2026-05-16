'use client';
import React, { useRef } from 'react'
import Lanyard from '../../reactBitsComponents/lanyard/Lanyard'
import DotField from '../../reactBitsComponents/dotField/DotField'

const Hero = () => {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={container} 
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
      <div className='absolute left-[5vw] top-[45%] -translate-y-1/2 z-30 pointer-events-none'>
        <h1 className='text-[10vmax] font-black leading-[0.8] tracking-tighter text-heading uppercase'>
          <span className="block">CREATIVE</span>
          <span className="block ml-[12vw]">
            DESIGNER
          </span>
        </h1>
        <p className='text-sm md:text-xl text-primary ml-[8vw] md:ml-[45vw] mt-6 font-bold tracking-widest uppercase opacity-80'>
          BASED IN MUMBAI
        </p>
      </div>

      {/* Lanyard Interactive Layer */}
      <div className='absolute inset-0 z-20 overflow-hidden pointer-events-none'>
        {/* We use pointer-events-none on the container but Lanyard's internal Canvas handles its own raycasting */}
        <Lanyard position={[0, 0, 8]} gravity={[0, -40, -5]} />
      </div>

      {/* Bottom Aesthetic Gradient Fade */}
      <div className='absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none' />
    </div>
  )
}

export default Hero;