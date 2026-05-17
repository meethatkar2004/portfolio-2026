import React, { useEffect, useState } from 'react'
import Eye from './Eye'

const Playful = () => {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - (window.innerWidth / 2);
      const deltaY = e.clientY - (window.innerHeight / 2);
      
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      setRotate(angle - 180);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className='w-full h-screen cursor-grab overflow-hidden relative'>
      <div className='h-full w-full flex items-center justify-center relative'>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-[2vmax] z-10'>
          {/* 1st eye */}
          <Eye rotate={rotate} key_val={1} />
          {/* 2nd eye */}
          <Eye rotate={rotate} key_val={2} />
        </div>
      </div>
    </div>
  )
}

export default Playful
