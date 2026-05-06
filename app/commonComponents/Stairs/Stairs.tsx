'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

const Stairs = ({ children }: { children: React.ReactNode }) => {
  const loaderDivRef = useRef(null);
  const parentDivRef = useRef(null);
  const pathname = usePathname();

  useGSAP(() => {
    const tl = gsap.timeline();
    gsap.set(loaderDivRef.current, { display: "block" });
    gsap.set(".loading-bars", { height: "100vh", y: 0 });

    tl.to(".loading-bars", {
      y: "100%",
      ease: "power2.out",
      stagger: -0.08,
      duration: 0.5,
      delay: 2 // Showed after a delay of 2 seconds
    })
      .set(loaderDivRef.current, { display: "none" })
      .set(".loading-bars", { y: 0, height: 0 });

    gsap.fromTo(parentDivRef.current, {
      opacity: 0,
      scale: 1.2,
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      delay: 2, // Synchronized with the bars sliding down
      ease: "power2.out"
    });
  }, { dependencies: [pathname] });

  return (
    <div>
      <div id="stairs-loader" ref={loaderDivRef} className='h-screen w-full fixed top-0 left-0 z-999 pointer-events-none'>
        <div className='h-full w-full flex'>
          <div className="loading-bars w-1/6 bg-primary"></div>
          <div className="loading-bars w-1/6 bg-primary"></div>
          <div className="loading-bars w-1/6 bg-primary"></div>
          <div className="loading-bars w-1/6 bg-primary"></div>
          <div className="loading-bars w-1/6 bg-primary"></div>
          <div className="loading-bars w-1/6 bg-primary"></div>
        </div>
      </div>
      <div ref={parentDivRef}>
        {children}
      </div>
    </div>
  );
};

export default Stairs;
