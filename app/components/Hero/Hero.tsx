import React from 'react'
import DotField from '../../reactBitsComponents/dotField/DotField'
import Lanyard from '../../reactBitsComponents/lanyard/Lanyard'

const Hero = () => {
  return (
    <div className='w-full h-screen relative overflow-hidden'>
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
        <h1 className='text-[10vw] md:text-[8vw] leading-[0.85] text-secondary tracking-tighter opacity-90'>
          WEBSITE
        </h1>
        <h1 className='text-[10vw] md:text-[8vw] leading-[0.85] text-secondary tracking-tighter opacity-90 ml-[8vw] md:ml-[10vw]'>
          DESIGNER
        </h1>
        <p className='text-sm md:text-xl text-primary ml-[8.5vw] md:ml-[37vw] mt-4 font-semibold tracking-normal'>
          BASED IN MUMBAI
        </p>
      </div>

      {/* Lanyard on the right */}
      <div className='absolute right-[5%] top-1/2 -translate-y-1/2 border-2 rounded-xl w-full h-3/4 md:w-[450px] z-10 backdrop-blur-[1.5px]'>
        <Lanyard position={[0, 0, 12]} gravity={[0, -40, 0]} />
      </div>

      {/* Bottom Gradient Fade */}
      <div className='absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-background to-transparent z-10 pointer-events-none' />
    </div >
  )
}

export default Hero