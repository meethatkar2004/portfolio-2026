'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Loader = ({className}: {className?: string}) => {
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring1 = ring1Ref.current;
    const ring2 = ring2Ref.current;

    // Fast rotation for rings
    gsap.to(ring1, {
      rotate: 360,
      duration: 1,
      repeat: -1,
      ease: "none",
      force3D: true
    });

    gsap.to(ring2, {
      rotate: -360,
      duration: 1.5,
      repeat: -1,
      ease: "none",
      force3D: true
    });

    return () => {
      gsap.killTweensOf([ring1, ring2]);
    };
  }, []);

  return (
    <div className={`${className} flex items-center justify-center p-8`}>
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div 
          ref={ring1Ref}
          className="w-12 h-12 border-4 border-t-primary border-r-primary/20 border-b-primary/10 border-l-primary/5 rounded-full absolute"
        />
        
        {/* Inner Ring */}
        <div 
          ref={ring2Ref}
          className="w-8 h-8 border-4 border-b-primary border-l-primary/20 border-t-primary/10 border-r-primary/5 rounded-full absolute"
        />

        {/* Subtle Glow */}
        <div className="absolute w-16 h-16 blur-xl rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

export default Loader;