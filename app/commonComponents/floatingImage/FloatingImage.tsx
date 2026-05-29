'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

const FloatingImage = ({ project }: { project: { name: string; image: string } | null }) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const yTo = useRef<gsap.QuickToFunc>(null);

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
      className={`fixed top-0 left-1/2 -translate-x-1/2 h-[15vmax] w-[30vmax] pointer-events-none z-50 transition-opacity duration-300 rounded-xl overflow-hidden bg-transparent ${project ? 'opacity-100' : 'opacity-0'}`}
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