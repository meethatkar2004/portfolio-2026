import React from 'react'
import DotField from '../../reactBitsComponents/dotField/DotField'

const Hero = () => {
  return (
    <div className='w-full h-screen relative'>
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
  )
}

export default Hero