'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

interface FloatingImageProps {
  project: { name: string; image: string } | null;
  mousePosition: { y: number };
}


const FloatingImage = ({ project, mousePosition }: FloatingImageProps) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const yTo = useRef<gsap.QuickToFunc>(null);

  // GSAP quickTo creates a performance-optimized setter for x and y
  useGSAP(() => {
    // Set initial transform to center the image on the cursor
    gsap.set(imageRef.current, { xPercent: -50, yPercent: -50 });

    yTo.current = gsap.quickTo(imageRef.current, 'y', { duration: 0.4, ease: 'power3' });
  }, []);

  useEffect(() => {
    if (yTo.current) {
      yTo.current(mousePosition.y);
    }
  }, [mousePosition]);

  return (
    <div
      ref={imageRef}
      className={`fixed top-0 left-[48%] h-[15vmax] w-[30vmax] pointer-events-none z-50 shadow-2xl transition-opacity duration-300 rounded-xl overflow-hidden bg-transparent ${project ? 'opacity-100' : 'opacity-0'}`}
    >
      {project && (
        <Image
          src={project.image}
          alt={project.name}
          width={400}
          height={400}
          className="object-cover h-full w-full"
        />
      )}
    </div>
  );
};

export default FloatingImage;