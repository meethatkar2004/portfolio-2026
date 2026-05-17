'use client';
import React from 'react'
import { useCursor } from '../../context/CursorContext';

const Navbar = () => {
  const { setCursorType } = useCursor();

  const handleMouseEnter = () => setCursorType('link');
  const handleMouseLeave = () => setCursorType('default');

  return (
    <div className='w-full px-[3vw] py-6 flex items-center justify-between relative z-50'>
      <div className='h-full flex justify-start font-heading'>
        <span className='text-2xl font-extrabold text-primary uppercase tracking-tighter'>Meet Hatkar</span>
      </div>
      
      {/* Navigation Links */}
      <div className='absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 font-heading'>
        {['Projects', 'About', 'Skills', 'Contact'].map((item) => (
          <span 
            key={item}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className='text-lg font-bold text-heading cursor-pointer hover:text-primary transition-colors'
          >
            {item}
          </span>
        ))}
      </div>
      <div className='w-2 h-2 rounded-full bg-primary ml-2 shadow-[0_0_8px_rgba(71,106,253,0.6)]'></div>
    </div>
  )
}

export default Navbar;