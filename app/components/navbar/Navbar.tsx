'use client';
import React, { useRef } from 'react'
import CircularText from '../../reactBitsComponents/circularText/CircularText'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin);

const Navbar = ({ animateHero = false }: { animateHero?: boolean }) => {
  const container = useRef<HTMLDivElement>(null);

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

  const navItems = [
    { label: 'PROJECTS', target: '#projectList' },
    { label: 'CERTIFICATES', target: '#certificates' },
    { label: 'SKILLS', target: '#skills' },
    { label: 'CONTACT', target: '#contact' },
  ];

  const handleScroll = (target: string) => {
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: target, autoKill: true },
      ease: 'power3.inOut'
    });
  };

  return (
    <div ref={container} className='w-full px-[3vw] py-6 flex items-center justify-between relative z-50 opacity-0'>
      <div 
        onClick={() => handleScroll('#hero')}
        data-cursor="link"
        className='h-full flex justify-start font-heading cursor-pointer'
      >
        <span className='text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] font-extrabold text-primary uppercase tracking-tighter'>Meet</span>
      </div>

      {/* Navigation Links */}
      <div className='absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 font-heading'>
        {navItems.map((item) => (
          <span
            key={item.label}
            onClick={() => handleScroll(item.target)}
            data-cursor="link"
            className='text-[clamp(1rem,0.9rem+0.4vw,1.125rem)] font-bold text-heading cursor-pointer hover:text-primary transition-colors'
          >
            {item.label}
          </span>
        ))}
      </div>

      {/* Interactive Circular Text Badge */}
      <div
        className='relative pointer-events-auto select-none cursor-pointer flex items-center justify-center ml-2 scale-75 md:scale-100 origin-center'
        data-cursor="link"
      >
        <CircularText
          text="CODE•DESIGN•BUILD•"
          onHover="speedUp"
          spinDuration={15}
          className="text-[clamp(9px,0.8vw,11px)] font-heading font-black uppercase tracking-widest text-primary w-[64px] h-[64px] md:w-[70px] md:h-[70px]"
        />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(1.5rem,2vw,1.875rem)] leading-none opacity-50">
          🧿
        </span>
      </div>
    </div>
  )
}

export default Navbar;