'use client';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

const FloatingImage = ({
  projects,
  hoveredProjectName
}: {
  projects: { name: string; image: string }[];
  hoveredProjectName: string | null;
}) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const yTo = useRef<gsap.QuickToFunc>(null);
  const [lastActiveIndex, setLastActiveIndex] = useState(0);

  useEffect(() => {
    if (hoveredProjectName) {
      const idx = projects.findIndex(p => p.name === hoveredProjectName);
      if (idx !== -1) {
        setLastActiveIndex(idx);
      }
    }
  }, [hoveredProjectName, projects]);

  useGSAP(() => {
    // Center the image relative to the cursor
    gsap.set(imageRef.current, { yPercent: -50 });

    yTo.current = gsap.quickTo(imageRef.current, 'y', { duration: 0.4, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      if (yTo.current) {
        yTo.current(e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={imageRef}
      className={`fixed top-0 left-1/2 -translate-x-1/2 h-[15vmax] w-[30vmax] pointer-events-none z-50 transition-opacity duration-300 rounded-xl overflow-hidden bg-transparent ${hoveredProjectName ? 'opacity-100' : 'opacity-0'}`}
    >
      <div 
        className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateY(-${lastActiveIndex * 100}%)` }}
      >
        {projects.map((proj) => (
          <div key={proj.name} className="w-full h-full">
            <Image
              src={proj.image}
              alt={proj.name}
              width={400}
              height={400}
              className="object-cover h-full w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingImage;