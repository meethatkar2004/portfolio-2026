'use client';
import React, { useRef } from 'react'
import { useCursor } from '../../context/CursorContext';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Navbar = ({ animateHero = false }: { animateHero?: boolean }) => {
  const { setCursorType } = useCursor();
  const container = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setCursorType('link');
  const handleMouseLeave = () => setCursorType('default');

  useGSAP(() => {
    if (!animateHero) {
      gsap.set(container.current, { opacity: 0 });
      return;
    }

    gsap.to(container.current, {
      opacity: 1,
      duration: 1.5,
      ease: 'power3.out'
    });
  }, { dependencies: [animateHero], scope: container });

  return (
    <div ref={container} className='w-full px-[3vw] py-6 flex items-center justify-between relative z-50 opacity-0'>
      <div className='h-full flex justify-start font-heading'>
        <span className='text-2xl font-extrabold text-primary uppercase tracking-tighter'>Meet</span>
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