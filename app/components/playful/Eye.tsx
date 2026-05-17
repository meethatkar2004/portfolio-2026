import React from 'react'

interface EyeProps {
  rotate: number;
  key_val: number;
}

const Eye = ({ rotate, key_val }: EyeProps) => {
  return (
    <div id="eyes-wrapper-1" className='w-[13vmax] h-[13vmax] rounded-full bg-white flex items-center justify-center' key={key_val}>
      <div id="eyes-wrapper-2" className='w-2/3 h-2/3 bg-black rounded-full relative'>
        <div className="line h-9 w-full absolute top-1/2 left-1/2" style={{ transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}>
          <div id="pupil" className='w-9 h-9 bg-white rounded-full'>
          </div>
        </div>
        <p className="play absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm tracking-widest">PLAY</p>
      </div>
    </div>
  )
}

export default Eye
