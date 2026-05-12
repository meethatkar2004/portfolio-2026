'use client';
import DotField from '../../reactBitsComponents/dotField/DotField'
import Lanyard from '../../reactBitsComponents/lanyard/Lanyard'

const Hero = () => {
  return (
    <div className='w-full h-screen relative overflow-hidden bg-background'>
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
        <h1 className='text-[10vw] md:text-[9vw] leading-[0.85] text-secondary tracking-widest opacity-90 overflow-hidden p-2'>
          <span className="inline-block will-change-transform font-heading">
            WEBSITE
          </span>
        </h1>
        <h1 className='text-[10vw] md:text-[9vw] leading-[0.85] text-secondary tracking-widest opacity-90 ml-[8vw] md:ml-[10vw] overflow-hidden'>
          <span className="inline-block will-change-transform font-heading">
            DESIGNER
          </span>
        </h1>
        <p className='text-sm md:text-xl text-primary ml-[8.5vw] md:ml-[45vw] mt-4 font-semibold tracking-normal overflow-hidden'>
          <span className="inline-block will-change-transform font-heading">
            BASED IN MUMBAI
          </span>
        </p>
      </div>

      {/* Lanyard on the right */}
      <div
        className='absolute left-0 top-0 w-full h-full z-10 overflow-hidden will-change-[height] pl-[0%]'
      >
        <Lanyard position={[0, 0, 8]} gravity={[0, -40, -5]} />
      </div>

      {/* Bottom Gradient Fade */}
      <div className='absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none' />
    </div >
  )
}

export default Hero