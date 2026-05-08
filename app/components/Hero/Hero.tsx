import React from 'react'
import DotField from '../../reactBitsComponents/dotField/DotField'

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
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh]"
        style={{ backgroundImage: 'linear-gradient(to bottom, rgba(255,250,229,0), var(--background))' }}
      />
    </div>
  )
}

export default Hero